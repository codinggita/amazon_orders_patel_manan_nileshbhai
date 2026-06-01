import { Router } from 'express';
import * as validateController from '../controllers/validate.controller.js';

const router = Router();

/**
 * Validation Routes
 * Base path: /api/v1/validate
 */

/**
 * @route   POST /api/v1/validate/order
 * @desc    Validate order payload
 * @access  Public
 */
router.post('/order', validateController.validateOrder);

/**
 * @route   PATCH /api/v1/validate/order/:id
 * @desc    Validate order update
 * @access  Public
 */
router.patch('/order/:id', validateController.validateOrderUpdate);

/**
 * @route   POST /api/v1/validate/payment
 * @desc    Validate payment details
 * @access  Public
 */
router.post('/payment', validateController.validatePayment);

/**
 * @route   POST /api/v1/validate/address
 * @desc    Validate shipping address
 * @access  Public
 */
router.post('/address', validateController.validateAddress);

/**
 * @route   POST /api/v1/validate/auth/register
 * @desc    Validate registration data
 * @access  Public
 */
router.post('/auth/register', validateController.validateRegister);

/**
 * @route   POST /api/v1/validate/auth/login
 * @desc    Validate login credentials
 * @access  Public
 */
router.post('/auth/login', validateController.validateLogin);

/**
 * @route   POST /api/v1/validate/product
 * @desc    Validate product payload
 * @access  Public
 */
router.post('/product', validateController.validateProduct);

/**
 * @route   POST /api/v1/validate/refund
 * @desc    Validate refund request
 * @access  Public
 */
router.post('/refund', validateController.validateRefund);

/**
 * @route   POST /api/v1/validate/coupon
 * @desc    Validate coupon code
 * @access  Public
 */
router.post('/coupon', validateController.validateCoupon);

/**
 * @route   POST /api/v1/validate/upload
 * @desc    Validate uploaded file
 * @access  Public
 */
router.post('/upload', validateController.validateUpload);

export default router;
