"use client";

import Image from "next/image";
import { useState } from "react";
import VoiceInput from "@/components/VoiceInput";

export default function AnalyzePage() {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysisResult, setAnalysisResult] = useState<string>("");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.onerror = () => {
      setError("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!imageFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");

    try {
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
      setAnalysisResult(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-semibold mb-4">Analyze Image</h1>

          <p className="text-sm text-gray-600 mb-3">
            Select an image to analyze and optionally add a prompt for what you
            want extracted or described.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="block w-full text-sm text-gray-700 file:border file:py-2 file:px-3 file:rounded file:border-gray-300 file:bg-white file:text-sm file:font-semibold hover:file:bg-gray-50"
              />

              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prompt (optional)
                </label>
                <div className="flex gap-2">
                  <textarea
                    placeholder="What you want from the image? Describe here..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 min-h-[120px] p-3 border border-gray-200 rounded resize-vertical focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  ></textarea>
                  <VoiceInput
                    onTranscript={(text) =>
                      setQuery((prev) => prev + " " + text)
                    }
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={analyzeImage}
                  disabled={loading || !selectedImage}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed`}
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
              <div className="border border-dashed border-gray-200 rounded-lg h-full p-3 flex items-center justify-center bg-gray-50">
                {!selectedImage ? (
                  <div className="text-center text-sm text-gray-500">
                    No image selected
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="bg-white rounded overflow-hidden shadow-sm p-2">
                      <Image
                        src={selectedImage}
                        alt="Selected"
                        width={320}
                        height={240}
                        className="w-full h-auto object-contain rounded"
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-2 text-center">
                      Preview
                    </div>
                  </div>
                )}
              </div>
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

        {!analysisResult && (
          <div className="mt-4 text-sm text-gray-500">
            Results will appear here after analysis.
          </div>
        )}
      </div>
    </div>
  );
}
