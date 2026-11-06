const roundCurrency = (value) => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};

// Calculate compound interest and maturity amount.
export const calculateCompoundInterest = ({
  principalAmount,
  annualInterestRate,
  timeYears,
  compoundingFrequency,
}) => {
  // Define compounding periods per year.
  const frequencyMap = {
    annually: 1,
    "half-yearly": 2,
    quarterly: 4,
    monthly: 12,
    daily: 365,
  };

  const periodsPerYear = frequencyMap[compoundingFrequency];

  if (!periodsPerYear) {
    throw new RangeError("Invalid compounding frequency.");
  }

  // Convert annual interest rate into decimal form.
  const annualRate = annualInterestRate / 100;

  // Calculate interest rate per compounding period.
  const ratePerPeriod = annualRate / periodsPerYear;

  // Calculate total compounding periods.
  const totalPeriods = periodsPerYear * timeYears;

  // Calculate maturity amount.
  const totalAmount =
    principalAmount * Math.pow(1 + ratePerPeriod, totalPeriods);

  // Calculate compound interest.
  const compoundInterest = totalAmount - principalAmount;

  // Prevent invalid or infinite calculations.
  if (!Number.isFinite(totalAmount) || !Number.isFinite(compoundInterest)) {
    throw new RangeError(
      "Compound interest calculation produced invalid results.",
    );
  }

  return {
    principalAmount: roundCurrency(principalAmount),
    annualInterestRate,
    timeYears,
    compoundingFrequency,
    totalAmount: roundCurrency(totalAmount),
    compoundInterest: roundCurrency(compoundInterest),
  };
};
