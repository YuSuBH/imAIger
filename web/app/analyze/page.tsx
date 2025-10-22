"use client";

import { useState } from "react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useImageOperations } from "@/hooks/useImageOperations";
import { saveToHistory } from "@/lib/historyUtils";
import ImageCard from "@/components/ImageCard";
import ImagePreview from "@/components/ImagePreview";
import ErrorMessage from "@/components/ErrorMessage";
import PromptInput from "@/components/PromptInput";
import Navbar from "@/components/Navbar";

export default function AnalyzePage() {
  const { selectedImage, imageFile, error, handleImageSelect, setError } =
    useImageUpload();
  const { analyzeImage: analyzeImageAPI } = useImageOperations();

  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
      setAnalysisResult("");
    }
  };

  const analyzeImage = async () => {
    if (!imageFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await analyzeImageAPI({ imageFile, query });
      setAnalysisResult(result);

      // Save to history
      saveToHistory({
        type: "analyze",
        input: {
          imageName: imageFile.name,
          query: query || "No specific query",
        },
        output: { text: result },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-dvh bg-gray-50 text-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-semibold mb-4">Analyze Image</h1>

            <p className="text-sm text-gray-600 mb-3">
              Select an image to analyze and optionally add a prompt for what
              you want extracted or described.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-700 file:border file:py-2 file:px-3 file:rounded file:border-gray-300 file:bg-white file:text-sm file:font-semibold hover:file:bg-gray-50"
                />

                <ErrorMessage message={error} onDismiss={() => setError("")} />

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prompt (optional)
                  </label>
                  <PromptInput
                    value={query}
                    onChange={setQuery}
                    onSubmit={analyzeImage}
                    placeholder="What you want from the image? Describe here..."
                    disabled={loading}
                  />
                </div>

                <div className="mt-4">
                  <button
                    onClick={analyzeImage}
                    disabled={loading || !selectedImage}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading && (
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    )}
                    {loading ? "Analyzing..." : "Analyze Image"}
                  </button>
                </div>
              </div>

              <div className="w-full sm:w-80">
                <ImageCard title="Preview">
                  <ImagePreview
                    src={selectedImage}
                    alt="Selected"
                    emptyMessage="No image selected"
                  />
                </ImageCard>
              </div>
            </div>
          </div>

          {analysisResult && (
            <div className="mt-6 bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium mb-2">Analysis Result</h2>
              <div className="prose max-w-none text-sm text-gray-800 whitespace-pre-wrap">
                {analysisResult}
              </div>
            </div>
          )}

          {!analysisResult && !loading && (
            <div className="mt-4 text-sm text-gray-500">
              Results will appear here after analysis.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
