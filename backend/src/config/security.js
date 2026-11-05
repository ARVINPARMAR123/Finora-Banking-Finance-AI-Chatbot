import helmet from "helmet";
import cors from "cors";
import { generalLimiter } from "../middleware.js";

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:5501",
  "http://127.0.0.1:5501",
];

// Helmet security configuration
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      "upgrade-insecure-requests": null,
    },
  },
});

// CORS configuration
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests without an Origin header
    // such as Thunder Client and server-to-server requests.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },

  methods: ["GET", "POST", "OPTIONS"],

  allowedHeaders: ["Content-Type"],

  optionsSuccessStatus: 204,
});

// Export general rate limiter
export const apiRateLimiter = generalLimiter;
