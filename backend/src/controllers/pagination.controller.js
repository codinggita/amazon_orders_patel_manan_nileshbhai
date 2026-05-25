import paginationService from '../services/pagination.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Paginated listing — GET /api/v1/orders/paged?page=1&limit=50
 */
const getPagedListing = asyncHandler(async (req, res) => {
  const result = await paginationService.getPagedListing(req.query);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Paged orders fetched successfully',
        result.pagination
      )
    );
});

/**
 * Infinite scroll — GET /api/v1/orders/infinite?page=1
 */
const getInfiniteScroll = asyncHandler(async (req, res) => {
  const result = await paginationService.getInfiniteScroll(req.query);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Infinite scroll orders fetched successfully',
        result.pagination
      )
    );
});

/**
 * Recent orders — GET /api/v1/orders/recent?page=1&limit=5
 */
const getRecentOrders = asyncHandler(async (req, res) => {
  const result = await paginationService.getRecentOrders(req.query);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Recent orders fetched successfully',
        result.pagination
      )
    );
});

/**
 * Cancelled orders — GET /api/v1/orders/cancelled?page=1&limit=10
 */
const getCancelledOrders = asyncHandler(async (req, res) => {
  const result = await paginationService.getCancelledOrders(req.query);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Cancelled orders fetched successfully',
        result.pagination
      )
    );
});

/**
 * Refunded orders — GET /api/v1/orders/refunded?page=1&limit=10
 */
const getRefundedOrders = asyncHandler(async (req, res) => {
  const result = await paginationService.getRefundedOrders(req.query);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Refunded orders fetched successfully',
        result.pagination
      )
    );
});

/**
 * Customer orders — GET /api/v1/orders/customer/:customerId?page=1&limit=10
 */
const getOrdersByCustomer = asyncHandler(async (req, res) => {
  const result = await paginationService.getOrdersByCustomer(
    req.params.customerId,
    req.query
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Customer orders fetched successfully',
        result.pagination
      )
    );
});

/**
 * Product orders — GET /api/v1/orders/product/:productId?page=1&limit=10
 */
const getOrdersByProduct = asyncHandler(async (req, res) => {
  const result = await paginationService.getOrdersByProduct(
    req.params.productId,
    req.query
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Product orders fetched successfully',
        result.pagination
      )
    );
});

export {
  getPagedListing,
  getInfiniteScroll,
  getRecentOrders,
  getCancelledOrders,
  getRefundedOrders,
  getOrdersByCustomer,
  getOrdersByProduct,
};
