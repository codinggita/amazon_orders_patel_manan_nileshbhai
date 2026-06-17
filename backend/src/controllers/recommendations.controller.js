import recommendationsService from '../services/recommendations.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

const getLimit = (req) => {
  const limit = parseInt(req.query.limit, 10);
  return Number.isNaN(limit) || limit <= 0 ? 10 : Math.min(limit, 50);
};

export const getProductRecommendations = asyncHandler(async (req, res) => {
  const data = await recommendationsService.getProductRecommendations(
    req.params.customerId,
    getLimit(req)
  );
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Product recommendations retrieved successfully'));
});

export const getOrderRecommendations = asyncHandler(async (req, res) => {
  const data = await recommendationsService.getOrderRecommendations(
    req.params.orderId,
    getLimit(req)
  );
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Similar product recommendations retrieved successfully'));
});
