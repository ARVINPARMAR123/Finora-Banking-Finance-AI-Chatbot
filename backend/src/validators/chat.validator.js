import { z } from "zod";

// Chatbot request validation schema
export const chatSchema = z
  .object({
    message: z
      .string({
        error: "Message must be a string.",
      })
      .trim()
      .min(1, {
        error: "Message cannot be empty.",
      })
      .max(2000, {
        error: "Message cannot exceed 2000 characters.",
      }),
  })
  .strict();
