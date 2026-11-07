import express from "express";

import { loanEligibilitySchema } from "../validators/loanEligibility.validator.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { handleLoanEligibility } from "../controllers/loanEligibility.controller.js";

const router = express.Router();

router.post(
  "/calculate",
  validateRequest(loanEligibilitySchema),
  handleLoanEligibility,
);

export default router;
