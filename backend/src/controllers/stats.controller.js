import statsService from '../services/stats.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/v1/stats/orders/total
 */
export const getOrdersTotal = asyncHandler(async (req, res) => {
  const data = await statsService.getOrdersTotal();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Total orders count retrieved successfully'));
});

/**
 * GET /api/v1/stats/orders/daily
 */
export const getOrdersDaily = asyncHandler(async (req, res) => {
  const data = await statsService.getOrdersDaily();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Daily orders statistics retrieved successfully'));
});

/**
 * GET /api/v1/stats/orders/monthly
 */
export const getOrdersMonthly = asyncHandler(async (req, res) => {
  const data = await statsService.getOrdersMonthly();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Monthly orders statistics retrieved successfully'));
});

/**
 * GET /api/v1/stats/orders/yearly
 */
export const getOrdersYearly = asyncHandler(async (req, res) => {
  const data = await statsService.getOrdersYearly();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Yearly orders statistics retrieved successfully'));
});

/**
 * GET /api/v1/stats/revenue/total
 */
export const getRevenueTotal = asyncHandler(async (req, res) => {
  const data = await statsService.getRevenueTotal();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Total revenue statistics calculated successfully'));
});

/**
 * GET /api/v1/stats/revenue/daily
 */
export const getRevenueDaily = asyncHandler(async (req, res) => {
  const data = await statsService.getRevenueDaily();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Daily revenue statistics retrieved successfully'));
});

/**
 * GET /api/v1/stats/revenue/monthly
 */
export const getRevenueMonthly = asyncHandler(async (req, res) => {
  const data = await statsService.getRevenueMonthly();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Monthly revenue statistics retrieved successfully'));
});

/**
 * GET /api/v1/stats/revenue/yearly
 */
export const getRevenueYearly = asyncHandler(async (req, res) => {
  const data = await statsService.getRevenueYearly();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Yearly revenue statistics retrieved successfully'));
});

/**
 * GET /api/v1/stats/products/count
 */
export const getProductsCount = asyncHandler(async (req, res) => {
  const data = await statsService.getProductsCount();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Total unique products count retrieved successfully'));
});

/**
 * GET /api/v1/stats/customers/count
 */
export const getCustomersCount = asyncHandler(async (req, res) => {
  const data = await statsService.getCustomersCount();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Total unique customers count retrieved successfully'));
});

/**
 * GET /api/v1/stats/categories/count
 */
export const getCategoriesCount = asyncHandler(async (req, res) => {
  const data = await statsService.getCategoriesCount();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Total unique categories count retrieved successfully'));
});

/**
 * GET /api/v1/stats/refunds/count
 */
export const getRefundsCount = asyncHandler(async (req, res) => {
  const data = await statsService.getRefundsCount();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Refund count statistics retrieved successfully'));
});

/**
 * GET /api/v1/stats/cancellations/count
 */
export const getCancellationsCount = asyncHandler(async (req, res) => {
  const data = await statsService.getCancellationsCount();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Cancellation count statistics retrieved successfully'));
});

/**
 * GET /api/v1/stats/shipping/average-time
 */
export const getShippingAverageTime = asyncHandler(async (req, res) => {
  const data = await statsService.getShippingAverageTime();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Average shipping duration retrieved successfully'));
});

/**
 * GET /api/v1/stats/system/performance
 */
export const getSystemPerformance = asyncHandler(async (req, res) => {
  const data = await statsService.getSystemPerformance();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'API and system performance statistics retrieved successfully'));
});
