import { z } from "zod";

// Loan eligibility calculator validation schema.
export const loanEligibilitySchema = z
  .object({
    monthlyIncome: z
      .number({
        error: "Monthly income must be a number.",
      })
      .positive({
        error: "Monthly income must be greater than zero.",
      })
      .max(Number.MAX_SAFE_INTEGER, {
        error: "Monthly income is too large.",
      }),

    existingEMI: z
      .number({
        error: "Existing EMI must be a number.",
      })
      .min(0, {
        error: "Existing EMI cannot be negative.",
      })
      .max(Number.MAX_SAFE_INTEGER, {
        error: "Existing EMI is too large.",
      }),

    annualInterestRate: z
      .number({
        error: "Annual interest rate must be a number.",
      })
      .min(0, {
        error: "Interest rate cannot be negative.",
      })
      .max(1000, {
        error: "Interest rate cannot exceed 1000%.",
      }),

    tenureYears: z
      .number({
        error: "Loan tenure must be a number.",
      })
      .int({
        error: "Loan tenure must be a whole number of years.",
      })
      .positive({
        error: "Loan tenure must be greater than zero.",
      })
      .max(50, {
        error: "Loan tenure cannot exceed 50 years.",
      }),
  })
  .strict();
