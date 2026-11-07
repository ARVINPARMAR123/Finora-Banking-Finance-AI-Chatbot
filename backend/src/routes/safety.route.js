import express from "express";

import {
  getAllSafety,
  getCategories,
  searchSafety,
  getEmergency,
  getSafetyById,
} from "../controllers/safety.controller.js";

const router = express.Router();

// Get all safety information
router.get("/", getAllSafety);

// Get all safety categories
router.get("/categories", getCategories);

// Search safety information
router.get("/search", searchSafety);

// Get emergency financial fraud guidance
router.get("/emergency", getEmergency);

// Get safety information by ID
router.get("/:id", getSafetyById);

export default router;
