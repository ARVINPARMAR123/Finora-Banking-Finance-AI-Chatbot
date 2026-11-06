import { gemini, GEMINI_MODEL } from "../config/gemini.js";
import { BANKING_SYSTEM_INSTRUCTION } from "../prompts/banking.prompt.js";

/**
 * Generate a banking and finance-related AI response.
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
    },
  });

  // Extract generated text safely
  const generatedText = response.text?.trim();

  // Check whether Gemini generated a valid response
  if (!generatedText) {
    throw new Error("EMPTY_GEMINI_RESPONSE");
  }

  return generatedText;
};
