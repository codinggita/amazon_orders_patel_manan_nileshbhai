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
 * Registration Validation Schema
 */
const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

/**
 * Login Validation Schema
 */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Update Profile Validation Schema
 */
const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address'),
  body().custom((value, { req }) => {
    if (!req.body.name && !req.body.email) {
      throw new Error('At least one field (name or email) must be provided for profile update');
    }
    return true;
  }),
];

/**
 * Forgot Password Validation Schema
 */
const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address'),
];

/**
 * Reset Password Validation Schema
 */
const validateResetPassword = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
];

/**
 * Change Password Validation Schema
 */
const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
];

/**
 * Verify Email Validation Schema
 */
const validateVerifyEmail = [
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits'),
];

/**
 * Send OTP Validation Schema
 */
const validateSendOtp = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address'),
];

/**
 * Verify OTP Validation Schema
 */
const validateVerifyOtp = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits'),
];

/**
 * Refresh Token Validation Schema
 */
const validateRefreshToken = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),
];

/**
 * Session ID Parameter Validation Schema
 */
const validateSessionId = [
  param('id')
    .notEmpty()
    .withMessage('Session ID is required')
    .isMongoId()
    .withMessage('Invalid session ID format'),
];

export {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
  validateVerifyEmail,
  validateSendOtp,
  validateVerifyOtp,
  validateRefreshToken,
  validateSessionId,
  handleValidationErrors,
};
