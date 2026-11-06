import express from "express";

import { compoundInterestSchema } from "../validators/compoundInterest.validator.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { handleCompoundInterestCalculation } from "../controllers/compoundInterest.controller.js";

const router = express.Router();

router.post(
  "/compound",
  validateRequest(compoundInterestSchema),
  handleCompoundInterestCalculation,
);

export default router;
