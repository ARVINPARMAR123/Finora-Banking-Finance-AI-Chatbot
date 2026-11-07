import {
  getAllSafetyInfo,
  getSafetyCategories,
  searchSafetyInfo,
  getSafetyInfoById,
  getEmergencyGuidance,
} from "../services/safety.service.js";

// GET /api/safety
export const getAllSafety = (req, res) => {
  return res.status(200).json({
    success: true,
    count: getAllSafetyInfo().length,
    data: getAllSafetyInfo(),
  });
};

// GET /api/safety/categories
export const getCategories = (req, res) => {
  const categories = getSafetyCategories();

  return res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
};

// GET /api/safety/search?keyword=upi
export const searchSafety = (req, res) => {
  const { keyword, category } = req.query;

  if (!keyword && !category) {
    return res.status(400).json({
      success: false,
      message: "Please provide a keyword or category to search.",
    });
  }

  const results = searchSafetyInfo(keyword, category);

  return res.status(200).json({
    success: true,
    count: results.length,
    data: results,
  });
};

// GET /api/safety/emergency
export const getEmergency = (req, res) => {
  return res.status(200).json({
    success: true,
    data: getEmergencyGuidance(),
  });
};

// GET /api/safety/:id
export const getSafetyById = (req, res) => {
  const { id } = req.params;

  const safetyInfo = getSafetyInfoById(id);

  if (!safetyInfo) {
    return res.status(404).json({
      success: false,
      message: "Financial safety information not found.",
    });
  }

  return res.status(200).json({
    success: true,
    data: safetyInfo,
  });
};
