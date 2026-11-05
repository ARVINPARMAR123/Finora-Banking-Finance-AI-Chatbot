import express from "express";
import { chatSchema } from "../validators/chat.validator.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { sensitiveDataMiddleware } from "../middleware/sensitiveData.middleware.js";
import { domainRestrictionMiddleware } from "../middleware/domainRestriction.middleware.js";

const router = express.Router();

router.post(
  "/",
  validateRequest(chatSchema),
  sensitiveDataMiddleware,
  domainRestrictionMiddleware,
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
