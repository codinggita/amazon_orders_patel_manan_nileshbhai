import { Router } from 'express';
import * as statsController from '../controllers/stats.controller.js';

const router = Router();

/**
 * Statistics Routes
 * Base path: /api/v1/stats
 */

// Orders statistics
router.get('/orders/total', statsController.getOrdersTotal);
router.get('/orders/daily', statsController.getOrdersDaily);
router.get('/orders/monthly', statsController.getOrdersMonthly);
router.get('/orders/yearly', statsController.getOrdersYearly);

// Revenue statistics
router.get('/revenue/total', statsController.getRevenueTotal);
router.get('/revenue/daily', statsController.getRevenueDaily);
router.get('/revenue/monthly', statsController.getRevenueMonthly);
router.get('/revenue/yearly', statsController.getRevenueYearly);

// Entity counts
router.get('/products/count', statsController.getProductsCount);
router.get('/customers/count', statsController.getCustomersCount);
router.get('/categories/count', statsController.getCategoriesCount);

// Returns & Cancellations
router.get('/refunds/count', statsController.getRefundsCount);
router.get('/cancellations/count', statsController.getCancellationsCount);

// Shipping duration
router.get('/shipping/average-time', statsController.getShippingAverageTime);

// System performance
router.get('/system/performance', statsController.getSystemPerformance);

export default router;
