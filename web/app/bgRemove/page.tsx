"use client";

import Image from "next/image";
import { useState } from "react";

export default function BgRemovePage() {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setError("");
    setProcessedImage("");

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.onerror = () => {
      setError("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const removeBackground = async () => {
    if (!imageFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");
    setProcessedImage("");

    try {
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

      // Get the image blob from response
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "no-bg.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const reset = () => {
    setSelectedImage("");
    setImageFile(null);
    setProcessedImage("");
    setError("");
    if (processedImage) {
      URL.revokeObjectURL(processedImage);
    }
  };

  return (
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
              onChange={handleImageSelect}
              className="block w-full text-sm text-gray-700 file:border file:py-2 file:px-3 file:rounded file:border-gray-300 file:bg-white file:text-sm file:font-semibold hover:file:bg-gray-50"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={removeBackground}
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
                onClick={downloadImage}
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
                onClick={reset}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm rounded-md bg-white hover:bg-gray-50"
              >
                Reset
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Image */}
            <div>
              <h2 className="text-lg font-medium mb-3">Original</h2>
              <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-center bg-gray-50 min-h-[300px]">
                {selectedImage ? (
                  <div className="w-full">
                    <div className="bg-white rounded overflow-hidden shadow-sm p-2">
                      <Image
                        src={selectedImage}
                        alt="Original"
                        width={400}
                        height={400}
                        className="w-full h-auto object-contain rounded max-h-[400px]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-sm text-gray-500">
                    No image selected
                  </div>
                )}
              </div>
            </div>

            {/* Processed Image */}
            <div>
              <h2 className="text-lg font-medium mb-3">Background Removed</h2>
              <div
                className="border border-gray-200 rounded-lg p-4 flex items-center justify-center min-h-[300px]"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                }}
              >
                {processedImage ? (
                  <div className="w-full">
                    <Image
                      src={processedImage}
                      alt="Background Removed"
                      width={400}
                      height={400}
                      className="w-full h-auto object-contain rounded max-h-[400px]"
                    />
                  </div>
                ) : (
                  <div className="text-center text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-3 rounded">
                    {loading
                      ? "Processing..."
                      : "Processed image will appear here"}
                  </div>
                )}
              </div>
            </div>
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
  );
}
