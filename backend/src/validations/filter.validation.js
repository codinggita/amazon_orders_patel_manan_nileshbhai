import { query, validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

const ORDER_STATUSES = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Returned',
];

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('sort').optional().trim(),
];

const validateFilterStatus = [
  query('type')
    .notEmpty()
    .withMessage('Status type is required')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Status type must be between 1 and 50 characters'),
  ...validatePagination,
];

const validateFilterPayment = [
  query('method')
    .notEmpty()
    .withMessage('Payment method is required')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Payment method must be between 1 and 50 characters'),
  ...validatePagination,
];

const validateFilterName = [
  query('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  ...validatePagination,
];

const validateFilterPrice = [
  query('min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('min must be a non-negative number'),
  query('max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('max must be a non-negative number'),
  query().custom((_, { req }) => {
    const { min, max } = req.query;
    if (
      (min === undefined || min === '') &&
      (max === undefined || max === '')
    ) {
      throw new Error('At least one of min or max is required');
    }
    return true;
  }),
  ...validatePagination,
];

const validateFilterDateRange = [
  query('start')
    .notEmpty()
    .withMessage('start date is required')
    .isISO8601()
    .withMessage('start must be a valid date (YYYY-MM-DD)'),
  query('end')
    .notEmpty()
    .withMessage('end date is required')
    .isISO8601()
    .withMessage('end must be a valid date (YYYY-MM-DD)'),
  ...validatePagination,
];

const validateFilterHighValue = [
  query('amount')
    .notEmpty()
    .withMessage('amount is required')
    .isFloat({ min: 0 })
    .withMessage('amount must be a non-negative number'),
  ...validatePagination,
];

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

export {
  ORDER_STATUSES,
  validatePagination,
  validateFilterStatus,
  validateFilterPayment,
  validateFilterName,
  validateFilterPrice,
  validateFilterDateRange,
  validateFilterHighValue,
  handleValidationErrors,
};
