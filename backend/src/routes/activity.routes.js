import { Router } from 'express';
import { query } from 'express-validator';
import * as activityController from '../controllers/activity.controller.js';
import { handleValidationErrors } from '../validations/pagination.validation.js';

const router = Router();

const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('entityType')
    .optional()
    .isIn(['order', 'user', 'shipping', 'payment', 'system'])
    .withMessage('Invalid entity type'),
  handleValidationErrors,
];

router.get('/logs', validatePagination, activityController.getActivityLogs);

export default router;
