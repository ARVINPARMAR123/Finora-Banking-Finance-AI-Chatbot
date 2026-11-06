import { calculateBudget } from "../utils/budget.utils.js";

// Handle monthly budget analysis requests.
export const handleBudgetAnalysis = (req, res) => {
  try {
    // Get validated budget details.
    const { monthlyIncome, expenses } = req.validatedBody;

    // Calculate budget summary.
    const budgetResult = calculateBudget({
      monthlyIncome,
      expenses,
    });

    // Return successful response.
    return res.status(200).json({
      success: true,
      message: "Budget analysis completed successfully.",
      data: budgetResult,
    });
  } catch (error) {
    // Handle calculation range errors.
    if (error instanceof RangeError) {
      return res.status(422).json({
        success: false,
        code: "BUDGET_CALCULATION_OUT_OF_RANGE",
        message: "The supplied values exceed the supported calculation range.",
      });
    }

    // Log only safe error metadata.
    console.error("Budget analysis failed:", error.name || "UNKNOWN_ERROR");

    // Return safe error response.
    return res.status(500).json({
      success: false,
      code: "BUDGET_CALCULATION_FAILED",
      message: "Unable to calculate the budget. Please try again.",
    });
  }
};
