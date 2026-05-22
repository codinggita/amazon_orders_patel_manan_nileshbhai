import { body, param, query, validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

/**
 * Order Validation Schemas
 * Validates request data using express-validator
 */

/**
 * Create Order Validation
 */
const validateCreateOrder = [
  body('OrderID')
    .trim()
    .notEmpty()
    .withMessage('OrderID is required')
    .matches(/^ORD\d{7}$/)
    .withMessage('OrderID must follow format: ORD0000001'),

  body('CustomerID')
    .trim()
    .notEmpty()
    .withMessage('CustomerID is required')
    .matches(/^CUST\d{6}$/)
    .withMessage('CustomerID must follow format: CUST000001'),

  body('CustomerName')
    .trim()
    .notEmpty()
    .withMessage('CustomerName is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('CustomerName must be between 2 and 100 characters'),

  body('ProductID')
    .trim()
    .notEmpty()
    .withMessage('ProductID is required')
    .matches(/^P\d{5}$/)
    .withMessage('ProductID must follow format: P00001'),

  body('ProductName')
    .trim()
    .notEmpty()
    .withMessage('ProductName is required')
    .isLength({ max: 200 })
    .withMessage('ProductName cannot exceed 200 characters'),

  body('Category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),

  body('Brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required')
    .isLength({ max: 100 })
    .withMessage('Brand cannot exceed 100 characters'),

  body('Quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer greater than 0'),

  body('UnitPrice')
    .notEmpty()
    .withMessage('UnitPrice is required')
    .isFloat({ min: 0 })
    .withMessage('UnitPrice must be a positive number'),

  body('Discount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount must be a non-negative number'),

  body('Tax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Tax must be a non-negative number'),

  body('ShippingCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('ShippingCost must be a non-negative number'),

  body('TotalAmount')
    .notEmpty()
    .withMessage('TotalAmount is required')
    .isFloat({ min: 0 })
    .withMessage('TotalAmount must be a positive number'),

  body('OrderDate')
    .notEmpty()
    .withMessage('OrderDate is required')
    .isISO8601()
    .withMessage('OrderDate must be a valid ISO 8601 date'),

  body('PaymentMethod')
    .notEmpty()
    .withMessage('PaymentMethod is required')
    .isIn(['Credit Card', 'Debit Card', 'UPI', 'COD', 'Net Banking'])
    .withMessage('PaymentMethod must be one of: Credit Card, Debit Card, UPI, COD, Net Banking'),

  body('OrderStatus')
    .optional()
    .isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'])
    .withMessage('OrderStatus must be one of: Pending, Processing, Shipped, Delivered, Cancelled, Returned'),

  body('City')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ max: 100 })
    .withMessage('City cannot exceed 100 characters'),

  body('State')
    .trim()
    .notEmpty()
    .withMessage('State is required')
    .isLength({ max: 100 })
    .withMessage('State cannot exceed 100 characters'),

  body('Country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ max: 100 })
    .withMessage('Country cannot exceed 100 characters'),

  body('SellerID')
    .trim()
    .notEmpty()
    .withMessage('SellerID is required')
    .matches(/^SELL\d{5}$/)
    .withMessage('SellerID must follow format: SELL00001'),
];

/**
 * Update Order Validation (allows partial updates)
 */
const validateUpdateOrder = [
  body('OrderID')
    .optional()
    .trim()
    .matches(/^ORD\d{7}$/)
    .withMessage('OrderID must follow format: ORD0000001'),

  body('CustomerID')
    .optional()
    .trim()
    .matches(/^CUST\d{6}$/)
    .withMessage('CustomerID must follow format: CUST000001'),

  body('CustomerName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('CustomerName must be between 2 and 100 characters'),

  body('ProductID')
    .optional()
    .trim()
    .matches(/^P\d{5}$/)
    .withMessage('ProductID must follow format: P00001'),

  body('ProductName')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('ProductName cannot exceed 200 characters'),

  body('Category')
    .optional()
    .trim(),

  body('Brand')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Brand cannot exceed 100 characters'),

  body('Quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer greater than 0'),

  body('UnitPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('UnitPrice must be a positive number'),

  body('Discount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount must be a non-negative number'),

  body('Tax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Tax must be a non-negative number'),

  body('ShippingCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('ShippingCost must be a non-negative number'),

  body('TotalAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('TotalAmount must be a positive number'),

  body('OrderDate')
    .optional()
    .isISO8601()
    .withMessage('OrderDate must be a valid ISO 8601 date'),

  body('PaymentMethod')
    .optional()
    .isIn(['Credit Card', 'Debit Card', 'UPI', 'COD', 'Net Banking'])
    .withMessage('PaymentMethod must be one of: Credit Card, Debit Card, UPI, COD, Net Banking'),

  body('OrderStatus')
    .optional()
    .isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'])
    .withMessage('OrderStatus must be one of: Pending, Processing, Shipped, Delivered, Cancelled, Returned'),

  body('City')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City cannot exceed 100 characters'),

  body('State')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('State cannot exceed 100 characters'),

  body('Country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country cannot exceed 100 characters'),

  body('SellerID')
    .optional()
    .trim()
    .matches(/^SELL\d{5}$/)
    .withMessage('SellerID must follow format: SELL00001'),
];

/**
 * Validate Order ID
 */
const validateOrderId = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isMongoId()
    .withMessage('Invalid order ID format'),
];

/**
 * Validate Query Parameters
 */
const validateQueryParams = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('sort')
    .optional()
    .trim(),

  query('search')
    .optional()
    .trim(),

  query('OrderStatus')
    .optional()
    .isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'])
    .withMessage('Invalid OrderStatus value'),

  query('PaymentMethod')
    .optional()
    .isIn(['Credit Card', 'Debit Card', 'UPI', 'COD', 'Net Banking'])
    .withMessage('Invalid PaymentMethod value'),
];

/**
 * Validate search query parameter (q)
 */
const validateSearchQuery = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Search query (q) must be between 1 and 200 characters'),
];

/**
 * Validate Cancel Order Request
 */
const validateCancelOrder = [
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters'),
];

/**
 * Validate Update Status Request
 */
const validateUpdateStatus = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'])
    .withMessage('Invalid status value'),

  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters'),
];

/**
 * Validation Error Handler Middleware
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => ({
      field: err.param,
      message: err.msg,
    }));
    
    throw new ApiError(400, 'Validation failed', errorMessages);
  }
  
  next();
};

export {
  validateCreateOrder,
  validateUpdateOrder,
  validateOrderId,
  validateQueryParams,
  validateSearchQuery,
  validateCancelOrder,
  validateUpdateStatus,
  handleValidationErrors,
};
