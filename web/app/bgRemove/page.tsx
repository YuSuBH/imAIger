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

export default function BgRemovePage() {
  const {
    selectedImage,
    imageFile,
    error,
    handleImageSelect,
    clearImage,
    setError,
  } = useImageUpload();
  const { removeBackground: removeBackgroundAPI } = useImageOperations();

  const [processedImage, setProcessedImage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
      setProcessedImage("");
    }
  };

  const handleRemoveBackground = async () => {
    if (!imageFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");
    setProcessedImage("");

    try {
      const url = await removeBackgroundAPI({ imageFile });
      setProcessedImage(url);

      // Save to history
      saveToHistory({
        type: "bgRemove",
        input: { imageName: imageFile.name },
        output: { imageUrl: url },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      try {
        downloadImageUtil(processedImage, "no-bg.png");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to download");
      }
    }
  };

  const handleReset = () => {
    clearImage();
    if (processedImage) {
      URL.revokeObjectURL(processedImage);
    }
    setProcessedImage("");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-dvh bg-gray-50 text-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-semibold mb-4">Background Removal</h1>

            <p className="text-sm text-gray-600 mb-6">
              Upload an image to automatically remove its background. The result
              will be a PNG image with a transparent background.
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

            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handleRemoveBackground}
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
                {loading ? "Processing..." : "Remove Background"}
              </button>

              {processedImage && (
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

              {(selectedImage || processedImage) && (
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

              {/* Processed Image with checkered background */}
              <ImageCard
                title="Background Removed"
                minHeight="300px"
                action={
                  processedImage ? (
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
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                  }}
                >
                  {loading ? (
                    <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded">
                      <LoadingSpinner message="Removing background..." />
                    </div>
                  ) : processedImage ? (
                    <ImagePreview
                      src={processedImage}
                      alt="Background Removed"
                    />
                  ) : (
                    <div className="text-center text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-3 rounded">
                      Processed image will appear here
                    </div>
                  )}
                </div>
              </ImageCard>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
              <p className="font-medium mb-1">💡 Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Works best with clear subjects and distinct backgrounds</li>
                <li>Maximum file size: 10MB</li>
                <li>Result will be a PNG image with transparent background</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
