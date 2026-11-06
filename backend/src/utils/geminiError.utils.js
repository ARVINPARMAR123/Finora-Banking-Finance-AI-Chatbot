// Classify errors received from Gemini API.
// Never expose internal provider error messages or API credentials to chatbot users.

export const classifyGeminiError = (error) => {
  const status = Number(error?.status ?? error?.code);

  // Empty AI response
  if (error?.message === "EMPTY_GEMINI_RESPONSE") {
    return {
      statusCode: 502,
      code: "EMPTY_AI_RESPONSE",
      message:
        "The AI service could not generate a response. Please try again later.",
    };
  }

  // Request timeout
  if (
    status === 408 ||
    status === 504 ||
    error?.name === "RequestTimeoutError"
  ) {
    return {
      statusCode: 504,
      code: "AI_REQUEST_TIMEOUT",
      message: "The AI service took too long to respond. Please try again.",
    };
  }

  // API rate limit
  if (status === 429) {
    return {
      statusCode: 503,
      code: "AI_RATE_LIMITED",
      message: "The AI service is temporarily busy. Please try again later.",
    };
  }

  // Gemini service unavailable
  if (status === 500 || status === 502 || status === 503) {
    return {
      statusCode: 503,
      code: "AI_SERVICE_UNAVAILABLE",
      message:
        "Our banking assistant is temporarily unavailable. Please try again later.",
    };
  }

  // Invalid API key or provider permission issue
  if (status === 401 || status === 403) {
    return {
      statusCode: 502,
      code: "AI_PROVIDER_CONFIGURATION_ERROR",
      message:
        "Our AI service is temporarily unavailable. Please try again later.",
    };
  }

  // Other provider errors
  return {
    statusCode: 502,
    code: "AI_PROVIDER_ERROR",
    message:
      "Unable to process your request right now. Please try again later.",
  };
};
