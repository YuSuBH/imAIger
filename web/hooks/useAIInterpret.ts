import { useState } from "react";

export type ActionType = "GENERATE" | "ANALYZE" | "UPSCALE" | "REMOVE_BG";

export interface InterpretResponse {
  action: ActionType;
  reasoning: string;
  parameters: {
    upscaleFactor?: string;
    format?: string;
    query?: string;
  };
}

export function useAIInterpret() {
  const [isInterpreting, setIsInterpreting] = useState(false);

  const interpretPrompt = async (
    prompt: string,
    hasImage: boolean
  ): Promise<InterpretResponse> => {
    setIsInterpreting(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE + "interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, hasImage }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to interpret prompt");
      }

      return await res.json();
    } finally {
      setIsInterpreting(false);
    }
  };

  return { interpretPrompt, isInterpreting };
}
