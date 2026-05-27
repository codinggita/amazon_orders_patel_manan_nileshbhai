import { body, param, query, validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

/**
 * Validation Error Handler Middleware
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    throw new ApiError(400, 'Validation failed', errorMessages);
  }
  next();
};

/**
 * Validate User ID Param
 */
const validateUserIdParam = [
  param('id')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid User ID format'),
];

/**
 * Validate Role Change
 */
const validateChangeRole = [
  param('id')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid User ID format'),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
];

/**
 * Validate Pagination Params
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

/**
 * Validate Maintenance Mode Post
 */
const validateMaintenanceMode = [
  body('enabled')
    .notEmpty()
    .withMessage('Enabled status is required')
    .isBoolean()
    .withMessage('Enabled status must be a boolean value'),
];

export {
  validateUserIdParam,
  validateChangeRole,
  validatePagination,
  validateMaintenanceMode,
  handleValidationErrors,
};
