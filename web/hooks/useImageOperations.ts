export interface GenerateParams {
  prompt: string;
}

export interface AnalyzeParams {
  imageFile: File;
  query?: string;
}

export interface UpscaleParams {
  imageFile: File;
  factor: string;
  format: string;
}

export interface RemoveBackgroundParams {
  imageFile: File;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export function useImageOperations() {
  const generateImage = async (params: GenerateParams): Promise<string> => {
    const res = await fetch(API_BASE + "generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: params.prompt }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to generate image");
    }

    const data = await res.json();
    return data.imageUrl;
  };

  const analyzeImage = async (params: AnalyzeParams): Promise<string> => {
    const formData = new FormData();
    formData.append("image", params.imageFile);
    if (params.query) {
      formData.append("query", params.query);
    }

    const res = await fetch(API_BASE + "analyze", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to analyze image");
    }

    const data = await res.json();
    return data.text;
  };

  const upscaleImage = async (params: UpscaleParams): Promise<string> => {
    const formData = new FormData();
    formData.append("image", params.imageFile);
    formData.append("upscale_factor", params.factor);
    formData.append("format", params.format);

    const res = await fetch(API_BASE + "upscale", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to upscale image");
    }

    const data = await res.json();

    // Handle different response formats
    if (data.data?.data?.url) return data.data.data.url;
    if (data.data?.url) return data.data.url;
    if (typeof data.data === "string") return data.data;

    throw new Error("Invalid response format from server");
  };

  const removeBackground = async (
    params: RemoveBackgroundParams
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("image", params.imageFile);

    const res = await fetch(API_BASE + "bgRemove", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove background");
      } else {
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }
    }

    const blob = await res.blob();
    return URL.createObjectURL(blob);
  };

  return {
    generateImage,
    analyzeImage,
    upscaleImage,
    removeBackground,
  };
}
