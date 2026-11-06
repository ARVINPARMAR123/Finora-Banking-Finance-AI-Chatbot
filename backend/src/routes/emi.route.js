import express from "express";

import { emiSchema } from "../validators/emi.validator.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { handleEMICalculation } from "../controllers/emi.controller.js";

const router = express.Router();

router.post("/calculate", validateRequest(emiSchema), handleEMICalculation);

export default router;
