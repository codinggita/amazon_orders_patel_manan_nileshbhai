import { Router } from 'express';
import { param, query } from 'express-validator';
import * as notificationController from '../controllers/notification.controller.js';
import { handleValidationErrors } from '../validations/pagination.validation.js';

const router = Router();

const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  handleValidationErrors,
];

const validateNotificationId = [
  param('id').isMongoId().withMessage('Invalid notification ID'),
  handleValidationErrors,
];

router.get('/', validatePagination, notificationController.getNotifications);
router.patch('/read/:id', validateNotificationId, notificationController.markNotificationRead);
router.delete('/:id', validateNotificationId, notificationController.deleteNotification);

export default router;
