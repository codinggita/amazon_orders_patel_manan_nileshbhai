import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import verifyJWT from '../middlewares/auth.middleware.js';
import verifyAdmin from '../middlewares/admin.middleware.js';
import {
  validateUserIdParam,
  validateChangeRole,
  validatePagination,
  validateMaintenanceMode,
  handleValidationErrors,
} from '../validations/admin.validation.js';

const router = Router();

/**
 * Admin Routes
 * Base path: /api/v1/admin
 * Protected globally: Requires valid JWT and Admin role
 */
router.use(verifyJWT, verifyAdmin);

// User Management
router.get('/users', validatePagination, handleValidationErrors, adminController.getAllUsers);
router.get('/users/:id', validateUserIdParam, handleValidationErrors, adminController.getUserById);
router.patch('/users/:id/ban', validateUserIdParam, handleValidationErrors, adminController.banUser);
router.patch('/users/:id/unban', validateUserIdParam, handleValidationErrors, adminController.unbanUser);
router.patch('/users/:id/role', validateChangeRole, handleValidationErrors, adminController.changeUserRole);

// Order Management
router.get('/orders', validatePagination, handleValidationErrors, adminController.getAllOrders);

// Reports
router.get('/reports/sales', adminController.getSalesReport);
router.get('/reports/revenue', adminController.getRevenueReport);

// System Management
router.delete('/cache/clear', adminController.clearCache);
router.get('/system/health', adminController.getSystemHealth);
router.get('/system/logs', adminController.getSystemLogs);
router.post('/system/maintenance', validateMaintenanceMode, handleValidationErrors, adminController.setMaintenanceMode);
router.get('/backups', adminController.getBackups);

export default router;
