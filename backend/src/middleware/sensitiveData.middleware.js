import { detectSensitiveInformation } from "../utils/sanitize.utils.js";

export const sensitiveDataMiddleware = (req, res, next) => {
  // Get the validated chatbot message
  const message = req.validatedBody?.message;

  // Safety check
  if (typeof message !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid chatbot message.",
    });
  }

  // Detect sensitive banking information
  const detectedTypes = detectSensitiveInformation(message);

  // Block the request if sensitive information is found
  if (detectedTypes.length > 0) {
    return res.status(400).json({
      success: false,
      code: "SENSITIVE_INFORMATION_DETECTED",
      message:
        "For your security, please do not share confidential banking information in this chatbot. Remove the sensitive information and try again.",
      detectedTypes,
    });
  }

  // Continue if no sensitive information is detected
  next();
};
