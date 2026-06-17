import { Router } from 'express';
import { query } from 'express-validator';
import * as trendingController from '../controllers/trending.controller.js';
import { handleValidationErrors } from '../validations/pagination.validation.js';

const router = Router();

const validateLimit = [
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  handleValidationErrors,
];

router.get('/products', validateLimit, trendingController.getTrendingProducts);
router.get('/categories', validateLimit, trendingController.getTrendingCategories);

export default router;
