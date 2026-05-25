import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import * as paginationController from '../controllers/pagination.controller.js';
import {
  validateCreateOrder,
  validateUpdateOrder,
  validateOrderId,
  validateQueryParams,
  validateCancelOrder,
  validateUpdateStatus,
  handleValidationErrors,
} from '../validations/order.validation.js';
import {
  validatePagination,
  validatePagedListing,
  validateInfinitePagination,
  validateCustomerIdParam,
  validateProductIdParam,
  handleValidationErrors as handlePaginationErrors,
} from '../validations/pagination.validation.js';

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
 * @route   GET /api/v1/orders?page=1&limit=10
 * @route   GET /api/v1/orders?page=2&limit=20
 * @desc    Standard pagination with optional filters
 */
router.get('/', validateQueryParams, handleValidationErrors, orderController.getAllOrders);

/**
 * @route   GET /api/v1/orders/paged?page=1&limit=50
 * @desc    Paginated order listing (default limit 50)
 */
router.get(
  '/paged',
  validatePagedListing,
  handlePaginationErrors,
  paginationController.getPagedListing
);

/**
 * @route   GET /api/v1/orders/infinite?page=1
 * @desc    Infinite scroll pagination (includes hasMore, nextPage)
 */
router.get(
  '/infinite',
  validateInfinitePagination,
  handlePaginationErrors,
  paginationController.getInfiniteScroll
);

/**
 * @route   GET /api/v1/orders/recent?page=1&limit=5
 * @desc    Paginated recent orders (sorted by OrderDate desc)
 */
router.get(
  '/recent',
  validatePagination,
  handlePaginationErrors,
  paginationController.getRecentOrders
);

/**
 * @route   GET /api/v1/orders/cancelled?page=1&limit=10
 * @desc    Paginated cancelled orders
 */
router.get(
  '/cancelled',
  validatePagination,
  handlePaginationErrors,
  paginationController.getCancelledOrders
);

/**
 * @route   GET /api/v1/orders/refunded?page=1&limit=10
 * @desc    Paginated refunded/returned orders
 */
router.get(
  '/refunded',
  validatePagination,
  handlePaginationErrors,
  paginationController.getRefundedOrders
);

/**
 * @route   GET /api/v1/orders/customer/:customerId?page=1&limit=10
 * @desc    Paginated orders for a customer
 */
router.get(
  '/customer/:customerId',
  validateCustomerIdParam,
  handlePaginationErrors,
  paginationController.getOrdersByCustomer
);

/**
 * @route   GET /api/v1/orders/product/:productId?page=1&limit=10
 * @desc    Paginated orders for a product
 */
router.get(
  '/product/:productId',
  validateProductIdParam,
  handlePaginationErrors,
  paginationController.getOrdersByProduct
);

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
