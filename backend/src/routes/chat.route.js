import express from "express";
import { chatSchema } from "../validators/chat.validator.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { sensitiveDataMiddleware } from "../middleware/sensitiveData.middleware.js";

const router = express.Router();

// Chatbot request validation and security
router.post(
  "/",
  validateRequest(chatSchema),
  sensitiveDataMiddleware,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Chatbot request validation successful.",
      data: {
        message: req.validatedBody.message,
      },
    });
  },
);

export default router;
