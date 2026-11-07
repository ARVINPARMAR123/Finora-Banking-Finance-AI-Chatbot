import { generateBankingResponse } from "../services/gemini.service.js";
import { getSafetyResponseForMessage } from "../services/safety.service.js";
import { classifyGeminiError } from "../utils/geminiError.utils.js";

// Handle chatbot requests.
export const handleChat = async (req, res) => {
  try {
    // Get validated user message.
    const { message } = req.validatedBody;

    // Check whether the message is related to financial safety.
    const safetyResult = getSafetyResponseForMessage(message);

    // Return predefined safety guidance when a match is found.
    if (safetyResult) {
      return res.status(200).json({
        success: true,
        message: "Financial safety guidance retrieved successfully.",
        data: {
          response: safetyResult.response,
          source: "financial_safety",
          type: safetyResult.type,
          safetyId: safetyResult.safetyId || null,
        },
      });
    }

    // Generate Gemini response for other banking and finance questions.
    const aiResponse = await generateBankingResponse(message);

    // Return successful AI response.
    return res.status(200).json({
      success: true,
      message: "AI response generated successfully.",
      data: {
        response: aiResponse,
        source: "gemini",
      },
    });
  } catch (error) {
    // Classify Gemini error.
    const errorDetails = classifyGeminiError(error);

    // Log only safe error metadata.
    console.error(
      "Gemini request failed:",
      error.status || error.name || "UNKNOWN_ERROR",
    );

    // Return safe error response.
    return res.status(errorDetails.statusCode).json({
      success: false,
      code: errorDetails.code,
      message: errorDetails.message,
    });
  }
};
