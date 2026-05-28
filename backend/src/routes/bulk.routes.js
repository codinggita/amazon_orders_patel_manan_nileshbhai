import { Router } from 'express';
import * as bulkController from '../controllers/bulk.controller.js';

const router = Router();

/**
 * Bulk Operations Routes
 * Base path: /api/v1/orders/bulk
 */

/**
 * @route   POST /api/v1/orders/bulk/create
 * @desc    Bulk create orders
 * @access  Public
 */
router.post('/create', bulkController.bulkCreate);

/**
 * @route   PATCH /api/v1/orders/bulk/update
 * @desc    Bulk update orders
 * @access  Public
 */
router.patch('/update', bulkController.bulkUpdate);

/**
 * @route   DELETE /api/v1/orders/bulk/delete
 * @desc    Bulk delete orders
 * @access  Public
 */
router.delete('/delete', bulkController.bulkDelete);

/**
 * @route   PATCH /api/v1/orders/bulk/status
 * @desc    Bulk update order statuses
 * @access  Public
 */
router.patch('/status', bulkController.bulkUpdateStatus);

/**
 * @route   PATCH /api/v1/orders/bulk/archive
 * @desc    Bulk archive orders
 * @access  Public
 */
router.patch('/archive', bulkController.bulkArchive);

/**
 * @route   PATCH /api/v1/orders/bulk/restore
 * @desc    Bulk restore orders
 * @access  Public
 */
router.patch('/restore', bulkController.bulkRestore);

/**
 * @route   POST /api/v1/orders/bulk/apply-discount
 * @desc    Apply discount in bulk
 * @access  Public
 */
router.post('/apply-discount', bulkController.bulkApplyDiscount);

/**
 * @route   PATCH /api/v1/orders/bulk/payment-status
 * @desc    Bulk update payment status
 * @access  Public
 */
router.patch('/payment-status', bulkController.bulkUpdatePaymentStatus);

/**
 * @route   PATCH /api/v1/orders/bulk/shipping-status
 * @desc    Bulk update shipping status
 * @access  Public
 */
router.patch('/shipping-status', bulkController.bulkUpdateShippingStatus);

/**
 * @route   DELETE /api/v1/orders/bulk/cleanup-cancelled
 * @desc    Delete cancelled orders
 * @access  Public
 */
router.delete('/cleanup-cancelled', bulkController.cleanupCancelled);

export default router;
