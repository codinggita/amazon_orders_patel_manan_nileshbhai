import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import verifyJWT from '../middlewares/auth.middleware.js';
import {
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
} from '../validations/auth.validation.js';

const router = Router();

/**
 * Authentication & Authorization Routes
 * Base path: /api/v1/auth
 */

// Registration
router.post('/register', validateRegister, handleValidationErrors, authController.register);

// Login
router.post('/login', validateLogin, handleValidationErrors, authController.login);

// Logout
router.post('/logout', validateRefreshToken, handleValidationErrors, authController.logout);

// Refresh Token
router.post('/refresh-token', validateRefreshToken, handleValidationErrors, authController.refreshToken);

// Forgot Password
router.post('/forgot-password', validateForgotPassword, handleValidationErrors, authController.forgotPassword);

// Reset Password
router.post('/reset-password', validateResetPassword, handleValidationErrors, authController.resetPassword);

// General OTP - Send
router.post('/send-otp', validateSendOtp, handleValidationErrors, authController.sendOtp);

// General OTP - Verify
router.post('/verify-otp', validateVerifyOtp, handleValidationErrors, authController.verifyOtp);


/* Protected Routes (Require JWT Auth) */

// Get Profile
router.get('/profile', verifyJWT, authController.getProfile);

// Update Profile
router.patch('/profile', verifyJWT, validateUpdateProfile, handleValidationErrors, authController.updateProfile);

// Delete Profile
router.delete('/profile', verifyJWT, authController.deleteProfile);

// Change Password
router.post('/change-password', verifyJWT, validateChangePassword, handleValidationErrors, authController.changePassword);

// Verify Email
router.post('/verify-email', verifyJWT, validateVerifyEmail, handleValidationErrors, authController.verifyEmail);

// Fetch Active Sessions
router.get('/sessions', verifyJWT, authController.getSessions);

// Terminate Active Session
router.delete('/sessions/:id', verifyJWT, validateSessionId, handleValidationErrors, authController.removeSession);

export default router;
