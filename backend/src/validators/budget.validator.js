import { z } from "zod";

// Individual expense validation schema.
const expenseSchema = z
  .object({
    category: z
      .string({
        error: "Expense category must be a string.",
      })
      .trim()
      .min(1, {
        error: "Expense category cannot be empty.",
      })
      .max(50, {
        error: "Expense category cannot exceed 50 characters.",
      }),

    amount: z
      .number({
        error: "Expense amount must be a number.",
      })
      .nonnegative({
        error: "Expense amount cannot be negative.",
      })
      .max(Number.MAX_SAFE_INTEGER, {
        error: "Expense amount is too large.",
      }),
  })
  .strict();

// Monthly budget request validation schema.
export const budgetSchema = z
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

    expenses: z
      .array(expenseSchema, {
        error: "Expenses must be an array.",
      })
      .max(30, {
        error: "Maximum 30 expense categories are allowed.",
      }),
  })
  .strict();
