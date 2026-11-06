// Round currency values to two decimal places.
const roundCurrency = (value) => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};

// Calculate simple interest and total amount.
export const calculateSimpleInterest = ({
  principalAmount,
  annualInterestRate,
  timeYears,
}) => {
  // Calculate simple interest.
  const simpleInterest =
    (principalAmount * annualInterestRate * timeYears) / 100;

  // Calculate total amount.
  const totalAmount = principalAmount + simpleInterest;

  // Prevent invalid mathematical results.
  if (!Number.isFinite(simpleInterest) || !Number.isFinite(totalAmount)) {
    throw new RangeError(
      "Simple interest calculation produced invalid results.",
    );
  }

  return {
    principalAmount: roundCurrency(principalAmount),
    annualInterestRate,
    timeYears,
    simpleInterest: roundCurrency(simpleInterest),
    totalAmount: roundCurrency(totalAmount),
  };
};
