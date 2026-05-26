import sortService from '../services/sort.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

const respond = (res, result, message) =>
  res
    .status(200)
    .json(new ApiResponse(200, result.data, message, result.pagination));

const getHighestValue = asyncHandler(async (req, res) => {
  const result = await sortService.getHighestValue(req.query);
  return respond(res, result, 'Orders sorted by highest value successfully');
});

const getLowestValue = asyncHandler(async (req, res) => {
  const result = await sortService.getLowestValue(req.query);
  return respond(res, result, 'Orders sorted by lowest value successfully');
});

const getLatest = asyncHandler(async (req, res) => {
  const result = await sortService.getLatest(req.query);
  return respond(res, result, 'Latest orders fetched successfully');
});

const getOldest = asyncHandler(async (req, res) => {
  const result = await sortService.getOldest(req.query);
  return respond(res, result, 'Oldest orders fetched successfully');
});

const getMostItems = asyncHandler(async (req, res) => {
  const result = await sortService.getMostItems(req.query);
  return respond(res, result, 'Orders sorted by most items successfully');
});

const getLeastItems = asyncHandler(async (req, res) => {
  const result = await sortService.getLeastItems(req.query);
  return respond(res, result, 'Orders sorted by least items successfully');
});

const getByDiscount = asyncHandler(async (req, res) => {
  const result = await sortService.getByDiscount(req.query);
  return respond(res, result, 'Orders sorted by discount amount successfully');
});

export {
  getHighestValue,
  getLowestValue,
  getLatest,
  getOldest,
  getMostItems,
  getLeastItems,
  getByDiscount,
};
