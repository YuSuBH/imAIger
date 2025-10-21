import express from "express";
import multer from "multer";

const router = express.Router();

// Configure multer to store files in memory with size limit
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    // Check if API key is configured
    if (!process.env.PICSART_API_KEY) {
      return res.status(500).json({
        error: "Picsart API key not configured",
        message: "Please set PICSART_API_KEY in environment variables",
      });
    }

    // Get upscale factor from request body (default to 2x)
    const upscaleFactor = req.body.upscale_factor || "2";
    const format = req.body.format || "JPG";

    // Validate upscale factor
    if (!["2", "4", "6", "8"].includes(upscaleFactor)) {
      return res.status(400).json({
        error: "Invalid upscale factor",
        message: "Upscale factor must be 2, 4, 6, or 8",
      });
    }

    // Create FormData for Picsart API
    const formData = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append("image", blob, req.file.originalname);
    formData.append("upscale_factor", upscaleFactor);
    formData.append("format", format);

    // Call Picsart API directly
    const response = await fetch("https://api.picsart.io/tools/1.0/upscale", {
      method: "POST",
      headers: {
        "X-Picsart-API-Key": process.env.PICSART_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Picsart API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();

    // The API returns the upscaled image URL
    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error upscaling image:", error);
    res.status(500).json({
      error: "Failed to upscale image",
      message: error.message,
    });
  }
});

export default router;
