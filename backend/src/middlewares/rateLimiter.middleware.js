import rateLimit from "express-rate-limit";
import env from "../config/env.js";

/**
 * Protects the API from brute-force and abuse (production baseline).
 */
const apiRateLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests. Please try again later.",
  },
});

export default apiRateLimiter;
