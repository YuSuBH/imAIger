"use client";

import Image from "next/image";
import { useState } from "react";
import VoiceInput from "@/components/VoiceInput";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateImage = async () => {
    setLoading(true);
    setError("");
    setImageUrl("");
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE + "generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate image");
      }
      const data = await res.json();
      setImageUrl(data.imageUrl);
    } catch (err: unknown) {
      // avoid explicit `any` to satisfy eslint rule; extract message safely
      const message =
        err instanceof Error ? err.message : String(err ?? "Unknown error");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!imageUrl) return;

    fetch(imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "ai-generated-image.png";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      });
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

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prompt
          </label>
          <div className="flex gap-2">
            <textarea
              placeholder="A futuristic city at sunset with flying cars..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 min-h-[140px] p-3 border border-gray-200 rounded resize-vertical focus:outline-none focus:ring-2 focus:ring-indigo-200"
            ></textarea>
            <VoiceInput
              onTranscript={(text) => setPrompt((prev) => prev + " " + text)}
              disabled={loading}
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={generateImage}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
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
                onClick={downloadImage}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm rounded-md bg-white hover:bg-gray-50"
              >
                Download
              </button>
            )}
          </div>

          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

          <div className="mt-6">
            <h2 className="text-lg font-medium mb-2">Preview</h2>
            <div className="border border-dashed border-gray-200 rounded-lg p-4 flex items-center justify-center bg-gray-50 min-h-[200px]">
              {imageUrl ? (
                <div className="w-full flex flex-col items-center gap-3">
                  <div className="bg-white rounded overflow-hidden shadow p-2">
                    <Image
                      src={imageUrl}
                      alt="Generated"
                      width={512}
                      height={384}
                      className="max-w-full h-auto object-contain rounded"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Right-click the image to open or use the Download button.
                  </div>
                </div>
              ) : (
                <div className="text-center text-sm text-gray-500">
                  Generated image will appear here...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
