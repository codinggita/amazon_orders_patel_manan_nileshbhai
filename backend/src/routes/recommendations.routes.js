import { Router } from 'express';
import { param, query } from 'express-validator';
import * as recommendationsController from '../controllers/recommendations.controller.js';
import { handleValidationErrors } from '../validations/pagination.validation.js';

const router = Router();

const validateCustomerId = [
  param('customerId')
    .matches(/^CUST\d{6}$/)
    .withMessage('CustomerID must follow format: CUST000001'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  handleValidationErrors,
];

const validateOrderId = [
  param('orderId')
    .matches(/^ORD\d{7}$/)
    .withMessage('OrderID must follow format: ORD0000001'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  handleValidationErrors,
];

router.get('/products/:customerId', validateCustomerId, recommendationsController.getProductRecommendations);
router.get('/orders/:orderId', validateOrderId, recommendationsController.getOrderRecommendations);

export default router;
