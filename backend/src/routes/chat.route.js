import express from "express";
import { chatSchema } from "../validators/chat.validator.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { sensitiveDataMiddleware } from "../middleware/sensitiveData.middleware.js";
import { domainRestrictionMiddleware } from "../middleware/domainRestriction.middleware.js";
import { handleChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.post(
  "/",
  validateRequest(chatSchema),
  sensitiveDataMiddleware,
  domainRestrictionMiddleware,
  handleChat,
);

export default router;
