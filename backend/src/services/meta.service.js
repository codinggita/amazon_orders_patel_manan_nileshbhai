import Order from '../models/Order.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';
import systemService from './system.service.js';

class MetaService {
  async getOrdersCollectionMeta() {
    const total = await Order.countDocuments({ isArchived: { $ne: true } });
    return { 'X-Total-Count': String(total), 'X-Resource': 'orders' };
  }

  async getOrderMeta(orderId) {
    const exists = await Order.exists({ OrderID: orderId, isArchived: { $ne: true } });
    return {
      'X-Resource': 'order',
      'X-Order-Exists': exists ? 'true' : 'false',
    };
  }

  async getOrderItemsMeta(orderId) {
    const order = await Order.findOne({ OrderID: orderId }).select('Quantity ProductName').lean();
    return {
      'X-Resource': 'order-items',
      'X-Item-Count': order ? '1' : '0',
    };
  }

  async getSearchMeta() {
    return { 'X-Resource': 'search', 'X-Search-Enabled': 'true' };
  }

  async getFilterDeliveredMeta() {
    const count = await Order.countDocuments({ OrderStatus: 'Delivered', isArchived: { $ne: true } });
    return { 'X-Resource': 'filter-delivered', 'X-Total-Count': String(count) };
  }

  async getShippingPendingMeta() {
    const count = await Order.countDocuments({
      OrderStatus: { $in: ['Pending', 'Processing', 'Shipped'] },
      isArchived: { $ne: true },
    });
    return { 'X-Resource': 'shipping-pending', 'X-Total-Count': String(count) };
  }

  async getShippingTrackingMeta(orderId) {
    const exists = await Order.exists({ OrderID: orderId });
    return { 'X-Resource': 'shipping-tracking', 'X-Order-Exists': exists ? 'true' : 'false' };
  }

  getAnalyticsRevenueMeta() {
    return { 'X-Resource': 'analytics-revenue', 'X-Analytics-Enabled': 'true' };
  }

  async getStatsOrdersMeta() {
    const total = await Order.countDocuments({ isArchived: { $ne: true } });
    return { 'X-Resource': 'stats-orders', 'X-Total-Count': String(total) };
  }

  async getAdminUsersMeta() {
    const total = await User.countDocuments();
    return { 'X-Resource': 'admin-users', 'X-Total-Count': String(total) };
  }

  async getAdminOrdersMeta() {
    const total = await Order.countDocuments();
    return { 'X-Resource': 'admin-orders', 'X-Total-Count': String(total) };
  }

  getDashboardOverviewMeta() {
    return { 'X-Resource': 'dashboard-overview', 'X-Dashboard-Enabled': 'true' };
  }

  getSystemUptimeMeta() {
    const uptime = systemService.getUptime();
    return {
      'X-Resource': 'system-uptime',
      'X-Uptime-Seconds': String(uptime.uptimeSeconds),
    };
  }

  async getDatabaseStatusMeta() {
    const status = await systemService.getDatabaseStatus();
    return { 'X-Resource': 'database-status', 'X-Status': status.status };
  }

  getCacheStatusMeta() {
    return { 'X-Resource': 'cache-status', 'X-Status': 'healthy' };
  }

  getStorageStatusMeta() {
    return { 'X-Resource': 'storage-status', 'X-Status': 'healthy' };
  }

  getAuthProfileMeta() {
    return { 'X-Resource': 'auth-profile', 'X-Auth-Required': 'true' };
  }

  async getNotificationsMeta() {
    const total = await Notification.countDocuments();
    const unread = await Notification.countDocuments({ isRead: false });
    return {
      'X-Resource': 'notifications',
      'X-Total-Count': String(total),
      'X-Unread-Count': String(unread),
    };
  }

  async getActivityLogsMeta() {
    const total = await ActivityLog.countDocuments();
    return { 'X-Resource': 'activity-logs', 'X-Total-Count': String(total) };
  }

  getSystemPingMeta() {
    return { 'X-Resource': 'system-ping', 'X-Status': 'ok' };
  }
}

export default new MetaService();
