import { Router } from 'express';
import * as errorController from '../controllers/error.controller.js';

const router = Router();

/**
 * Error Handling (Simulation) Routes
 * Base path: /api/v1/errors
 */

/**
 * @route   GET /api/v1/errors/not-found
 * @desc    Simulate 404 error
 * @access  Public
 */
router.get('/not-found', errorController.simulateNotFound);

/**
 * @route   GET /api/v1/errors/server-error
 * @desc    Simulate internal server error
 * @access  Public
 */
router.get('/server-error', errorController.simulateServerError);

/**
 * @route   GET /api/v1/errors/database
 * @desc    Simulate database error
 * @access  Public
 */
router.get('/database', errorController.simulateDatabaseError);

/**
 * @route   GET /api/v1/errors/validation
 * @desc    Simulate validation failure
 * @access  Public
 */
router.get('/validation', errorController.simulateValidationError);

/**
 * @route   GET /api/v1/errors/rate-limit
 * @desc    Simulate rate limit error
 * @access  Public
 */
router.get('/rate-limit', errorController.simulateRateLimitError);

/**
 * @route   GET /api/v1/errors/token-expired
 * @desc    Simulate expired token
 * @access  Public
 */
router.get('/token-expired', errorController.simulateTokenExpired);

/**
 * @route   GET /api/v1/errors/payment-failed
 * @desc    Simulate payment failure
 * @access  Public
 */
router.get('/payment-failed', errorController.simulatePaymentFailed);

/**
 * @route   GET /api/v1/errors/shipping-failed
 * @desc    Simulate shipping failure
 * @access  Public
 */
router.get('/shipping-failed', errorController.simulateShippingFailed);

/**
 * @route   GET /api/v1/errors/upload-error
 * @desc    Simulate upload error
 * @access  Public
 */
router.get('/upload-error', errorController.simulateUploadError);

/**
 * @route   GET /api/v1/errors/cache-error
 * @desc    Simulate cache failure
 * @access  Public
 */
router.get('/cache-error', errorController.simulateCacheError);

export default router;
