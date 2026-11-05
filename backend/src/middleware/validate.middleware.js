export const validateRequest = (schema) => {
  return (req, res, next) => {
    // Validate incoming request body
    const result = schema.safeParse(req.body);

    // If validation fails
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data.",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join(".") || "body",
          message: issue.message,
        })),
      });
    }

    // Store validated and cleaned data
    req.validatedBody = result.data;

    next();
  };
};
