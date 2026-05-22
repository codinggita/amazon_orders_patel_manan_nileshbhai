import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * 404 Not Found Handler
 */
const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Route not found: ${req.originalUrl}`);
  next(error);
};

/**
 * Global Error Handler
 * Must be the last middleware in app.js
 */
const errorHandler = (error, req, res, next) => {
  let apiError = error;

  // If error is not already an ApiError, convert it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    apiError = new ApiError(statusCode, message);
  }

  // Log error for debugging
  if (process.env.NODE_ENV !== 'production') {
    console.error({
      statusCode: apiError.statusCode,
      message: apiError.message,
      errors: apiError.errors,
      stack: apiError.stack,
    });
  }

  // Send error response
  const response = new ApiResponse(
    apiError.statusCode,
    null,
    apiError.message
  );

  if (apiError.errors) {
    response.errors = apiError.errors;
  }

  res.status(apiError.statusCode).json(response);
};

export { errorHandler, notFoundHandler };
