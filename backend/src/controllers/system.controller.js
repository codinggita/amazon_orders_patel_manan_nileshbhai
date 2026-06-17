import systemService from '../services/system.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getVersion = asyncHandler(async (req, res) => {
  const data = systemService.getVersion();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'API version retrieved successfully'));
});

export const getConfig = asyncHandler(async (req, res) => {
  const data = systemService.getPublicConfig();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Public configuration retrieved successfully'));
});

export const getUptime = asyncHandler(async (req, res) => {
  const data = systemService.getUptime();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Server uptime retrieved successfully'));
});

export const ping = asyncHandler(async (req, res) => {
  const data = systemService.ping();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'API server is reachable'));
});

export const getDatabaseStatus = asyncHandler(async (req, res) => {
  const data = await systemService.getDatabaseStatus();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Database health check completed'));
});

export const getCacheStatus = asyncHandler(async (req, res) => {
  const data = systemService.getCacheStatus();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Cache health check completed'));
});

export const getStorageStatus = asyncHandler(async (req, res) => {
  const data = systemService.getStorageStatus();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Storage health check completed'));
});
