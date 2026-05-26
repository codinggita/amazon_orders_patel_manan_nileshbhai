import { Router } from 'express';
import { query } from 'express-validator';
import * as analyticsController from '../controllers/analytics.controller.js';
import { handleValidationErrors } from '../validations/pagination.validation.js';

const router = Router();

// Validation middleware for limit query parameter
const validateLimit = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),
  handleValidationErrors,
];

/**
 * Analytics Routes
 * Base path: /api/v1/analytics
 */

// 1. Total revenue
router.get('/revenue/total', analyticsController.getRevenueTotal);

// 2. Monthly revenue analytics
router.get('/revenue/monthly', analyticsController.getRevenueMonthly);

// 3. Yearly revenue analytics
router.get('/revenue/yearly', analyticsController.getRevenueYearly);

// 4. Average order value
router.get('/orders/average-value', analyticsController.getOrdersAverageValue);

// 5. Total orders count
router.get('/orders/count', analyticsController.getOrdersCount);

// 6. Cancelled order analytics
router.get('/orders/cancelled', analyticsController.getOrdersCancelled);

// 7. Refunded order analytics
router.get('/orders/refunded', analyticsController.getOrdersRefunded);

// 8. Top customers analytics
router.get('/customers/top', validateLimit, analyticsController.getCustomersTop);

// 9. Top selling products
router.get('/products/top-selling', validateLimit, analyticsController.getProductsTopSelling);

// 10. Low selling products
router.get('/products/low-selling', validateLimit, analyticsController.getProductsLowSelling);

// 11. Top categories analytics
router.get('/categories/top', validateLimit, analyticsController.getCategoriesTop);

// 12. Payment methods distribution
router.get('/payments/distribution', analyticsController.getPaymentsDistribution);

// 13. Top performing cities
router.get('/locations/top-cities', validateLimit, analyticsController.getLocationsTopCities);

// 14. Return rate analytics
router.get('/returns/rate', analyticsController.getReturnsRate);

// 15. Discount usage analytics
router.get('/discounts/usage', analyticsController.getDiscountsUsage);

export default router;
