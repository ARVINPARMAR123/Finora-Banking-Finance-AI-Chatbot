import { rateLimit } from "express-rate-limit";

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  limit: 100, // Maximum 100 requests

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests from your IP address. Please try again after 15 minutes.",
  },
});
