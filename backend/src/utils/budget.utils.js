const roundCurrency = (value) => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};

const roundPercentage = (value) => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};

// Calculate monthly budget details.
export const calculateBudget = ({ monthlyIncome, expenses }) => {
  // Calculate total monthly expenses.
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );

  // Calculate remaining balance.
  const remainingBalance = monthlyIncome - totalExpenses;

  // Calculate savings percentage.
  const savingsPercentage = (remainingBalance / monthlyIncome) * 100;

  // Prevent invalid or non-finite calculations.
  if (
    !Number.isFinite(totalExpenses) ||
    !Number.isFinite(remainingBalance) ||
    !Number.isFinite(savingsPercentage)
  ) {
    throw new RangeError("Budget calculation produced invalid results.");
  }

  // Determine budget status.
  let budgetStatus;

  if (remainingBalance < 0) {
    budgetStatus = "overspending";
  } else if (savingsPercentage < 20) {
    budgetStatus = "low_savings";
  } else {
    budgetStatus = "healthy";
  }

  // Generate budget recommendations.
  const recommendations = [];

  if (budgetStatus === "overspending") {
    recommendations.push(
      "Your monthly expenses exceed your income. Review your spending and reduce non-essential expenses.",
    );
  } else if (budgetStatus === "low_savings") {
    recommendations.push(
      "Your savings are below the general 20% budgeting benchmark. Consider reducing unnecessary expenses and increasing savings gradually.",
    );
  } else {
    recommendations.push(
      "Your current savings are at or above the general 20% budgeting benchmark. Continue monitoring your expenses and maintaining your savings.",
    );
  }

  // Return budget summary.
  return {
    monthlyIncome: roundCurrency(monthlyIncome),
    totalExpenses: roundCurrency(totalExpenses),
    remainingBalance: roundCurrency(remainingBalance),
    savingsPercentage: roundPercentage(savingsPercentage),
    budgetStatus,
    expenseBreakdown: expenses.map((expense) => ({
      category: expense.category,
      amount: roundCurrency(expense.amount),
      percentage: roundPercentage((expense.amount / monthlyIncome) * 100),
    })),
    recommendations,
  };
};
