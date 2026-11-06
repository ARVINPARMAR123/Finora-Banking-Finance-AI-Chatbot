import { calculateEMI } from "../utils/emi.utils.js";

// Handle EMI calculator requests.
export const handleEMICalculation = (req, res) => {
  try {
    // Get validated loan details.
    const { loanAmount, annualInterestRate, tenureMonths } = req.validatedBody;

    // Calculate EMI.
    const emiResult = calculateEMI({
      loanAmount,
      annualInterestRate,
      tenureMonths,
    });

    // Return successful response.
    return res.status(200).json({
      success: true,
      message: "EMI calculated successfully.",
      data: emiResult,
    });
  } catch (error) {
    // Log only safe error metadata.
    console.error("EMI calculation failed:", error.name || "UNKNOWN_ERROR");

    // Return safe error response.
    return res.status(500).json({
      success: false,
      code: "EMI_CALCULATION_FAILED",
      message: "Unable to calculate EMI. Please try again.",
    });
  }
};
