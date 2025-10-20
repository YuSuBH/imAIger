"use client";

import Image from "next/image";
import { useState } from "react";

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
    } catch (err: any) {
      setError(err.message || "Unknown error");
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
    <div className="bg-gradient-to-r from-fuchsia-500 to-violet-600 h-dvh">
      <p>Describe the image you want to generate</p>
      <textarea
        placeholder="A futuristic city at sunset with flying cars..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="min-h-[200px] bg-background"
      ></textarea>
      <button
        onClick={generateImage}
        className="btn btn-primary bg-black"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {imageUrl ? (
        <div className="mt-4">
          <Image
            src={imageUrl}
            alt="Generated"
            width={200}
            height={200}
            className="rounded shadow-lg"
          />
          <button onClick={downloadImage} className="btn btn-primary bg-black">
            Download
          </button>
        </div>
      ) : (
        <p>Generated image will appear here...</p>
      )}
    </div>
  );
}
