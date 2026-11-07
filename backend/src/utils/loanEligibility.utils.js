// Round currency values to two decimal places.
const roundCurrency = (value) => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};

// Calculate estimated loan eligibility.
export const calculateLoanEligibility = ({
  monthlyIncome,
  existingEMI,
  annualInterestRate,
  tenureYears,
}) => {
  // Assumed maximum EMI obligation as a percentage of income.
  const foirPercentage = 50;

  // Convert loan tenure into months.
  const tenureMonths = tenureYears * 12;

  // Calculate maximum allowed monthly EMI.
  const maximumEMI = (monthlyIncome * foirPercentage) / 100;

  // Calculate EMI capacity after existing obligations.
  const availableEMI = Math.max(0, maximumEMI - existingEMI);

  // Convert annual interest rate into monthly interest rate.
  const monthlyRate = annualInterestRate / (12 * 100);

  let eligibleLoanAmount = 0;

  // Calculate maximum loan amount.
  if (availableEMI > 0) {
    if (monthlyRate === 0) {
      eligibleLoanAmount = availableEMI * tenureMonths;
    } else {
      const growthFactor = Math.expm1(tenureMonths * Math.log1p(monthlyRate));

      eligibleLoanAmount =
        (availableEMI * growthFactor) /
        (monthlyRate * Math.exp(tenureMonths * Math.log1p(monthlyRate)));
    }
  }

  // Calculate estimated EMI for the eligible loan amount.
  const estimatedEMI = availableEMI;

  // Prevent invalid mathematical results.
  if (!Number.isFinite(eligibleLoanAmount) || !Number.isFinite(estimatedEMI)) {
    throw new RangeError(
      "Loan eligibility calculation produced invalid results.",
    );
  }

  return {
    monthlyIncome: roundCurrency(monthlyIncome),
    existingEMI: roundCurrency(existingEMI),
    foirPercentage,
    maximumEMI: roundCurrency(maximumEMI),
    availableEMI: roundCurrency(availableEMI),
    annualInterestRate,
    tenureYears,
    tenureMonths,
    eligibleLoanAmount: roundCurrency(eligibleLoanAmount),
    estimatedEMI: roundCurrency(estimatedEMI),
    eligibilityStatus: availableEMI > 0 ? "eligible" : "not_eligible",
    disclaimer:
      "This is an illustrative estimate based on a 50% FOIR assumption. Actual loan eligibility depends on lender policies, credit history, income stability and other factors.",
  };
};
