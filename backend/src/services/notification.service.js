import Notification from '../models/Notification.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';

class NotificationService {
  async _seedFromOrdersIfEmpty() {
    const count = await Notification.countDocuments();
    if (count > 0) return;

    const recentOrders = await Order.find({ isArchived: { $ne: true } })
      .sort({ OrderDate: -1 })
      .limit(5)
      .lean();

    const seeds = recentOrders.map((order) => ({
      title: `Order ${order.OrderStatus}`,
      message: `Order ${order.OrderID} for ${order.ProductName} is ${order.OrderStatus.toLowerCase()}.`,
      type: order.OrderStatus === 'Shipped' ? 'shipping' : 'order',
      relatedOrderId: order.OrderID,
      isRead: false,
    }));

    if (seeds.length) {
      await Notification.insertMany(seeds);
    } else {
      await Notification.create({
        title: 'Welcome',
        message: 'Welcome to Amazon Orders API. Your notifications will appear here.',
        type: 'system',
        isRead: false,
      });
    }
  }

  async getNotifications(query = {}) {
    await this._seedFromOrdersIfEmpty();

    const { page = 1, limit = 10, unreadOnly } = query;
    const filter = {};
    if (unreadOnly === 'true') {
      filter.isRead = false;
    }

    const skip = (page - 1) * limit;
    const [notifications, totalRecords] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)).lean(),
      Notification.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    return {
      data: notifications,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: parseInt(page, 10),
        limit: parseInt(limit, 10),
        hasNextPage: parseInt(page, 10) < totalPages,
        hasPrevPage: parseInt(page, 10) > 1,
      },
    };
  }

  async markAsRead(notificationId) {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    ).lean();

    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    return notification;
  }

  async deleteNotification(notificationId) {
    const notification = await Notification.findByIdAndDelete(notificationId).lean();
    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }
    return notification;
  }
}

export default new NotificationService();
