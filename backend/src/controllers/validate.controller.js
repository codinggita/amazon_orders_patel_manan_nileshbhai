import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

/**
 * @desc    Validate order payload
 * @route   POST /api/v1/validate/order
 */
export const validateOrder = (req, res, next) => {
  const { CustomerName, Product, Quantity, TotalAmount } = req.body;
  const errors = [];

  if (!CustomerName) errors.push({ field: 'CustomerName', message: 'Customer name is required' });
  if (!Product) errors.push({ field: 'Product', message: 'Product is required' });
  if (!Quantity || Quantity < 1) errors.push({ field: 'Quantity', message: 'Quantity must be at least 1' });
  if (!TotalAmount || TotalAmount <= 0) errors.push({ field: 'TotalAmount', message: 'Total amount must be greater than 0' });

  if (errors.length > 0) {
    return next(new ApiError(422, 'Order validation failed', errors));
  }

  res.status(200).json(new ApiResponse(200, { valid: true }, 'Order payload is valid'));
};

/**
 * @desc    Validate order update
 * @route   PATCH /api/v1/validate/order/:id
 */
export const validateOrderUpdate = (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;
  const errors = [];

  if (!id) errors.push({ field: 'id', message: 'Order ID is required' });
  if (Object.keys(updates).length === 0) errors.push({ field: 'body', message: 'At least one field must be provided for update' });
  if (updates.Quantity && updates.Quantity < 1) errors.push({ field: 'Quantity', message: 'Quantity must be at least 1' });
  if (updates.TotalAmount && updates.TotalAmount <= 0) errors.push({ field: 'TotalAmount', message: 'Total amount must be greater than 0' });

  if (errors.length > 0) {
    return next(new ApiError(422, 'Order update validation failed', errors));
  }

  res.status(200).json(new ApiResponse(200, { valid: true }, 'Order update payload is valid'));
};

/**
 * @desc    Validate payment details
 * @route   POST /api/v1/validate/payment
 */
export const validatePayment = (req, res, next) => {
  const { cardNumber, expiryDate, cvv, amount } = req.body;
  const errors = [];

  if (!cardNumber) errors.push({ field: 'cardNumber', message: 'Card number is required' });
  if (!expiryDate) errors.push({ field: 'expiryDate', message: 'Expiry date is required' });
  if (!cvv) errors.push({ field: 'cvv', message: 'CVV is required' });
  if (!amount || amount <= 0) errors.push({ field: 'amount', message: 'Amount must be greater than 0' });

  if (errors.length > 0) {
    return next(new ApiError(422, 'Payment validation failed', errors));
  }

  res.status(200).json(new ApiResponse(200, { valid: true }, 'Payment details are valid'));
};

/**
 * @desc    Validate shipping address
 * @route   POST /api/v1/validate/address
 */
export const validateAddress = (req, res, next) => {
  const { street, city, state, zipCode, country } = req.body;
  const errors = [];

  if (!street) errors.push({ field: 'street', message: 'Street address is required' });
  if (!city) errors.push({ field: 'city', message: 'City is required' });
  if (!state) errors.push({ field: 'state', message: 'State is required' });
  if (!zipCode) errors.push({ field: 'zipCode', message: 'Zip code is required' });
  if (!country) errors.push({ field: 'country', message: 'Country is required' });

  if (errors.length > 0) {
    return next(new ApiError(422, 'Address validation failed', errors));
  }

  res.status(200).json(new ApiResponse(200, { valid: true }, 'Shipping address is valid'));
};

/**
 * @desc    Validate registration data
 * @route   POST /api/v1/validate/auth/register
 */
export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.length < 3) errors.push({ field: 'name', message: 'Name must be at least 3 characters' });
  if (!email || !email.includes('@')) errors.push({ field: 'email', message: 'Valid email is required' });
  if (!password || password.length < 6) errors.push({ field: 'password', message: 'Password must be at least 6 characters' });

  if (errors.length > 0) {
    return next(new ApiError(422, 'Registration validation failed', errors));
  }

  res.status(200).json(new ApiResponse(200, { valid: true }, 'Registration data is valid'));
};

/**
 * @desc    Validate login credentials
 * @route   POST /api/v1/validate/auth/login
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !email.includes('@')) errors.push({ field: 'email', message: 'Valid email is required' });
  if (!password) errors.push({ field: 'password', message: 'Password is required' });

  if (errors.length > 0) {
    return next(new ApiError(422, 'Login validation failed', errors));
  }

  res.status(200).json(new ApiResponse(200, { valid: true }, 'Login credentials are valid'));
};

/**
 * @desc    Validate product payload
 * @route   POST /api/v1/validate/product
 */
export const validateProduct = (req, res, next) => {
  const { name, price, category } = req.body;
  const errors = [];

  if (!name) errors.push({ field: 'name', message: 'Product name is required' });
  if (!price || price <= 0) errors.push({ field: 'price', message: 'Price must be greater than 0' });
  if (!category) errors.push({ field: 'category', message: 'Category is required' });

  if (errors.length > 0) {
    return next(new ApiError(422, 'Product validation failed', errors));
  }

  res.status(200).json(new ApiResponse(200, { valid: true }, 'Product payload is valid'));
};

/**
 * @desc    Validate refund request
 * @route   POST /api/v1/validate/refund
 */
export const validateRefund = (req, res, next) => {
  const { orderId, reason, amount } = req.body;
  const errors = [];

  if (!orderId) errors.push({ field: 'orderId', message: 'Order ID is required' });
  if (!reason) errors.push({ field: 'reason', message: 'Refund reason is required' });
  if (!amount || amount <= 0) errors.push({ field: 'amount', message: 'Refund amount must be greater than 0' });

  if (errors.length > 0) {
    return next(new ApiError(422, 'Refund validation failed', errors));
  }

  res.status(200).json(new ApiResponse(200, { valid: true }, 'Refund request is valid'));
};

/**
 * @desc    Validate coupon code
 * @route   POST /api/v1/validate/coupon
 */
export const validateCoupon = (req, res, next) => {
  const { code } = req.body;
  const errors = [];

  if (!code) errors.push({ field: 'code', message: 'Coupon code is required' });
  if (code && code.length < 4) errors.push({ field: 'code', message: 'Coupon code must be at least 4 characters' });

  if (errors.length > 0) {
    return next(new ApiError(422, 'Coupon validation failed', errors));
  }

  res.status(200).json(new ApiResponse(200, { valid: true }, 'Coupon code is valid'));
};

/**
 * @desc    Validate uploaded file
 * @route   POST /api/v1/validate/upload
 */
export const validateUpload = (req, res, next) => {
  const { filename, size, mimetype } = req.body;
  const errors = [];
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!filename) errors.push({ field: 'filename', message: 'Filename is required' });
  if (!size) errors.push({ field: 'size', message: 'File size is required' });
  if (size && size > maxSize) errors.push({ field: 'size', message: 'File size must not exceed 5MB' });
  if (!mimetype) errors.push({ field: 'mimetype', message: 'File type is required' });
  if (mimetype && !allowedTypes.includes(mimetype)) errors.push({ field: 'mimetype', message: `Allowed types: ${allowedTypes.join(', ')}` });

  if (errors.length > 0) {
    return next(new ApiError(422, 'Upload validation failed', errors));
  }

  res.status(200).json(new ApiResponse(200, { valid: true }, 'File is valid for upload'));
};
