import metaService from '../services/meta.service.js';
import asyncHandler from '../utils/asyncHandler.js';

export const sendHeadResponse = (headers, statusCode = 200) =>
  asyncHandler(async (req, res) => {
    const meta = typeof headers === 'function' ? await headers(req) : headers;
    Object.entries(meta).forEach(([key, value]) => res.set(key, value));
    res.set('Content-Type', 'application/json');
    return res.status(statusCode).end();
  });

export const sendOptionsResponse = (methods) =>
  asyncHandler(async (req, res) => {
    res.set('Allow', methods.join(', '));
    res.set('Access-Control-Allow-Methods', methods.join(', '));
    return res.status(204).end();
  });

export const headOrders = sendHeadResponse(() => metaService.getOrdersCollectionMeta());
export const headOrderById = sendHeadResponse((req) => metaService.getOrderMeta(req.params.orderId));
export const headOrderItems = sendHeadResponse((req) => metaService.getOrderItemsMeta(req.params.orderId));
export const headSearch = sendHeadResponse(() => metaService.getSearchMeta());
export const headFilterDelivered = sendHeadResponse(() => metaService.getFilterDeliveredMeta());
export const headShippingPending = sendHeadResponse(() => metaService.getShippingPendingMeta());
export const headShippingTracking = sendHeadResponse((req) => metaService.getShippingTrackingMeta(req.params.orderId));
export const headAnalyticsRevenue = sendHeadResponse(() => metaService.getAnalyticsRevenueMeta());
export const headStatsOrders = sendHeadResponse(() => metaService.getStatsOrdersMeta());
export const headAdminUsers = sendHeadResponse(() => metaService.getAdminUsersMeta());
export const headAdminOrders = sendHeadResponse(() => metaService.getAdminOrdersMeta());
export const headDashboardOverview = sendHeadResponse(() => metaService.getDashboardOverviewMeta());
export const headSystemUptime = sendHeadResponse(() => metaService.getSystemUptimeMeta());
export const headDatabaseStatus = sendHeadResponse(() => metaService.getDatabaseStatusMeta());
export const headCacheStatus = sendHeadResponse(() => metaService.getCacheStatusMeta());
export const headStorageStatus = sendHeadResponse(() => metaService.getStorageStatusMeta());
export const headAuthProfile = sendHeadResponse(() => metaService.getAuthProfileMeta());
export const headNotifications = sendHeadResponse(() => metaService.getNotificationsMeta());
export const headActivityLogs = sendHeadResponse(() => metaService.getActivityLogsMeta());
export const headSystemPing = sendHeadResponse(() => metaService.getSystemPingMeta());

export const optionsOrders = sendOptionsResponse(['GET', 'POST', 'HEAD', 'OPTIONS']);
export const optionsOrderById = sendOptionsResponse(['GET', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']);
export const optionsSearch = sendOptionsResponse(['GET', 'HEAD', 'OPTIONS']);
export const optionsFilterStatus = sendOptionsResponse(['GET', 'HEAD', 'OPTIONS']);
export const optionsShippingTracking = sendOptionsResponse(['GET', 'PATCH', 'HEAD', 'OPTIONS']);
export const optionsShippingCreateLabel = sendOptionsResponse(['POST', 'OPTIONS']);
export const optionsAuthLogin = sendOptionsResponse(['POST', 'OPTIONS']);
export const optionsAuthRegister = sendOptionsResponse(['POST', 'OPTIONS']);
export const optionsAdminUsers = sendOptionsResponse(['GET', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']);
export const optionsAdminOrders = sendOptionsResponse(['GET', 'HEAD', 'OPTIONS']);
export const optionsAdminSystemHealth = sendOptionsResponse(['GET', 'POST', 'HEAD', 'OPTIONS']);
export const optionsAnalyticsRevenue = sendOptionsResponse(['GET', 'HEAD', 'OPTIONS']);
export const optionsDashboardOverview = sendOptionsResponse(['GET', 'HEAD', 'OPTIONS']);
export const optionsNotifications = sendOptionsResponse(['GET', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']);
export const optionsSystemVersion = sendOptionsResponse(['GET', 'OPTIONS']);
export const optionsDatabaseStatus = sendOptionsResponse(['GET', 'HEAD', 'OPTIONS']);
export const optionsCacheStatus = sendOptionsResponse(['GET', 'HEAD', 'OPTIONS']);
export const optionsStorageStatus = sendOptionsResponse(['GET', 'HEAD', 'OPTIONS']);
export const optionsValidateOrder = sendOptionsResponse(['POST', 'PATCH', 'OPTIONS']);
export const optionsErrorsNotFound = sendOptionsResponse(['GET', 'OPTIONS']);
