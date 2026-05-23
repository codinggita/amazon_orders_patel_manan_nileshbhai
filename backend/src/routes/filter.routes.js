import { Router } from 'express';
import * as filterController from '../controllers/filter.controller.js';
import {
  validatePagination,
  validateFilterStatus,
  validateFilterPayment,
  validateFilterName,
  validateFilterPrice,
  validateFilterDateRange,
  validateFilterHighValue,
  handleValidationErrors,
} from '../validations/filter.validation.js';

const router = Router();

/**
 * Filter Routes
 * Base path: /api/v1/orders/filter
 *
 * Mounted in app.js BEFORE order routes so paths are not captured by /:orderId.
 */

const paginationOnly = [validatePagination, handleValidationErrors];

/**
 * @route   GET /api/v1/orders/filter/status?type=Pending
 * @desc    Filter by order status
 */
router.get(
  '/status',
  validateFilterStatus,
  handleValidationErrors,
  filterController.filterByStatus
);

/**
 * @route   GET /api/v1/orders/filter/payment?method=Card
 * @desc    Filter by payment method
 */
router.get(
  '/payment',
  validateFilterPayment,
  handleValidationErrors,
  filterController.filterByPayment
);

/**
 * @route   GET /api/v1/orders/filter/category?name=Electronics
 * @desc    Filter by category
 */
router.get(
  '/category',
  validateFilterName,
  handleValidationErrors,
  filterController.filterByCategory
);

/**
 * @route   GET /api/v1/orders/filter/brand?name=Apple
 * @desc    Filter by brand
 */
router.get(
  '/brand',
  validateFilterName,
  handleValidationErrors,
  filterController.filterByBrand
);

/**
 * @route   GET /api/v1/orders/filter/price?min=100&max=1000
 * @desc    Filter by price range (TotalAmount)
 */
router.get(
  '/price',
  validateFilterPrice,
  handleValidationErrors,
  filterController.filterByPrice
);

/**
 * @route   GET /api/v1/orders/filter/date?start=2025-01-01&end=2025-02-01
 * @desc    Filter by date range
 */
router.get(
  '/date',
  validateFilterDateRange,
  handleValidationErrors,
  filterController.filterByDateRange
);

/**
 * @route   GET /api/v1/orders/filter/country?name=India
 * @desc    Filter by country
 */
router.get(
  '/country',
  validateFilterName,
  handleValidationErrors,
  filterController.filterByCountry
);

/**
 * @route   GET /api/v1/orders/filter/state?name=Gujarat
 * @desc    Filter by state
 */
router.get(
  '/state',
  validateFilterName,
  handleValidationErrors,
  filterController.filterByState
);

/**
 * @route   GET /api/v1/orders/filter/city?name=Surat
 * @desc    Filter by city
 */
router.get(
  '/city',
  validateFilterName,
  handleValidationErrors,
  filterController.filterByCity
);

/**
 * @route   GET /api/v1/orders/filter/high-value?amount=1000
 * @desc    Filter high value orders
 */
router.get(
  '/high-value',
  validateFilterHighValue,
  handleValidationErrors,
  filterController.filterHighValue
);

/**
 * @route   GET /api/v1/orders/filter/discounted
 * @desc    Filter discounted orders
 */
router.get('/discounted', paginationOnly, filterController.filterDiscounted);

/**
 * @route   GET /api/v1/orders/filter/cancelled
 * @desc    Filter cancelled orders
 */
router.get('/cancelled', paginationOnly, filterController.filterCancelled);

/**
 * @route   GET /api/v1/orders/filter/refunded
 * @desc    Filter refunded orders (OrderStatus: Returned)
 */
router.get('/refunded', paginationOnly, filterController.filterRefunded);

/**
 * @route   GET /api/v1/orders/filter/shipped
 * @desc    Filter shipped orders
 */
router.get('/shipped', paginationOnly, filterController.filterShipped);

/**
 * @route   GET /api/v1/orders/filter/delivered
 * @desc    Filter delivered orders
 */
router.get('/delivered', paginationOnly, filterController.filterDelivered);

export default router;
