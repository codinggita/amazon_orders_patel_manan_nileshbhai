import { query, validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';
import { isValidSortKey } from '../utils/sortMapper.js';

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

const validateSortQuery = [
  query('sort')
    .optional()
    .trim()
    .custom((value) => {
      if (!value) return true;
      const key = value.startsWith('-') ? value.slice(1) : value;
      if (!isValidSortKey(key)) {
        throw new Error(
          `Invalid sort value. Allowed: amount, -amount, date, -date, status, customer, city, payment, quantity, discount`
        );
      }
      return true;
    }),
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

export { validateSortQuery, validatePagination, handleValidationErrors };
