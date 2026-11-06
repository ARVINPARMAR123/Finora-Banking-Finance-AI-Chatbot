import { calculateSimpleInterest } from "../utils/simpleInterest.utils.js";

// Handle simple interest calculation requests.
export const handleSimpleInterestCalculation = (req, res) => {
  try {
    // Get validated financial details.
    const { principalAmount, annualInterestRate, timeYears } =
      req.validatedBody;

    // Calculate simple interest.
    const interestResult = calculateSimpleInterest({
      principalAmount,
      annualInterestRate,
      timeYears,
    });

    // Return successful response.
    return res.status(200).json({
      success: true,
      message: "Simple interest calculated successfully.",
      data: interestResult,
    });
  } catch (error) {
    // Log only safe error metadata.
    console.error(
      "Simple interest calculation failed:",
      error.name || "UNKNOWN_ERROR",
    );

    // Return safe error response.
    return res.status(500).json({
      success: false,
      code: "SIMPLE_INTEREST_CALCULATION_FAILED",
      message: "Unable to calculate simple interest. Please try again.",
    });
  }
};
