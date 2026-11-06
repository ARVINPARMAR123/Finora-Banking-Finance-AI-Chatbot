import express from "express";

import { simpleInterestSchema } from "../validators/simpleInterest.validator.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { handleSimpleInterestCalculation } from "../controllers/simpleInterest.controller.js";

const router = express.Router();

router.post(
  "/simple",
  validateRequest(simpleInterestSchema),
  handleSimpleInterestCalculation,
);

export default router;
