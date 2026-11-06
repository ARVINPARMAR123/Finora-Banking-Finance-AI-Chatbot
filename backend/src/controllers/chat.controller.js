import { generateBankingResponse } from "../services/gemini.service.js";
import { classifyGeminiError } from "../utils/geminiError.utils.js";

// Handle chatbot requests.
export const handleChat = async (req, res) => {
  try {
    // Get validated user message
    const { message } = req.validatedBody;

    // Generate Gemini response
    const aiResponse = await generateBankingResponse(message);

    // Return successful response
    return res.status(200).json({
      success: true,
      message: "AI response generated successfully.",
      data: {
        response: aiResponse,
      },
    });
  } catch (error) {
    // Classify Gemini error
    const errorDetails = classifyGeminiError(error);

    // Log only safe error metadata
    console.error(
      "Gemini request failed:",
      error.status || error.name || "UNKNOWN_ERROR",
    );

    // Return safe error response
    return res.status(errorDetails.statusCode).json({
      success: false,
      code: errorDetails.code,
      message: errorDetails.message,
    });
  }
};
