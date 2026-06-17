import { Router } from 'express';
import verifyJWT from '../middlewares/auth.middleware.js';
import verifyAdmin from '../middlewares/admin.middleware.js';
import * as metaController from '../controllers/meta.controller.js';

const router = Router();

/**
 * HEAD Routes — metadata-only responses
 */
router.head('/orders', metaController.headOrders);
router.head('/orders/:orderId', metaController.headOrderById);
router.head('/orders/:orderId/items', metaController.headOrderItems);
router.head('/orders/search', metaController.headSearch);
router.head('/orders/filter/delivered', metaController.headFilterDelivered);
router.head('/shipping/pending', metaController.headShippingPending);
router.head('/shipping/tracking/:orderId', metaController.headShippingTracking);
router.head('/analytics/revenue/total', metaController.headAnalyticsRevenue);
router.head('/stats/orders/total', metaController.headStatsOrders);
router.head('/admin/users', verifyJWT, verifyAdmin, metaController.headAdminUsers);
router.head('/admin/orders', verifyJWT, verifyAdmin, metaController.headAdminOrders);
router.head('/dashboard/overview', metaController.headDashboardOverview);
router.head('/system/uptime', metaController.headSystemUptime);
router.head('/system/status/database', metaController.headDatabaseStatus);
router.head('/system/status/cache', metaController.headCacheStatus);
router.head('/system/status/storage', metaController.headStorageStatus);
router.head('/auth/profile', verifyJWT, metaController.headAuthProfile);
router.head('/notifications', metaController.headNotifications);
router.head('/activity/logs', metaController.headActivityLogs);
router.head('/system/ping', metaController.headSystemPing);

/**
 * OPTIONS Routes — CORS / method discovery
 */
router.options('/orders', metaController.optionsOrders);
router.options('/orders/:orderId', metaController.optionsOrderById);
router.options('/orders/search', metaController.optionsSearch);
router.options('/orders/filter/status', metaController.optionsFilterStatus);
router.options('/shipping/tracking/:orderId', metaController.optionsShippingTracking);
router.options('/shipping/create-label', metaController.optionsShippingCreateLabel);
router.options('/auth/login', metaController.optionsAuthLogin);
router.options('/auth/register', metaController.optionsAuthRegister);
router.options('/admin/users', metaController.optionsAdminUsers);
router.options('/admin/orders', metaController.optionsAdminOrders);
router.options('/admin/system/health', metaController.optionsAdminSystemHealth);
router.options('/analytics/revenue/total', metaController.optionsAnalyticsRevenue);
router.options('/dashboard/overview', metaController.optionsDashboardOverview);
router.options('/notifications', metaController.optionsNotifications);
router.options('/system/version', metaController.optionsSystemVersion);
router.options('/system/status/database', metaController.optionsDatabaseStatus);
router.options('/system/status/cache', metaController.optionsCacheStatus);
router.options('/system/status/storage', metaController.optionsStorageStatus);
router.options('/validate/order', metaController.optionsValidateOrder);
router.options('/errors/not-found', metaController.optionsErrorsNotFound);

export default router;
