// Round currency values to two decimal places.
const roundCurrency = (value) => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};

// Calculate loan EMI and repayment details.
export const calculateEMI = ({
  loanAmount,
  annualInterestRate,
  tenureMonths,
}) => {
  // Convert annual interest rate into monthly interest rate.
  const monthlyRate = annualInterestRate / (12 * 100);

  let monthlyEMI;

  // Handle zero-interest loans separately.
  if (monthlyRate === 0) {
    monthlyEMI = loanAmount / tenureMonths;
  } else {
    // EMI calculation using a numerically stable formula.
    const denominator = -Math.expm1(-tenureMonths * Math.log1p(monthlyRate));

    monthlyEMI = (loanAmount * monthlyRate) / denominator;
  }

  // Calculate total repayment and interest.
  const totalRepayment = monthlyEMI * tenureMonths;
  const totalInterest = totalRepayment - loanAmount;

  // Prevent invalid mathematical results.
  if (
    !Number.isFinite(monthlyEMI) ||
    !Number.isFinite(totalRepayment) ||
    !Number.isFinite(totalInterest)
  ) {
    throw new RangeError("EMI calculation produced invalid results.");
  }

  return {
    loanAmount: roundCurrency(loanAmount),
    annualInterestRate,
    tenureMonths,
    monthlyEMI: roundCurrency(monthlyEMI),
    totalInterest: roundCurrency(totalInterest),
    totalRepayment: roundCurrency(totalRepayment),
  };
};
