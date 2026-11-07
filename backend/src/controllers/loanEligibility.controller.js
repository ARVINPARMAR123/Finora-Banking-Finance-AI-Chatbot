import { calculateLoanEligibility } from "../utils/loanEligibility.utils.js";

// Handle loan eligibility calculation requests.
export const handleLoanEligibility = (req, res) => {
  try {
    // Get validated financial details.
    const { monthlyIncome, existingEMI, annualInterestRate, tenureYears } =
      req.validatedBody;

    // Calculate estimated loan eligibility.
    const result = calculateLoanEligibility({
      monthlyIncome,
      existingEMI,
      annualInterestRate,
      tenureYears,
    });

    // Return successful response.
    return res.status(200).json({
      success: true,
      message: "Loan eligibility calculated successfully.",
      data: result,
    });
  } catch (error) {
    // Log only safe error metadata.
    console.error(
      "Loan eligibility calculation failed:",
      error.name || "UNKNOWN_ERROR",
    );

    // Return safe error response.
    return res.status(500).json({
      success: false,
      code: "LOAN_ELIGIBILITY_CALCULATION_FAILED",
      message: "Unable to calculate loan eligibility. Please try again.",
    });
  }
};
