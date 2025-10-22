"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import VoiceInput from "@/components/VoiceInput";

type ActionType = "GENERATE" | "ANALYZE" | "UPSCALE" | "REMOVE_BG";

interface InterpretResponse {
  action: ActionType;
  reasoning: string;
  parameters: {
    upscaleFactor?: string;
    format?: string;
    query?: string;
  };
}

export default function PlayGroundPage() {
  // Image states
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<string>("");

  // UI states
  const [prompt, setPrompt] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<ActionType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysisText, setAnalysisText] = useState<string>("");

  // Config states (for upscale)
  const [upscaleFactor, setUpscaleFactor] = useState<string>("2");
  const [format, setFormat] = useState<string>("JPG");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setError("");
    setResultImage("");
    setAnalysisText("");

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.onerror = () => {
      setError("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateImage = async (generationPrompt: string) => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE + "generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: generationPrompt }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to generate image");
    }

    const data = await res.json();
    setResultImage(data.imageUrl);
    setAnalysisText("");
  };

  const handleAnalyzeImage = async (query?: string) => {
    if (!imageFile) throw new Error("No image selected");

    const formData = new FormData();
    formData.append("image", imageFile);
    if (query) {
      formData.append("query", query);
    }

    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE + "analyze", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to analyze image");
    }

    const data = await res.json();
    setAnalysisText(data.text);
    setResultImage("");
  };

  const handleUpscaleImage = async (factor: string, fmt: string) => {
    if (!imageFile) throw new Error("No image selected");

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("upscale_factor", factor);
    formData.append("format", fmt);

    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE + "upscale", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to upscale image");
    }

    const data = await res.json();

    if (data.data && data.data.data && data.data.data.url) {
      setResultImage(data.data.data.url);
    } else if (data.data && data.data.url) {
      setResultImage(data.data.url);
    } else if (data.data && typeof data.data === "string") {
      setResultImage(data.data);
    } else {
      throw new Error("Invalid response format from server");
    }
    setAnalysisText("");
  };

  const handleRemoveBackground = async () => {
    if (!imageFile) throw new Error("No image selected");

    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE + "bgRemove", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove background");
      } else {
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setResultImage(url);
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
      const interpretRes = await fetch(
        process.env.NEXT_PUBLIC_API_BASE + "interpret",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            hasImage: !!imageFile,
          }),
        }
      );

      if (!interpretRes.ok) {
        const data = await interpretRes.json();
        throw new Error(data.error || "Failed to interpret prompt");
      }

      const interpretation: InterpretResponse = await interpretRes.json();

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
    setSelectedImage("");
    setImageFile(null);
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

  const canSubmit = !loading && (prompt || imageFile);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-indigo-600">AI Playground</h2>
          <p className="text-xs text-gray-500 mt-1">All-in-one image tools</p>
        </div>

        {/* Configuration Panel */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Upscale Settings
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Upscale Factor
              </label>
              <select
                value={upscaleFactor}
                onChange={(e) => setUpscaleFactor(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="2">2x (Double)</option>
                <option value="4">4x (Quadruple)</option>
                <option value="6">6x (Six times)</option>
                <option value="8">8x (Eight times)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Output Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="JPG">JPG</option>
                <option value="PNG">PNG</option>
              </select>
            </div>
          </div>
        </div>

        {/* History Placeholder */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 mb-2">History</h3>
          <p className="text-xs text-gray-400">Coming soon...</p>
        </div>
      </aside>

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
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Original Image
                </h2>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                >
                  Upload
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              <div
                className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex items-center justify-center bg-gray-50"
                style={{ minHeight: "400px" }}
              >
                {selectedImage ? (
                  <div className="w-full">
                    <Image
                      src={selectedImage}
                      alt="Original"
                      width={500}
                      height={400}
                      className="w-full h-auto object-contain rounded max-h-[400px]"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">
                      No image uploaded
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Result */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Result</h2>
                {resultImage && (
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
                )}
              </div>

              <div
                className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex items-center justify-center bg-gray-50"
                style={{ minHeight: "400px" }}
              >
                {loading ? (
                  <div className="text-center">
                    <svg
                      className="animate-spin h-10 w-10 text-indigo-600 mx-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    <p className="mt-3 text-sm text-gray-600">Processing...</p>
                  </div>
                ) : resultImage ? (
                  <div className="w-full">
                    <Image
                      src={resultImage}
                      alt="Result"
                      width={500}
                      height={400}
                      className="w-full h-auto object-contain rounded max-h-[400px]"
                    />
                  </div>
                ) : analysisText ? (
                  <div className="w-full max-h-[400px] overflow-y-auto">
                    <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap">
                      {analysisText}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">
                      Results will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Prompt Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Instruction Text or Options */}
            <div className="mb-4">
              {!imageFile ? (
                <p className="text-sm text-gray-600 italic">
                  Describe the image you want to generate...
                </p>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Choose an action or describe what you want:
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setSelectedOption(
                          selectedOption === "ANALYZE" ? null : "ANALYZE"
                        )
                      }
                      className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                        selectedOption === "ANALYZE"
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Analyze
                    </button>
                    <button
                      onClick={() =>
                        setSelectedOption(
                          selectedOption === "UPSCALE" ? null : "UPSCALE"
                        )
                      }
                      className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                        selectedOption === "UPSCALE"
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Upscale
                    </button>
                    <button
                      onClick={() =>
                        setSelectedOption(
                          selectedOption === "REMOVE_BG" ? null : "REMOVE_BG"
                        )
                      }
                      className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                        selectedOption === "REMOVE_BG"
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Remove BG
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Input */}
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    !imageFile
                      ? "A futuristic city at sunset with flying cars..."
                      : selectedOption
                      ? "Optional: Add specific instructions..."
                      : "Describe what you want to do with this image..."
                  }
                  className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg resize-vertical focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey && canSubmit) {
                      handleSubmit();
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Press Ctrl+Enter to submit
                </p>
              </div>

              <VoiceInput
                onTranscript={(text) => setPrompt((prev) => prev + " " + text)}
                disabled={loading}
              />

              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-[100px] flex flex-col items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    <span className="text-xs mt-2">Processing...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                    <span className="text-xs mt-2">Submit</span>
                  </>
                )}
              </button>

              {(selectedImage || resultImage) && (
                <button
                  onClick={handleReset}
                  className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors h-[100px] flex flex-col items-center justify-center"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="text-xs mt-2">Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              💡 How it works:
            </h3>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>
                <strong>No image + prompt:</strong> Generate a new image
              </li>
              <li>
                <strong>Image only:</strong> Analyze the image
              </li>
              <li>
                <strong>Image + option selected:</strong> Execute the selected
                action
              </li>
              <li>
                <strong>Image + prompt:</strong> AI interprets and executes the
                best action
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
