import axios from "axios";

// The backend URL is injected at build time via Vite env vars.
// Set VITE_API_URL in client/.env (see .env.example).
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Sends a chat message (plus recent history) to the backend, which
 * securely forwards it to the Gemini API and returns the AI reply.
 *
 * @param {string} message - The new user message.
 * @param {{role: "user"|"model", text: string}[]} history - Prior turns for context.
 * @returns {Promise<string>} The AI's reply text.
 */
export async function sendChatMessage(message, history = []) {
  try {
    const { data } = await apiClient.post("/api/chat", { message, history });
    return data.reply;
  } catch (error) {
    if (error.response) {
      // Server responded with an error payload
      throw new Error(error.response.data?.error || "The server returned an error.");
    }
    if (error.request) {
      // Request was made but no response received (server down / network issue)
      throw new Error("Could not reach the server. Please check your connection and try again.");
    }
    throw new Error("Something went wrong while sending your message.");
  }
}

export default apiClient;
