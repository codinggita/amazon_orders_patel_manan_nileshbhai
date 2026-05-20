import express from "express";
import env from "./config/env.js";
import configureMiddleware from "./middlewares/configure.middleware.js";
import apiRateLimiter from "./middlewares/rateLimiter.middleware.js";
import notFoundHandler from "./middlewares/notFound.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";
import apiRoutes from "./routes/index.js";

const app = express();

// Trust proxy when behind reverse proxy (Nginx, Render, AWS ALB)
if (env.isProduction) {
  app.set("trust proxy", 1);
}

configureMiddleware(app);

// Global rate limiting (after parsers, before routes)
app.use(apiRateLimiter);

// Root redirect for quick discovery in dev / load balancers
app.get("/", (req, res) => {
  res.redirect(302, "/api/v1");
});

// Versioned API surface
app.use("/api/v1", apiRoutes);

// 404 + centralized errors (order matters)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
