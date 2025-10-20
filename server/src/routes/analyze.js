import express from "express";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize Google AI
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    // Get the query from the request body (optional)
    const query = req.body.query || "Describe this image in detail.";

    // Convert buffer to base64
    const base64Image = req.file.buffer.toString("base64");

    // Prepare contents for the API
    const contents = [
      {
        inlineData: {
          mimeType: req.file.mimetype,
          data: base64Image,
        },
      },
      { text: query },
    ];

    // Generate content using Google AI
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: contents,
    });

    // Send the response
    res.json({
      success: true,
      text: response.text,
    });
  } catch (error) {
    console.error("Error analyzing image:", error);
    res.status(500).json({
      error: "Failed to analyze image",
      message: error.message,
    });
  }
});

export default router;
