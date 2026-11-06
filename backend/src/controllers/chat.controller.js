import { generateBankingResponse } from "../services/gemini.service.js";

// Handle chatbot requests.
export const handleChat = async (req, res) => {
  try {
    // Get validated message
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
    // Handle empty AI response
    if (error.message === "EMPTY_GEMINI_RESPONSE") {
      return res.status(502).json({
        success: false,
        code: "EMPTY_AI_RESPONSE",
        message:
          "The AI service could not generate a response. Please try again.",
      });
    }

    // Log error status only, not user messages or credentials
    console.error(
      "Gemini API error:",
      error.status || error.code || "UNKNOWN_ERROR",
    );

    // Handle Gemini API failure
    return res.status(503).json({
      success: false,
      code: "AI_SERVICE_UNAVAILABLE",
      message:
        "Our banking assistant is temporarily unavailable. Please try again later.",
    });
  }
};
