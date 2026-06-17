import trendingService from '../services/trending.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

const getLimit = (req) => {
  const limit = parseInt(req.query.limit, 10);
  return Number.isNaN(limit) || limit <= 0 ? 10 : Math.min(limit, 50);
};

export const getTrendingProducts = asyncHandler(async (req, res) => {
  const data = await trendingService.getTrendingProducts(getLimit(req));
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Trending products retrieved successfully'));
});

export const getTrendingCategories = asyncHandler(async (req, res) => {
  const data = await trendingService.getTrendingCategories(getLimit(req));
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Trending categories retrieved successfully'));
});
