import { Router } from "express";
import { GoogleGenAI } from "@google/genai";

const router = Router();
let ai = null;
function getClient() {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured on the server.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_ITEMS = 20;


router.post("/", async (req, res) => {
  try {
    const { message, history } = req.body || {};

  
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "A non-empty 'message' string is required." });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        error: `Message is too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`,
      });
    }
    if (history && !Array.isArray(history)) {
      return res.status(400).json({ error: "'history' must be an array if provided." });
    }

    const client = getClient();

    
    const trimmedHistory = Array.isArray(history)
      ? history.slice(-MAX_HISTORY_ITEMS)
      : [];

    const contents = [
      ...trimmedHistory
        .filter((m) => m && typeof m.text === "string" && m.text.trim())
        .map((m) => ({
          role: m.role === "model" ? "model" : "user",
          parts: [{ text: String(m.text).slice(0, MAX_MESSAGE_LENGTH) }],
        })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await client.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction:
          "You are a friendly, helpful assistant embedded in a demo chat application. Keep answers concise and use Markdown formatting (lists, code blocks, bold) where it improves clarity.",
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const reply = response.text?.trim();

    if (!reply) {
      return res.status(502).json({ error: "The AI model returned an empty response." });
    }

    return res.json({ reply });
  } catch (err) {
    console.error("[Gemini Error]", err?.message || err);


    if (err?.message?.includes("GEMINI_API_KEY")) {
      return res.status(500).json({
        error: "The server is missing its Gemini API key configuration.",
      });
    }
    if (err?.status === 429 || err?.message?.toLowerCase().includes("quota")) {
      return res.status(429).json({
        error: "The AI service is rate-limited right now. Please try again shortly.",
      });
    }

    return res.status(500).json({
      error: "Failed to get a response from the AI model. Please try again.",
    });
  }
});

export default router;
