import activityService from '../services/activity.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getActivityLogs = asyncHandler(async (req, res) => {
  const result = await activityService.getActivityLogs(req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, result.data, 'Activity logs retrieved successfully', result.pagination));
});
