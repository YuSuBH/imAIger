"use client";

import { useState } from "react";
import { useImageOperations } from "@/hooks/useImageOperations";
import { downloadImage as downloadImageUtil } from "@/lib/imageUtils";
import ImageCard from "@/components/ImageCard";
import ImagePreview from "@/components/ImagePreview";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import PromptInput from "@/components/PromptInput";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { generateImage: generateImageAPI } = useImageOperations();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError("");
    setImageUrl("");

    try {
      const url = await generateImageAPI({ prompt });
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      try {
        downloadImageUtil(imageUrl, "ai-generated-image.png");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to download");
      }
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold mb-3">Generate Image</h1>
          <p className="text-sm text-gray-600 mb-4">
            Describe the image you want to generate. The AI will return a single
            image URL.
          </p>

          <ErrorMessage message={error} onDismiss={() => setError("")} />

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prompt
            </label>
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleGenerate}
              placeholder="A futuristic city at sunset with flying cars..."
              disabled={loading}
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
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
              {loading ? "Generating..." : "Generate Image"}
            </button>

            {imageUrl && (
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm rounded-md bg-white hover:bg-gray-50"
              >
                Download
              </button>
            )}
          </div>
        </div>

        <div className="mt-6">
          <ImageCard
            title="Generated Image"
            action={
              imageUrl ? (
                <button
                  onClick={handleDownload}
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
            minHeight="300px"
          >
            {loading ? (
              <LoadingSpinner message="Generating image..." />
            ) : (
              <ImagePreview
                src={imageUrl}
                alt="Generated"
                emptyMessage="Generated image will appear here..."
              />
            )}
          </ImageCard>
        </div>

        {imageUrl && !loading && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Right-click the image to open in a new tab or use the Download
            button.
          </div>
        )}
      </div>
    </div>
  );
}
