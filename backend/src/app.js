import express from "express";

import healthRoutes from "./routes/health.route.js";
import chatRoutes from "./routes/chat.route.js";
import emiRoutes from "./routes/emi.route.js";
import simpleInterestRoutes from "./routes/simpleInterest.route.js";
import compoundInterestRoutes from "./routes/compoundInterest.route.js";
import budgetRoutes from "./routes/budget.route.js";
import faqRoutes from "./routes/faq.route.js";
import safetyRoutes from "./routes/safety.route.js";
import loanEligibilityRoutes from "./routes/loanEligibility.route.js";

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

// EMI Calculator API
app.use("/api/emi", emiRoutes);

// Simple Interest Calculator API
app.use("/api/interest", simpleInterestRoutes);

// Compound Interest Calculator API
app.use("/api/interest", compoundInterestRoutes);

// Budget Assistance API
app.use("/api/budget", budgetRoutes);

// Financial FAQ API
app.use("/api/faq", faqRoutes);

// Financial Safety and Scam Awareness API
app.use("/api/safety", safetyRoutes);

// Loan Eligibility Calculator API
app.use("/api/loan-eligibility", loanEligibilityRoutes);

export default app;
