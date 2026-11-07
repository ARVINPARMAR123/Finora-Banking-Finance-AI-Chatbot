import {
  getAllFAQs,
  getFAQCategories,
  getFAQById,
  searchFAQs,
} from "../services/faq.service.js";

// Get all FAQs.
export const handleGetAllFAQs = (req, res) => {
  const allFAQs = getAllFAQs();

  return res.status(200).json({
    success: true,
    message: "FAQs retrieved successfully.",
    data: {
      total: allFAQs.length,
      faqs: allFAQs,
    },
  });
};

// Get available FAQ categories.
export const handleGetFAQCategories = (req, res) => {
  const categories = getFAQCategories();

  return res.status(200).json({
    success: true,
    message: "FAQ categories retrieved successfully.",
    data: {
      total: categories.length,
      categories,
    },
  });
};

// Search FAQs using keyword and optional category.
export const handleSearchFAQs = (req, res) => {
  const { keyword, category } = req.query;

  // Validate query parameters.
  if (
    (keyword !== undefined &&
      (typeof keyword !== "string" ||
        keyword.trim().length === 0 ||
        keyword.trim().length > 100)) ||
    (category !== undefined &&
      (typeof category !== "string" ||
        category.trim().length === 0 ||
        category.trim().length > 50))
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid FAQ search parameters.",
    });
  }

  // Search FAQs.
  const results = searchFAQs(keyword, category);

  return res.status(200).json({
    success: true,
    message: "FAQ search completed successfully.",
    data: {
      total: results.length,
      faqs: results,
    },
  });
};

// Get a particular FAQ by ID.
export const handleGetFAQById = (req, res) => {
  const { id } = req.params;

  // Validate FAQ ID format.
  if (!/^FAQ\d{3}$/i.test(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid FAQ ID format.",
    });
  }

  const faq = getFAQById(id);

  // Handle FAQ not found.
  if (!faq) {
    return res.status(404).json({
      success: false,
      message: "FAQ not found.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "FAQ retrieved successfully.",
    data: faq,
  });
};
