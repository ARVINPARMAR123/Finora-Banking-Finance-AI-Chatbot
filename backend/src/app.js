import express from "express";

import healthRoutes from "./routes/health.route.js";

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

// Health check API
app.use("/api/health", healthRoutes);

export default app;
