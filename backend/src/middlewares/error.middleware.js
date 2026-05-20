import env from "../config/env.js";

/**
 * Centralized error handler — single place for HTTP error responses.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  // Mongoose: invalid ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose: duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value for ${field}`;
  }

  // Mongoose: validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    message = "Validation failed";
  }

  // JWT errors (ready for auth module)
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  const response = {
    success: false,
    statusCode,
    message,
    ...(errors.length > 0 && { errors }),
    ...(env.isDevelopment && { stack: err.stack }),
  };

  if (env.isDevelopment) {
    console.error(err);
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
