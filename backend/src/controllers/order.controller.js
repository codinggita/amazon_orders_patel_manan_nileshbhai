import orderService from '../services/order.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';


/**
 * Create new order
 * @route POST /api/v1/orders
 */
const createOrder = asyncHandler(async (req, res) => {
  const orderData = req.body;
  const order = await orderService.createOrder(orderData);
  
  return res
    .status(201)
    .json(new ApiResponse(201, order, 'Order created successfully'));
});

/**
 * Get all orders with filtering, sorting, pagination
 * @route GET /api/v1/orders
 * @query {Number} page - Page number (default: 1)
 * @query {Number} limit - Records per page (default: 10)
 * @query {String} sort - Sort field (default: -createdAt)
 * @query {String} search - Search term for multiple fields
 * @query {String} CustomerName - Filter by customer name
 * @query {String} ProductName - Filter by product name
 * @query {String} Category - Filter by category
 * @query {String} Brand - Filter by brand
 * @query {String} OrderStatus - Filter by order status
 * @query {String} PaymentMethod - Filter by payment method
 * @query {String} Country - Filter by country
 * @query {String} State - Filter by state
 * @query {String} City - Filter by city
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getAllOrders(req.query);
  
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Orders fetched successfully',
        result.pagination
      )
    );
});

/**
 * Get order by MongoDB ID
 * @route GET /api/v1/orders/:orderId
 */
const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await orderService.getOrderById(orderId);
  
  return res
    .status(200)
    .json(new ApiResponse(200, order, 'Order fetched successfully'));
});

/**
 * Update complete order (PUT)
 * @route PUT /api/v1/orders/:orderId
 */
const updateOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const updateData = req.body;
  const order = await orderService.updateOrder(orderId, updateData);
  
  return res
    .status(200)
    .json(new ApiResponse(200, order, 'Order updated successfully'));
});

/**
 * Partial update order (PATCH)
 * @route PATCH /api/v1/orders/:orderId
 */
const partialUpdateOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const updateData = req.body;
  const order = await orderService.partialUpdateOrder(orderId, updateData);
  
  return res
    .status(200)
    .json(new ApiResponse(200, order, 'Order updated successfully'));
});

/**
 * Delete order permanently
 * @route DELETE /api/v1/orders/:orderId
 */
const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  await orderService.deleteOrder(orderId);
  
  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Order deleted successfully'));
});

/**
 * Check if order exists
 * @route GET /api/v1/orders/:orderId/exists
 */
const checkOrderExists = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const exists = await orderService.checkOrderExists(orderId);
  
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { exists },
        exists ? 'Order exists' : 'Order does not exist'
      )
    );
});

/**
 * Get order summary
 * @route GET /api/v1/orders/:orderId/summary
 */
const getOrderSummary = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const summary = await orderService.getOrderSummary(orderId);
  
  return res
    .status(200)
    .json(new ApiResponse(200, summary, 'Order summary fetched successfully'));
});

/**
 * Get order items (product details)
 * @route GET /api/v1/orders/:orderId/items
 */
const getOrderItems = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const items = await orderService.getOrderItems(orderId);
  
  return res
    .status(200)
    .json(new ApiResponse(200, items, 'Order items fetched successfully'));
});

/**
 * Get order status history
 * @route GET /api/v1/orders/:orderId/history
 */
const getOrderHistory = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const history = await orderService.getOrderHistory(orderId);
  
  return res
    .status(200)
    .json(new ApiResponse(200, history, 'Order history fetched successfully'));
});

/**
 * Archive order (soft delete)
 * @route PATCH /api/v1/orders/:orderId/archive
 */
const archiveOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await orderService.archiveOrder(orderId);
  
  return res
    .status(200)
    .json(new ApiResponse(200, order, 'Order archived successfully'));
});

/**
 * Restore archived order
 * @route PATCH /api/v1/orders/:orderId/restore
 */
const restoreOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await orderService.restoreOrder(orderId);
  
  return res
    .status(200)
    .json(new ApiResponse(200, order, 'Order restored successfully'));
});

/**
 * Cancel order
 * @route POST /api/v1/orders/:orderId/cancel
 */
const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { reason } = req.body;
  const order = await orderService.cancelOrder(orderId, reason);
  
  return res
    .status(200)
    .json(new ApiResponse(200, order, 'Order cancelled successfully'));
});

/**
 * Duplicate order
 * @route POST /api/v1/orders/:orderId/duplicate
 */
const duplicateOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const duplicatedOrder = await orderService.duplicateOrder(orderId);
  
  return res
    .status(201)
    .json(
      new ApiResponse(201, duplicatedOrder, 'Order duplicated successfully')
    );
});

/**
 * Generate invoice
 * @route GET /api/v1/orders/:orderId/invoice
 */
const generateInvoice = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const invoice = await orderService.generateInvoice(orderId);
  
  return res
    .status(200)
    .json(new ApiResponse(200, invoice, 'Invoice generated successfully'));
});

/**
 * Update order status
 * @route PATCH /api/v1/orders/:orderId/status
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status, reason } = req.body;
  const order = await orderService.updateOrderStatus(orderId, status, reason);
  
  return res
    .status(200)
    .json(new ApiResponse(200, order, 'Order status updated successfully'));
});

export {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  partialUpdateOrder,
  deleteOrder,
  checkOrderExists,
  getOrderSummary,
  getOrderItems,
  getOrderHistory,
  archiveOrder,
  restoreOrder,
  cancelOrder,
  duplicateOrder,
  generateInvoice,
  updateOrderStatus,
};
