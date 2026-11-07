import express from "express";

import {
  handleGetAllFAQs,
  handleGetFAQCategories,
  handleSearchFAQs,
  handleGetFAQById,
} from "../controllers/faq.controller.js";

const router = express.Router();

// Get all FAQs.
router.get("/", handleGetAllFAQs);

// Get all FAQ categories.
router.get("/categories", handleGetFAQCategories);

// Search FAQs.
router.get("/search", handleSearchFAQs);

// Get FAQ by ID.
router.get("/:id", handleGetFAQById);

export default router;
