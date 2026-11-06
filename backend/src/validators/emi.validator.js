import { z } from "zod";

// EMI calculator request validation schema.
export const emiSchema = z
  .object({
    loanAmount: z
      .number({
        error: "Loan amount must be a number.",
      })
      .positive({
        error: "Loan amount must be greater than zero.",
      })
      .max(Number.MAX_SAFE_INTEGER, {
        error: "Loan amount is too large.",
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

    tenureMonths: z
      .number({
        error: "Loan tenure must be a number.",
      })
      .int({
        error: "Loan tenure must be a whole number of months.",
      })
      .positive({
        error: "Loan tenure must be greater than zero.",
      })
      .max(1200, {
        error: "Loan tenure cannot exceed 1200 months.",
      }),
  })
  .strict();
