import express from "express";
import multer from "multer";

const router = express.Router();

// Configure multer to store files in memory with size limit
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Background removal function using remove.bg API
async function removeBg(blob) {
  const formData = new FormData();
  formData.append("size", "auto");
  formData.append("image_file", blob);

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": process.env.REMOVE_BG_API_KEY },
    body: formData,
  });

  if (response.ok) {
    return await response.arrayBuffer();
  } else {
    const errorText = await response.text();
    throw new Error(
      `${response.status}: ${response.statusText} - ${errorText}`
    );
  }
}

router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    // Check if API key is configured
    if (!process.env.REMOVE_BG_API_KEY) {
      return res.status(500).json({
        error: "Remove.bg API key not configured",
        message: "Please set REMOVE_BG_API_KEY in environment variables",
      });
    }

    // Create a Blob from the uploaded file buffer
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });

    // Remove background
    const resultData = await removeBg(blob);

    // Convert ArrayBuffer to Buffer
    const imageBuffer = Buffer.from(resultData);

    // Send the processed image back
    res.set("Content-Type", "image/png");
    res.set("Content-Disposition", 'attachment; filename="no-bg.png"');
    res.send(imageBuffer);
  } catch (error) {
    console.error("Error removing background:", error);
    res.status(500).json({
      error: "Failed to remove background",
      message: error.message,
    });
  }
});

export default router;
