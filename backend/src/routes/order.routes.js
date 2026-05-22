import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import {
  validateCreateOrder,
  validateUpdateOrder,
  validateOrderId,
  validateQueryParams,
  validateCancelOrder,
  validateUpdateStatus,
  handleValidationErrors,
} from '../validations/order.validation.js';

const router = Router();

/**
 * Order Routes
 * Base path: /api/v1/orders
 */

/**
 * @route   POST /api/v1/orders
 * @desc    Create a new order
 * @access  Public
 * @body    {Object} Order data
 */
router.post('/', validateCreateOrder, handleValidationErrors, orderController.createOrder);

/**
 * @route   GET /api/v1/orders
 * @desc    Get all orders with filtering, sorting, and pagination
 * @access  Public
 * @query   {Number} page - Page number (default: 1)
 * @query   {Number} limit - Records per page (default: 10)
 * @query   {String} sort - Sort field (default: -createdAt)
 * @query   {String} search - Search term
 * @query   {String} CustomerName - Filter by customer name
 * @query   {String} ProductName - Filter by product name
 * @query   {String} Category - Filter by category
 * @query   {String} Brand - Filter by brand
 * @query   {String} OrderStatus - Filter by order status
 * @query   {String} PaymentMethod - Filter by payment method
 * @query   {String} Country - Filter by country
 * @query   {String} State - Filter by state
 * @query   {String} City - Filter by city
 */
router.get('/', validateQueryParams, handleValidationErrors, orderController.getAllOrders);

/**
 * @route   GET /api/v1/orders/:orderId/exists
 * @desc    Check if order exists
 * @access  Public
 * @param   {String} orderId - Order ID
 */
router.get(
  '/:orderId/exists',
  validateOrderId,
  handleValidationErrors,
  orderController.checkOrderExists
);

/**
 * @route   GET /api/v1/orders/:orderId/summary
 * @desc    Get order summary (minimal data)
 * @access  Public
 * @param   {String} orderId - Order ID
 */
router.get(
  '/:orderId/summary',
  validateOrderId,
  handleValidationErrors,
  orderController.getOrderSummary
);

/**
 * @route   GET /api/v1/orders/:orderId/items
 * @desc    Get order items (product details)
 * @access  Public
 * @param   {String} orderId - Order ID
 */
router.get(
  '/:orderId/items',
  validateOrderId,
  handleValidationErrors,
  orderController.getOrderItems
);

/**
 * @route   GET /api/v1/orders/:orderId/history
 * @desc    Get order status history
 * @access  Public
 * @param   {String} orderId - Order ID
 */
router.get(
  '/:orderId/history',
  validateOrderId,
  handleValidationErrors,
  orderController.getOrderHistory
);

/**
 * @route   GET /api/v1/orders/:orderId/invoice
 * @desc    Generate invoice for order
 * @access  Public
 * @param   {String} orderId - Order ID
 */
router.get(
  '/:orderId/invoice',
  validateOrderId,
  handleValidationErrors,
  orderController.generateInvoice
);

/**
 * @route   GET /api/v1/orders/:orderId
 * @desc    Get order details by ID
 * @access  Public
 * @param   {String} orderId - Order ID
 */
router.get(
  '/:orderId',
  validateOrderId,
  handleValidationErrors,
  orderController.getOrderById
);

/**
 * @route   PUT /api/v1/orders/:orderId
 * @desc    Update complete order
 * @access  Public
 * @param   {String} orderId - Order ID
 * @body    {Object} Updated order data
 */
router.put(
  '/:orderId',
  validateOrderId,
  validateUpdateOrder,
  handleValidationErrors,
  orderController.updateOrder
);

/**
 * @route   PATCH /api/v1/orders/:orderId
 * @desc    Partial update order
 * @access  Public
 * @param   {String} orderId - Order ID
 * @body    {Object} Partial order data
 */
router.patch(
  '/:orderId',
  validateOrderId,
  validateUpdateOrder,
  handleValidationErrors,
  orderController.partialUpdateOrder
);

/**
 * @route   PATCH /api/v1/orders/:orderId/status
 * @desc    Update order status with history
 * @access  Public
 * @param   {String} orderId - Order ID
 * @body    {String} status - New status
 * @body    {String} reason - Status change reason (optional)
 */
router.patch(
  '/:orderId/status',
  validateOrderId,
  validateUpdateStatus,
  handleValidationErrors,
  orderController.updateOrderStatus
);

/**
 * @route   PATCH /api/v1/orders/:orderId/archive
 * @desc    Archive order (soft delete)
 * @access  Public
 * @param   {String} orderId - Order ID
 */
router.patch(
  '/:orderId/archive',
  validateOrderId,
  handleValidationErrors,
  orderController.archiveOrder
);

/**
 * @route   PATCH /api/v1/orders/:orderId/restore
 * @desc    Restore archived order
 * @access  Public
 * @param   {String} orderId - Order ID
 */
router.patch(
  '/:orderId/restore',
  validateOrderId,
  handleValidationErrors,
  orderController.restoreOrder
);

/**
 * @route   POST /api/v1/orders/:orderId/cancel
 * @desc    Cancel order
 * @access  Public
 * @param   {String} orderId - Order ID
 * @body    {String} reason - Cancellation reason (optional)
 */
router.post(
  '/:orderId/cancel',
  validateOrderId,
  validateCancelOrder,
  handleValidationErrors,
  orderController.cancelOrder
);

/**
 * @route   POST /api/v1/orders/:orderId/duplicate
 * @desc    Duplicate order
 * @access  Public
 * @param   {String} orderId - Order ID
 */
router.post(
  '/:orderId/duplicate',
  validateOrderId,
  handleValidationErrors,
  orderController.duplicateOrder
);

/**
 * @route   DELETE /api/v1/orders/:orderId
 * @desc    Delete order permanently
 * @access  Public
 * @param   {String} orderId - Order ID
 */
router.delete(
  '/:orderId',
  validateOrderId,
  handleValidationErrors,
  orderController.deleteOrder
);

export default router;
