import { z } from "zod";

// Compound interest request validation schema.
export const compoundInterestSchema = z
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

    compoundingFrequency: z.enum(
      ["annually", "half-yearly", "quarterly", "monthly", "daily"],
      {
        error: "Invalid compounding frequency.",
      },
    ),
  })
  .strict();
