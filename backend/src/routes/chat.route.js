import express from "express";
import { chatSchema } from "../validators/chat.validator.js";
import { validateRequest } from "../middlewares/validate.middleware.js";

const router = express.Router();

// Temporary validation testing endpoint
router.post("/", validateRequest(chatSchema), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Chatbot request validation successful.",
    data: {
      message: req.validatedBody.message,
    },
  });
});

export default router;
