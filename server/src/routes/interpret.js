import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { prompt, hasImage } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const systemPrompt = `You are an AI assistant that interprets user prompts for an image processing application.
The application has these capabilities:
1. GENERATE: Create a new image from a text description
2. ANALYZE: Extract information or describe an uploaded image
3. UPSCALE: Enhance image resolution (2x, 4x, 6x, or 8x)
4. REMOVE_BG: Remove background from an image

User context:
- Has image uploaded: ${hasImage}

Based on the user's prompt, determine:
1. Which action to perform (GENERATE, ANALYZE, UPSCALE, REMOVE_BG)
2. Any specific parameters (for upscale: factor 2/4/6/8, format JPG/PNG)

Rules:
- If NO image is uploaded, the ONLY valid action is GENERATE
- If image is uploaded without specific instruction, default to ANALYZE
- Keywords for UPSCALE: "upscale", "enhance", "increase resolution", "make bigger", "improve quality"
- Keywords for REMOVE_BG: "remove background", "transparent", "cut out", "isolate subject"
- Keywords for ANALYZE: "analyze", "describe", "what is", "tell me about", "extract text"
- For UPSCALE, detect factor from words like "double" (2x), "triple", "quadruple" (4x), "six times" (6x), "eight times" (8x)

Respond ONLY with a valid JSON object in this exact format:
{
  "action": "GENERATE" | "ANALYZE" | "UPSCALE" | "REMOVE_BG",
  "reasoning": "brief explanation",
  "parameters": {
    "upscaleFactor": "2" | "4" | "6" | "8",
    "format": "JPG" | "PNG",
    "query": "any specific analysis query or generation prompt"
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ text: systemPrompt }, { text: `User prompt: "${prompt}"` }],
    });

    const text = response.text;

    // Extract JSON from the response (handle markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.slice(7, -3).trim();
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.slice(3, -3).trim();
    }

    const interpretation = JSON.parse(jsonText);

    // Validate the response
    const validActions = ["GENERATE", "ANALYZE", "UPSCALE", "REMOVE_BG"];
    if (!validActions.includes(interpretation.action)) {
      throw new Error("Invalid action returned by AI");
    }

    // Apply business rules
    if (!hasImage && interpretation.action !== "GENERATE") {
      interpretation.action = "GENERATE";
      interpretation.reasoning =
        "No image uploaded, defaulting to image generation";
      interpretation.parameters.query = prompt;
    }

    res.json(interpretation);
  } catch (error) {
    console.error("Interpret error:", error);
    res.status(500).json({
      error: "Failed to interpret prompt",
      details: error.message,
    });
  }
});

export default router;
