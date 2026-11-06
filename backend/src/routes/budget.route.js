import express from "express";

import { budgetSchema } from "../validators/budget.validator.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { handleBudgetAnalysis } from "../controllers/budget.controller.js";

const router = express.Router();

router.post("/analyze", validateRequest(budgetSchema), handleBudgetAnalysis);

export default router;
