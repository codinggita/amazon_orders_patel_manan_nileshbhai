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
 * Validate Order ID Param
 */
const validateOrderId = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isMongoId()
    .withMessage('Invalid order ID format'),
];

/**
 * Validate Shipping Status Update
 */
const validateUpdateStatus = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isMongoId()
    .withMessage('Invalid order ID format'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'])
    .withMessage('Status must be one of: Pending, Processing, Shipped, Delivered, Cancelled, Returned'),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters'),
];

/**
 * Validate Pagination parameters for shipping listings
 */
const validateShippingPagination = [
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
 * Validate Create Shipping Label
 */
const validateCreateLabel = [
  body('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isMongoId()
    .withMessage('Invalid order ID format'),
  body('carrier')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Carrier must be between 2 and 100 characters'),
  body('serviceType')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Service type must be between 2 and 100 characters'),
];

/**
 * Validate Address Change
 */
const validateChangeAddress = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isMongoId()
    .withMessage('Invalid order ID format'),
  body('City')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City cannot be empty')
    .isLength({ max: 100 })
    .withMessage('City cannot exceed 100 characters'),
  body('State')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('State cannot be empty')
    .isLength({ max: 100 })
    .withMessage('State cannot exceed 100 characters'),
  body('Country')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Country cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Country cannot exceed 100 characters'),
  // Ensure at least one address field is provided
  body().custom((value, { req }) => {
    if (!req.body.City && !req.body.State && !req.body.Country) {
      throw new Error('At least one address field (City, State, or Country) must be provided for update');
    }
    return true;
  }),
];

/**
 * Validate Delivery Reschedule
 */
const validateReschedule = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isMongoId()
    .withMessage('Invalid order ID format'),
  body('newDeliveryDate')
    .notEmpty()
    .withMessage('New delivery date is required')
    .isISO8601()
    .withMessage('New delivery date must be a valid ISO 8601 date'),
];

export {
  validateOrderId,
  validateUpdateStatus,
  validateShippingPagination,
  validateCreateLabel,
  validateChangeAddress,
  validateReschedule,
  handleValidationErrors,
};
