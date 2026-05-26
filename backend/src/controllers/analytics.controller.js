import analyticsService from '../services/analytics.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// Helper to parse limit query parameter
const getLimit = (req) => {
  const limit = parseInt(req.query.limit, 10);
  return isNaN(limit) || limit <= 0 ? 10 : limit;
};

/**
 * GET /api/v1/analytics/revenue/total
 */
export const getRevenueTotal = asyncHandler(async (req, res) => {
  const data = await analyticsService.getRevenueTotal();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Total revenue calculated successfully'));
});

/**
 * GET /api/v1/analytics/revenue/monthly
 */
export const getRevenueMonthly = asyncHandler(async (req, res) => {
  const data = await analyticsService.getRevenueMonthly();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Monthly revenue analytics retrieved successfully'));
});

/**
 * GET /api/v1/analytics/revenue/yearly
 */
export const getRevenueYearly = asyncHandler(async (req, res) => {
  const data = await analyticsService.getRevenueYearly();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Yearly revenue analytics retrieved successfully'));
});

/**
 * GET /api/v1/analytics/orders/average-value
 */
export const getOrdersAverageValue = asyncHandler(async (req, res) => {
  const data = await analyticsService.getOrdersAverageValue();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Average order value calculated successfully'));
});

/**
 * GET /api/v1/analytics/orders/count
 */
export const getOrdersCount = asyncHandler(async (req, res) => {
  const data = await analyticsService.getOrdersCount();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Total orders count and breakdown retrieved successfully'));
});

/**
 * GET /api/v1/analytics/orders/cancelled
 */
export const getOrdersCancelled = asyncHandler(async (req, res) => {
  const data = await analyticsService.getOrdersCancelled();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Cancelled order analytics retrieved successfully'));
});

/**
 * GET /api/v1/analytics/orders/refunded
 */
export const getOrdersRefunded = asyncHandler(async (req, res) => {
  const data = await analyticsService.getOrdersRefunded();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Refunded order analytics retrieved successfully'));
});

/**
 * GET /api/v1/analytics/customers/top
 */
export const getCustomersTop = asyncHandler(async (req, res) => {
  const limit = getLimit(req);
  const data = await analyticsService.getCustomersTop(limit);
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Top customers analytics retrieved successfully'));
});

/**
 * GET /api/v1/analytics/products/top-selling
 */
export const getProductsTopSelling = asyncHandler(async (req, res) => {
  const limit = getLimit(req);
  const data = await analyticsService.getProductsTopSelling(limit);
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Top selling products retrieved successfully'));
});

/**
 * GET /api/v1/analytics/products/low-selling
 */
export const getProductsLowSelling = asyncHandler(async (req, res) => {
  const limit = getLimit(req);
  const data = await analyticsService.getProductsLowSelling(limit);
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Low selling products retrieved successfully'));
});

/**
 * GET /api/v1/analytics/categories/top
 */
export const getCategoriesTop = asyncHandler(async (req, res) => {
  const limit = getLimit(req);
  const data = await analyticsService.getCategoriesTop(limit);
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Top categories analytics retrieved successfully'));
});

/**
 * GET /api/v1/analytics/payments/distribution
 */
export const getPaymentsDistribution = asyncHandler(async (req, res) => {
  const data = await analyticsService.getPaymentsDistribution();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Payment methods distribution retrieved successfully'));
});

/**
 * GET /api/v1/analytics/locations/top-cities
 */
export const getLocationsTopCities = asyncHandler(async (req, res) => {
  const limit = getLimit(req);
  const data = await analyticsService.getLocationsTopCities(limit);
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Top performing cities retrieved successfully'));
});

/**
 * GET /api/v1/analytics/returns/rate
 */
export const getReturnsRate = asyncHandler(async (req, res) => {
  const data = await analyticsService.getReturnsRate();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Return rate analytics retrieved successfully'));
});

/**
 * GET /api/v1/analytics/discounts/usage
 */
export const getDiscountsUsage = asyncHandler(async (req, res) => {
  const data = await analyticsService.getDiscountsUsage();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Discount usage analytics retrieved successfully'));
});
