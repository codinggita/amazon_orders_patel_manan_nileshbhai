import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import env from "../config/env.js";

/**
 * Registers global Express middleware in a deliberate order:
 * security → CORS → logging → body parsing.
 */
const configureMiddleware = (app) => {
  // Security headers (XSS, clickjacking, MIME sniffing, etc.)
  app.use(helmet());

  // Cross-origin access for the React frontend
  app.use(
    cors({
      origin: env.corsOrigin.split(",").map((origin) => origin.trim()),
      credentials: true,
    })
  );

  // HTTP request logging in development (skip in production to reduce noise)
  if (env.isDevelopment) {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
  }

  // Parse JSON and URL-encoded bodies (size cap mitigates large payload attacks)
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));
};

export default configureMiddleware;
