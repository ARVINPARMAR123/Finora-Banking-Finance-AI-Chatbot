import express from "express";

import healthRoutes from "./routes/health.route.js";
import chatRoutes from "./routes/chat.route.js";

import {
  helmetMiddleware,
  corsMiddleware,
  apiRateLimiter,
} from "./config/security.js";

const app = express();

// Disable Express fingerprinting header
app.disable("x-powered-by");

// Security middleware
app.use(helmetMiddleware);
app.use(corsMiddleware);

// Request body parser
app.use(express.json({ limit: "10kb" }));

// General API rate limiter
app.use("/api", apiRateLimiter);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Banking & Finance AI Chatbot Backend is running!",
  });
});

// Health check API
app.use("/api/health", healthRoutes);

// Chatbot validation API
app.use("/api/chat", chatRoutes);

export default app;
