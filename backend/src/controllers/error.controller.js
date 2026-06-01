import ApiError from '../utils/ApiError.js';

/**
 * @desc    Simulate 404 error
 * @route   GET /api/v1/errors/not-found
 */
export const simulateNotFound = (req, res, next) => {
  next(new ApiError(404, 'Resource not found'));
};

/**
 * @desc    Simulate internal server error
 * @route   GET /api/v1/errors/server-error
 */
export const simulateServerError = (req, res, next) => {
  next(new ApiError(500, 'Internal server error'));
};

/**
 * @desc    Simulate database error
 * @route   GET /api/v1/errors/database
 */
export const simulateDatabaseError = (req, res, next) => {
  next(new ApiError(503, 'Database connection failed'));
};

/**
 * @desc    Simulate validation failure
 * @route   GET /api/v1/errors/validation
 */
export const simulateValidationError = (req, res, next) => {
  next(new ApiError(422, 'Validation failed', [
    { field: 'email', message: 'Email is required' },
    { field: 'name', message: 'Name must be at least 3 characters' },
  ]));
};

/**
 * @desc    Simulate rate limit error
 * @route   GET /api/v1/errors/rate-limit
 */
export const simulateRateLimitError = (req, res, next) => {
  next(new ApiError(429, 'Too many requests. Please try again later.'));
};

/**
 * @desc    Simulate expired token
 * @route   GET /api/v1/errors/token-expired
 */
export const simulateTokenExpired = (req, res, next) => {
  next(new ApiError(401, 'Token has expired. Please login again.'));
};

/**
 * @desc    Simulate payment failure
 * @route   GET /api/v1/errors/payment-failed
 */
export const simulatePaymentFailed = (req, res, next) => {
  next(new ApiError(402, 'Payment processing failed. Card was declined.'));
};

/**
 * @desc    Simulate shipping failure
 * @route   GET /api/v1/errors/shipping-failed
 */
export const simulateShippingFailed = (req, res, next) => {
  next(new ApiError(503, 'Shipping service unavailable. Please try again later.'));
};

/**
 * @desc    Simulate upload error
 * @route   GET /api/v1/errors/upload-error
 */
export const simulateUploadError = (req, res, next) => {
  next(new ApiError(413, 'File too large. Maximum upload size is 5MB.'));
};

/**
 * @desc    Simulate cache failure
 * @route   GET /api/v1/errors/cache-error
 */
export const simulateCacheError = (req, res, next) => {
  next(new ApiError(503, 'Cache service unavailable. Operating without cache.'));
};
