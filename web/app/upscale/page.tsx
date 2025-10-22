"use client";

import { useState } from "react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useImageOperations } from "@/hooks/useImageOperations";
import { downloadImage as downloadImageUtil } from "@/lib/imageUtils";
import { saveToHistory } from "@/lib/historyUtils";
import ImageCard from "@/components/ImageCard";
import ImagePreview from "@/components/ImagePreview";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import Navbar from "@/components/Navbar";

export default function UpscalePage() {
  const {
    selectedImage,
    imageFile,
    error,
    handleImageSelect,
    clearImage,
    setError,
  } = useImageUpload();
  const { upscaleImage: upscaleImageAPI } = useImageOperations();

  const [upscaledImageUrl, setUpscaledImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [upscaleFactor, setUpscaleFactor] = useState<string>("2");
  const [format, setFormat] = useState<string>("JPG");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
      setUpscaledImageUrl("");
    }
  };

  const handleUpscale = async () => {
    if (!imageFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");
    setUpscaledImageUrl("");

    try {
      const url = await upscaleImageAPI({
        imageFile,
        factor: upscaleFactor,
        format,
      });
      setUpscaledImageUrl(url);

      // Save to history
      saveToHistory({
        type: "upscale",
        input: {
          imageName: imageFile.name,
          factor: upscaleFactor,
        },
        output: { imageUrl: url },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (upscaledImageUrl) {
      try {
        downloadImageUtil(
          upscaledImageUrl,
          `upscaled-${upscaleFactor}x.${format.toLowerCase()}`
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to download");
      }
    }
  };

  const handleReset = () => {
    clearImage();
    setUpscaledImageUrl("");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-dvh bg-gray-50 text-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-semibold mb-4">Image Upscaling</h1>

            <p className="text-sm text-gray-600 mb-6">
              Upload an image to upscale it using AI. Choose the upscale factor
              and output format to enhance your image quality.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-700 file:border file:py-2 file:px-3 file:rounded file:border-gray-300 file:bg-white file:text-sm file:font-semibold hover:file:bg-gray-50"
              />
            </div>

            <ErrorMessage message={error} onDismiss={() => setError("")} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upscale Factor
                </label>
                <select
                  value={upscaleFactor}
                  onChange={(e) => setUpscaleFactor(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                >
                  <option value="2">2x (Double)</option>
                  <option value="4">4x (Quadruple)</option>
                  <option value="6">6x (Six times)</option>
                  <option value="8">8x (Eight times)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Output Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                >
                  <option value="JPG">JPG</option>
                  <option value="PNG">PNG</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handleUpscale}
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
                {loading ? "Upscaling..." : "Upscale Image"}
              </button>

              {upscaledImageUrl && (
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm rounded-md bg-white hover:bg-gray-50"
                >
                  <svg
                    className="w-4 h-4 mr-2"
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

              {(selectedImage || upscaledImageUrl) && (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm rounded-md bg-white hover:bg-gray-50"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Image */}
              <ImageCard title="Original" minHeight="300px">
                <ImagePreview
                  src={selectedImage}
                  alt="Original"
                  emptyMessage="No image selected"
                />
              </ImageCard>

              {/* Upscaled Image */}
              <ImageCard
                title={`Upscaled (${upscaleFactor}x)`}
                minHeight="300px"
                action={
                  upscaledImageUrl ? (
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
              >
                {loading ? (
                  <LoadingSpinner message="Upscaling image..." />
                ) : (
                  <ImagePreview
                    src={upscaledImageUrl}
                    alt="Upscaled"
                    emptyMessage="Upscaled image will appear here"
                  />
                )}
              </ImageCard>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
              <p className="font-medium mb-1">💡 Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>
                  Higher upscale factors (6x, 8x) work best on smaller images
                </li>
                <li>Maximum file size: 10MB</li>
                <li>PNG format preserves transparency, JPG is smaller</li>
                <li>Processing time increases with higher upscale factors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
