import express from "express";

const app = express();

// Middleware to read JSON request bodies
app.use(express.json({ limit: "10kb" }));

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Banking & Finance AI Chatbot Backend is running!",
  });
});

export default app;
