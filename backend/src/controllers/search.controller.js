import searchService from '../services/search.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * General Keyword Search
 */
const searchOrders = asyncHandler(async (req, res) => {
  const result = await searchService.searchOrders(req.query.q, req.query);
  return res.status(200).json(new ApiResponse(200, result.data, 'Search results fetched successfully', result.pagination));
});

/**
 * Search by Customer
 */
const searchByCustomer = asyncHandler(async (req, res) => {
  const result = await searchService.searchByCustomer(req.query.q, req.query);
  return res.status(200).json(new ApiResponse(200, result.data, 'Customer search results fetched successfully', result.pagination));
});

/**
 * Search by Product
 */
const searchByProduct = asyncHandler(async (req, res) => {
  const result = await searchService.searchByProduct(req.query.q, req.query);
  return res.status(200).json(new ApiResponse(200, result.data, 'Product search results fetched successfully', result.pagination));
});

/**
 * Search by Category
 */
const searchByCategory = asyncHandler(async (req, res) => {
  const result = await searchService.searchByCategory(req.query.q, req.query);
  return res.status(200).json(new ApiResponse(200, result.data, 'Category search results fetched successfully', result.pagination));
});

/**
 * Search by Brand
 */
const searchByBrand = asyncHandler(async (req, res) => {
  const result = await searchService.searchByBrand(req.query.q, req.query);
  return res.status(200).json(new ApiResponse(200, result.data, 'Brand search results fetched successfully', result.pagination));
});

/**
 * Search by Status
 */
const searchByStatus = asyncHandler(async (req, res) => {
  const result = await searchService.searchByStatus(req.query.q, req.query);
  return res.status(200).json(new ApiResponse(200, result.data, 'Status search results fetched successfully', result.pagination));
});

/**
 * Search by Payment Method
 */
const searchByPayment = asyncHandler(async (req, res) => {
  const result = await searchService.searchByPayment(req.query.q, req.query);
  return res.status(200).json(new ApiResponse(200, result.data, 'Payment search results fetched successfully', result.pagination));
});

/**
 * Search by Location
 */
const searchByLocation = asyncHandler(async (req, res) => {
  const result = await searchService.searchByLocation(req.query.q, req.query);
  return res.status(200).json(new ApiResponse(200, result.data, 'Location search results fetched successfully', result.pagination));
});

/**
 * Search by Date
 */
const searchByDate = asyncHandler(async (req, res) => {
  const result = await searchService.searchByDate(req.query.q, req.query);
  return res.status(200).json(new ApiResponse(200, result.data, 'Date search results fetched successfully', result.pagination));
});

/**
 * Search by Tracking ID
 */
const searchByTracking = asyncHandler(async (req, res) => {
  const result = await searchService.searchByTracking(req.query.q, req.query);
  return res.status(200).json(new ApiResponse(200, result.data, 'Tracking search results fetched successfully', result.pagination));
});

/**
 * Fuzzy Search
 */
const searchFuzzy = asyncHandler(async (req, res) => {
  const result = await searchService.searchFuzzy(req.query.q, req.query);
  return res.status(200).json(new ApiResponse(200, result.data, 'Fuzzy search results fetched successfully', result.pagination));
});

/**
 * Autocomplete Suggestions
 */
const getAutocomplete = asyncHandler(async (req, res) => {
  const result = await searchService.getAutocomplete(req.query.q);
  return res.status(200).json(new ApiResponse(200, result.data, 'Autocomplete suggestions fetched successfully'));
});

/**
 * Highlight Matching Text
 */
const searchHighlight = asyncHandler(async (req, res) => {
  const result = await searchService.searchHighlight(req.query.q, req.query);
  return res.status(200).json(new ApiResponse(200, result.data, 'Highlighted search results fetched successfully', result.pagination));
});

/**
 * Get Recent Searches
 */
const getRecentSearches = asyncHandler(async (req, res) => {
  const result = await searchService.getRecentSearches();
  return res.status(200).json(new ApiResponse(200, result.data, 'Recent searches fetched successfully'));
});

/**
 * Get Popular Searches
 */
const getPopularSearches = asyncHandler(async (req, res) => {
  const result = await searchService.getPopularSearches();
  return res.status(200).json(new ApiResponse(200, result.data, 'Popular searches fetched successfully'));
});

export {
  searchOrders,
  searchByCustomer,
  searchByProduct,
  searchByCategory,
  searchByBrand,
  searchByStatus,
  searchByPayment,
  searchByLocation,
  searchByDate,
  searchByTracking,
  searchFuzzy,
  getAutocomplete,
  searchHighlight,
  getRecentSearches,
  getPopularSearches
};
