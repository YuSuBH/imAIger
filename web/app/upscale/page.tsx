"use client";

import Image from "next/image";
import { useState } from "react";

export default function UpscalePage() {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [upscaledImageUrl, setUpscaledImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [upscaleFactor, setUpscaleFactor] = useState<string>("2");
  const [format, setFormat] = useState<string>("JPG");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setError("");
    setUpscaledImageUrl("");

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.onerror = () => {
      setError("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const upscaleImage = async () => {
    if (!imageFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");
    setUpscaledImageUrl("");

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("upscale_factor", upscaleFactor);
      formData.append("format", format);

      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE + "upscale", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to upscale image");
      }

      const data = await res.json();

      // Check if the response contains the upscaled image URL
      // Response structure: { success: true, data: { status: "success", data: { id: "...", url: "..." } } }
      if (data.data && data.data.data && data.data.data.url) {
        setUpscaledImageUrl(data.data.data.url);
      } else if (data.data && data.data.url) {
        setUpscaledImageUrl(data.data.url);
      } else if (data.data && typeof data.data === "string") {
        setUpscaledImageUrl(data.data);
      } else {
        console.error("Unexpected response format:", data);
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!upscaledImageUrl) return;

    fetch(upscaledImageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `upscaled-${upscaleFactor}x.${format.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        setError("Failed to download image: " + err.message);
      });
  };

  const reset = () => {
    setSelectedImage("");
    setImageFile(null);
    setUpscaledImageUrl("");
    setError("");
  };

  return (
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
              onChange={handleImageSelect}
              className="block w-full text-sm text-gray-700 file:border file:py-2 file:px-3 file:rounded file:border-gray-300 file:bg-white file:text-sm file:font-semibold hover:file:bg-gray-50"
            />
          </div>

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

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={upscaleImage}
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

            {(selectedImage || upscaledImageUrl) && (
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

            {/* Upscaled Image */}
            <div>
              <h2 className="text-lg font-medium mb-3">
                Upscaled ({upscaleFactor}x)
              </h2>
              <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-center bg-gray-50 min-h-[300px]">
                {upscaledImageUrl ? (
                  <div className="w-full">
                    <div className="bg-white rounded overflow-hidden shadow-sm p-2">
                      <Image
                        src={upscaledImageUrl}
                        alt="Upscaled"
                        width={400}
                        height={400}
                        className="w-full h-auto object-contain rounded max-h-[400px]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-sm text-gray-500">
                    {loading
                      ? "Processing..."
                      : "Upscaled image will appear here"}
                  </div>
                )}
              </div>
            </div>
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
  );
}
