import { GoogleGenAI } from "@google/genai";

// Read API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Read the configured Gemini model
export const GEMINI_MODEL =
  process.env.GEMINI_MODEL || "gemini-flash-lite-latest";

// Check whether the API key exists
if (!GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY is missing. Please configure it in the backend .env file."
  );
}

// Create Gemini AI client
export const gemini = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});
