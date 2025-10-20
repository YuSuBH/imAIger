"use client";

import Image from "next/image";
import { useState } from "react";

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
    <div className="text-black bg-white h-dvh">
      <div>
        <p>Select an image to analyze</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="mb-4"
        />
        {selectedImage && (
          <div className="mt-4">
            <Image
              src={selectedImage}
              alt="Selected"
              width={200}
              height={200}
              className="rounded shadow-lg"
            />
            <textarea
              placeholder="What you want from the image? Describe here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[100px] bg-gray-100 p-2 rounded mt-2 w-full"
            ></textarea>
          </div>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button
          onClick={analyzeImage}
          disabled={loading || !selectedImage}
          className="btn btn-primary mt-4"
        >
          {loading ? "Analyzing..." : "Analyze Image"}
        </button>
      </div>

      {analysisResult && (
        <div>
          <p>{analysisResult}</p>
        </div>
      )}
    </div>
  );
}
