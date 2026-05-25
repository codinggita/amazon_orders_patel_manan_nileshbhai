import { Router } from 'express';
import * as searchController from '../controllers/search.controller.js';
import {
  validateQueryParams,
  validateSearchQuery,
  handleValidationErrors,
} from '../validations/order.validation.js';
import {
  validatePaginatedSearch,
  handleValidationErrors as handlePaginationErrors,
} from '../validations/pagination.validation.js';

const router = Router();

/**
 * Search Routes
 * Base path: /api/v1/orders/search
 *
 * Mounted in app.js BEFORE order routes so paths are not captured by /:orderId.
 */

const searchMiddlewares = [
  validateSearchQuery,
  validateQueryParams,
  handleValidationErrors,
];

/**
 * @route   GET /api/v1/orders/search?q=phone&page=1&limit=20
 * @desc    Paginated search results (q required)
 */
router.get(
  '/',
  validatePaginatedSearch,
  handlePaginationErrors,
  searchController.searchOrders
);

/**
 * @route   GET /api/v1/orders/search/customer?q=john
 * @desc    Search orders by customer name
 */
router.get('/customer', searchMiddlewares, searchController.searchByCustomer);

/**
 * @route   GET /api/v1/orders/search/product?q=iphone
 * @desc    Search by product name
 */
router.get('/product', searchMiddlewares, searchController.searchByProduct);

/**
 * @route   GET /api/v1/orders/search/category?q=electronics
 * @desc    Search by category
 */
router.get('/category', searchMiddlewares, searchController.searchByCategory);

/**
 * @route   GET /api/v1/orders/search/brand?q=samsung
 * @desc    Search by brand
 */
router.get('/brand', searchMiddlewares, searchController.searchByBrand);

/**
 * @route   GET /api/v1/orders/search/status?q=delivered
 * @desc    Search by order status
 */
router.get('/status', searchMiddlewares, searchController.searchByStatus);

/**
 * @route   GET /api/v1/orders/search/payment?q=upi
 * @desc    Search by payment method
 */
router.get('/payment', searchMiddlewares, searchController.searchByPayment);

/**
 * @route   GET /api/v1/orders/search/location?q=delhi
 * @desc    Search by location (city, state, or country)
 */
router.get('/location', searchMiddlewares, searchController.searchByLocation);

/**
 * @route   GET /api/v1/orders/search/date?q=2025-01
 * @desc    Search by order date (YYYY-MM or YYYY-MM-DD)
 */
router.get('/date', searchMiddlewares, searchController.searchByDate);

/**
 * @route   GET /api/v1/orders/search/tracking?q=TRK123
 * @desc    Search by tracking ID (matches OrderID in schema)
 */
router.get('/tracking', searchMiddlewares, searchController.searchByTracking);

/**
 * @route   GET /api/v1/orders/search/fuzzy?q=headfone
 * @desc    Fuzzy search support
 */
router.get('/fuzzy', searchMiddlewares, searchController.searchFuzzy);

/**
 * @route   GET /api/v1/orders/search/autocomplete?q=iph
 * @desc    Autocomplete suggestions for product names
 */
router.get(
  '/autocomplete',
  validateSearchQuery,
  handleValidationErrors,
  searchController.getAutocomplete
);

/**
 * @route   GET /api/v1/orders/search/highlight?q=mouse
 * @desc    Highlight matching text in results
 */
router.get('/highlight', searchMiddlewares, searchController.searchHighlight);

/**
 * @route   GET /api/v1/orders/search/recent
 * @desc    Fetch recent searches
 */
router.get('/recent', searchController.getRecentSearches);

/**
 * @route   GET /api/v1/orders/search/popular
 * @desc    Fetch popular searches
 */
router.get('/popular', searchController.getPopularSearches);

export default router;
