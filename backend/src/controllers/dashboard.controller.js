import dashboardService from '../services/dashboard.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getOverview = asyncHandler(async (req, res) => {
  const data = await dashboardService.getOverview();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Dashboard overview retrieved successfully'));
});

export const getRevenue = asyncHandler(async (req, res) => {
  const data = await dashboardService.getRevenueDashboard();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Revenue dashboard retrieved successfully'));
});

export const getOrders = asyncHandler(async (req, res) => {
  const data = await dashboardService.getOrdersDashboard();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Orders dashboard retrieved successfully'));
});

export const getCustomers = asyncHandler(async (req, res) => {
  const data = await dashboardService.getCustomersDashboard();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Customers dashboard retrieved successfully'));
});

export const getProducts = asyncHandler(async (req, res) => {
  const data = await dashboardService.getProductsDashboard();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Products dashboard retrieved successfully'));
});
