import ApiError from './ApiError.js';

/**
 * AsyncHandler Wrapper
 * Wraps async route handlers and catches errors automatically
 * Passes errors to express error middleware
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) => {
      // If error is already an ApiError, pass it directly
      if (error instanceof ApiError) {
        return next(error);
      }

      // Convert other errors to ApiError
      const apiError = new ApiError(
        error.statusCode || 500,
        error.message || 'Internal server error',
        error.errors || null
      );

      next(apiError);
    });
  };
};

export default asyncHandler;
