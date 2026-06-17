import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/overview', dashboardController.getOverview);
router.get('/revenue', dashboardController.getRevenue);
router.get('/orders', dashboardController.getOrders);
router.get('/customers', dashboardController.getCustomers);
router.get('/products', dashboardController.getProducts);

export default router;
