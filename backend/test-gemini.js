import "dotenv/config";

import { gemini, GEMINI_MODEL } from "./src/config/gemini.js";

import { BANKING_SYSTEM_INSTRUCTION } from "./src/prompts/banking.prompt.js";

const testGeminiConnection = async () => {
  try {
    console.log("Testing Gemini with banking system instructions...");
    console.log("Model:", GEMINI_MODEL);

    const response = await gemini.models.generateContent({
      model: GEMINI_MODEL,

      contents: "What is a savings account? Explain its benefits.",

      config: {
        systemInstruction: BANKING_SYSTEM_INSTRUCTION,
      },
    });

    console.log("\nGemini API Connected Successfully!");
    console.log("Response:", response.text);
  } catch (error) {
    console.error("\nGemini API Connection Failed!");
    console.error("Status:", error.status || error.code);
    console.error("Error:", error.message);
  }
};

testGeminiConnection();
