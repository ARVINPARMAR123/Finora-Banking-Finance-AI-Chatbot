import { calculateCompoundInterest } from "../utils/compoundInterest.utils.js";

// Handle compound interest calculation requests.
export const handleCompoundInterestCalculation = (req, res) => {
  try {
    // Get validated financial details.
    const {
      principalAmount,
      annualInterestRate,
      timeYears,
      compoundingFrequency,
    } = req.validatedBody;

    // Calculate compound interest.
    const interestResult = calculateCompoundInterest({
      principalAmount,
      annualInterestRate,
      timeYears,
      compoundingFrequency,
    });

    // Return successful response.
    return res.status(200).json({
      success: true,
      message: "Compound interest calculated successfully.",
      data: interestResult,
    });
  } catch (error) {
    // Handle calculation range errors.
    if (error instanceof RangeError) {
      return res.status(422).json({
        success: false,
        code: "COMPOUND_INTEREST_CALCULATION_OUT_OF_RANGE",
        message:
          "The supplied values produce an amount outside the supported calculation range.",
      });
    }

    // Log only safe error metadata.
    console.error(
      "Compound interest calculation failed:",
      error.name || "UNKNOWN_ERROR",
    );

    // Return safe error response.
    return res.status(500).json({
      success: false,
      code: "COMPOUND_INTEREST_CALCULATION_FAILED",
      message: "Unable to calculate compound interest. Please try again.",
    });
  }
};
