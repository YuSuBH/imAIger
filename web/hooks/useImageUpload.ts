import { useState } from "react";

export function useImageUpload() {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleImageSelect = (file: File | null) => {
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

  const clearImage = () => {
    setSelectedImage("");
    setImageFile(null);
    setError("");
  };

  return {
    selectedImage,
    imageFile,
    error,
    handleImageSelect,
    clearImage,
    setError,
  };
}
