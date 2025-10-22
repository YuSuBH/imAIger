"use client";

import { useState, useRef } from "react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useImageOperations } from "@/hooks/useImageOperations";
import { useAIInterpret, ActionType } from "@/hooks/useAIInterpret";
import PlaygroundSidebar from "@/components/PlaygroundSidebar";
import PlaygroundPromptSection from "@/components/PlaygroundPromptSection";
import PlaygroundInfoBox from "@/components/PlaygroundInfoBox";
import ErrorMessage from "@/components/ErrorMessage";
import ImageCard from "@/components/ImageCard";
import ImagePreview from "@/components/ImagePreview";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function PlayGroundPage() {
  // Custom hooks
  const { selectedImage, imageFile, handleImageSelect, clearImage } =
    useImageUpload();
  const { generateImage, analyzeImage, upscaleImage, removeBackground } =
    useImageOperations();
  const { interpretPrompt } = useAIInterpret();

  // Result states
  const [resultImage, setResultImage] = useState<string>("");
  const [analysisText, setAnalysisText] = useState<string>("");

  // UI states
  const [prompt, setPrompt] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<ActionType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Config states (for upscale)
  const [upscaleFactor, setUpscaleFactor] = useState<string>("2");
  const [format, setFormat] = useState<string>("JPG");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleImageSelect(file);
    setError("");
    setResultImage("");
    setAnalysisText("");
  };

  const handleGenerateImage = async (generationPrompt: string) => {
    const imageUrl = await generateImage({ prompt: generationPrompt });
    setResultImage(imageUrl);
    setAnalysisText("");
  };

  const handleAnalyzeImage = async (query?: string) => {
    if (!imageFile) throw new Error("No image selected");
    const text = await analyzeImage({ imageFile, query });
    setAnalysisText(text);
    setResultImage("");
  };

  const handleUpscaleImage = async (factor: string, fmt: string) => {
    if (!imageFile) throw new Error("No image selected");
    const imageUrl = await upscaleImage({ imageFile, factor, format: fmt });
    setResultImage(imageUrl);
    setAnalysisText("");
  };

  const handleRemoveBackground = async () => {
    if (!imageFile) throw new Error("No image selected");
    const blobUrl = await removeBackground({ imageFile });
    setResultImage(blobUrl);
    setAnalysisText("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResultImage("");
    setAnalysisText("");

    try {
      // Case 1: Manual option selected (no AI interpretation needed)
      if (selectedOption) {
        switch (selectedOption) {
          case "ANALYZE":
            await handleAnalyzeImage(prompt);
            break;
          case "UPSCALE":
            await handleUpscaleImage(upscaleFactor, format);
            break;
          case "REMOVE_BG":
            await handleRemoveBackground();
            break;
        }
        return;
      }

      // Case 2: Need AI interpretation
      if (!prompt && !imageFile) {
        throw new Error("Please provide a prompt or upload an image");
      }

      // If only image, default to analyze
      if (imageFile && !prompt) {
        await handleAnalyzeImage();
        return;
      }

      // If only prompt, default to generate
      if (prompt && !imageFile) {
        await handleGenerateImage(prompt);
        return;
      }

      // Both image and prompt: use AI interpretation
      const interpretation = await interpretPrompt(prompt, !!imageFile);

      // Execute the interpreted action
      switch (interpretation.action) {
        case "GENERATE":
          await handleGenerateImage(interpretation.parameters.query || prompt);
          break;
        case "ANALYZE":
          await handleAnalyzeImage(interpretation.parameters.query);
          break;
        case "UPSCALE":
          const factor =
            interpretation.parameters.upscaleFactor || upscaleFactor;
          const fmt = interpretation.parameters.format || format;
          await handleUpscaleImage(factor, fmt);
          break;
        case "REMOVE_BG":
          await handleRemoveBackground();
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    clearImage();
    setResultImage("");
    setAnalysisText("");
    setPrompt("");
    setSelectedOption(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadImage = () => {
    if (!resultImage) return;

    fetch(resultImage)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `result-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        setError("Failed to download image: " + err.message);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <PlaygroundSidebar
        upscaleFactor={upscaleFactor}
        format={format}
        onUpscaleFactorChange={setUpscaleFactor}
        onFormatChange={setFormat}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Upload Image
            </h1>
            <p className="text-gray-600">
              Upload an image to process it, or describe an image to generate
              one
            </p>
          </div>

          {/* Image Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Left: Uploaded Image */}
            <ImageCard
              title="Original Image"
              action={
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                >
                  Upload
                </button>
              }
              minHeight="400px"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileInputChange}
                className="hidden"
              />
              <ImagePreview src={selectedImage} alt="Original" />
            </ImageCard>

            {/* Right: Result */}
            <ImageCard
              title="Result"
              action={
                resultImage ? (
                  <button
                    onClick={downloadImage}
                    className="inline-flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </button>
                ) : undefined
              }
              minHeight="400px"
            >
              {loading ? (
                <LoadingSpinner size="lg" message="Processing..." />
              ) : resultImage ? (
                <ImagePreview src={resultImage} alt="Result" />
              ) : analysisText ? (
                <div className="w-full max-h-[400px] overflow-y-auto">
                  <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap">
                    {analysisText}
                  </div>
                </div>
              ) : (
                <ImagePreview src="" alt="Results will appear here" />
              )}
            </ImageCard>
          </div>

          {/* Error Message */}
          {error && (
            <ErrorMessage message={error} onDismiss={() => setError("")} />
          )}

          {/* Prompt Section */}
          <PlaygroundPromptSection
            prompt={prompt}
            loading={loading}
            hasImage={!!imageFile}
            selectedOption={selectedOption}
            hasResult={!!(selectedImage || resultImage)}
            onPromptChange={setPrompt}
            onOptionSelect={setSelectedOption}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />

          {/* Info Box */}
          <PlaygroundInfoBox />
        </div>
      </main>
    </div>
  );
}
