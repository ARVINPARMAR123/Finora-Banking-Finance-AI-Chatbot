import { gemini, GEMINI_MODEL } from "../config/gemini.js";
import { BANKING_SYSTEM_INSTRUCTION } from "../prompts/banking.prompt.js";

/**
 * Generate a banking and finance-related AI response.
 *
 * Includes:
 * - Automatic retry
 * - Exponential backoff
 * - Random jitter
 * - Request timeout
 * - Empty response validation
 *
 * @param {string} message
 * @returns {Promise<string>}
 */
export const generateBankingResponse = async (message) => {
  const response = await gemini.models.generateContent({
    model: GEMINI_MODEL,
    contents: message,
    config: {
      systemInstruction: BANKING_SYSTEM_INSTRUCTION,
      httpOptions: {
        timeout: 30000,
        retryOptions: {
          attempts: 3,
          initialDelay: 1,
          maxDelay: 4,
          expBase: 2,
          jitter: 1,
          httpStatusCodes: [408, 429, 500, 502, 503, 504],
        },
      },
    },
  });

  // Extract generated response
  const generatedText = response.text?.trim();

  // Validate AI response
  if (!generatedText) {
    throw new Error("EMPTY_GEMINI_RESPONSE");
  }

  return generatedText;
};
