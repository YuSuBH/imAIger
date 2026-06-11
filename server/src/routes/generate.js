import express from "express";

const router = express.Router();

// ── Provider: Cloudflare Workers AI ─────────────────────────────────────────

async function generateWithCloudflare(prompt) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error(
      "Cloudflare credentials not configured. Please set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN in server/.env"
    );
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
    signal: AbortSignal.timeout(60_000), // 60-second timeout
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 401) {
      throw new Error("Cloudflare: Invalid API token");
    }
    if (response.status === 429) {
      throw new Error("Cloudflare: Rate limit exceeded. Please try again later.");
    }
    throw new Error(`Cloudflare API error ${response.status}: ${errorText}`);
  }

  // Cloudflare Workers AI returns JSON: { result: { image: "<base64>" }, success: true }
  // The image field contains a base64-encoded JPEG string (NOT raw bytes).
  const data = await response.json();

  const b64 = data?.result?.image;
  if (!b64) {
    throw new Error(
      `Cloudflare returned no image data. Response: ${JSON.stringify(data)}`
    );
  }

  // The image is JPEG (Flux Schnell outputs JPEG)
  return `data:image/jpeg;base64,${b64}`;
}

// ── Route ────────────────────────────────────────────────────────────────────

router.post("/", async (req, res) => {
  const { prompt, provider = "cloudflare" } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  // For backward compatibility with history/cached state, we accept both values
  // but we always generate using Cloudflare Workers AI.
  console.log(`[generate] prompt="${prompt.slice(0, 80)}" (requested provider: ${provider}, generating with cloudflare)`);

  try {
    const imageUrl = await generateWithCloudflare(prompt);
    res.json({ imageUrl, prompt, provider: "cloudflare" });
  } catch (error) {
    console.error(`[generate] Error:`, error.message);

    const message = error.message || "Failed to generate image";

    if (
      message.includes("credentials") ||
      message.includes("not configured")
    ) {
      return res.status(503).json({ error: message });
    }
    if (message.includes("Rate limit") || message.includes("rate limit")) {
      return res.status(429).json({ error: message });
    }
    if (message.includes("Invalid API token")) {
      return res.status(401).json({ error: message });
    }

    res.status(500).json({ error: message });
  }
});

export default router;
