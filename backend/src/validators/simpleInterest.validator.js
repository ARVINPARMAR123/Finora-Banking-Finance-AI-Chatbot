import { z } from "zod";

// Simple interest request validation schema.
export const simpleInterestSchema = z
  .object({
    principalAmount: z
      .number({
        error: "Principal amount must be a number.",
      })
      .positive({
        error: "Principal amount must be greater than zero.",
      })
      .max(Number.MAX_SAFE_INTEGER, {
        error: "Principal amount is too large.",
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

    timeYears: z
      .number({
        error: "Time period must be a number.",
      })
      .positive({
        error: "Time period must be greater than zero.",
      })
      .max(100, {
        error: "Time period cannot exceed 100 years.",
      }),
  })
  .strict();
