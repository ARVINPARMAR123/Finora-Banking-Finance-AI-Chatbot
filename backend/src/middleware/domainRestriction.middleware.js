import { checkFinanceDomain } from "../services/domain.service.js";

// Middleware to restrict chatbot questions to banking and finance topics.
export const domainRestrictionMiddleware = (req, res, next) => {
  const message = req.validatedBody?.message;

  // Safety check
  if (!message) {
    return res.status(400).json({
      success: false,
      message: "A valid message is required.",
    });
  }

  // Check the message domain
  const domainResult = checkFinanceDomain(message);

  // Reject unrelated questions
  if (!domainResult.isAllowed) {
    return res.status(403).json({
      success: false,
      code: "OUT_OF_SCOPE",
      message:
        "I'm a Banking and Finance Assistance Chatbot. I can only help with banking, loans, savings, investments, budgeting, interest calculations and financial safety. Please ask a banking or finance-related question.",
    });
  }

  // Allow banking and finance questions
  next();
};
