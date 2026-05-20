import mongoose from "mongoose";
import env from "../config/env.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const DB_STATE_LABELS = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

/**
 * GET /api/v1/health — used by load balancers and monitoring.
 */
export const getHealth = asyncHandler(async (req, res) => {
  const dbReadyState = mongoose.connection.readyState;
  const isDbHealthy = dbReadyState === 1;

  const healthData = {
    status: isDbHealthy ? "ok" : "degraded",
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: DB_STATE_LABELS[dbReadyState] ?? "unknown",
      name: mongoose.connection.name || null,
    },
  };

  const statusCode = isDbHealthy ? 200 : 503;

  res
    .status(statusCode)
    .json(new ApiResponse(statusCode, healthData, "Health check completed"));
});

/**
 * GET /api/v1 — API root metadata.
 */
export const getApiInfo = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      {
        name: "Amazon E-Commerce API",
        version: "1.0.0",
        documentation: "/api/v1/health",
        endpoints: {
          health: "/api/v1/health",
        },
      },
      "Welcome to the API"
    )
  );
});
