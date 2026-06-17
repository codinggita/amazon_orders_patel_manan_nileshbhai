import ActivityLog from '../models/ActivityLog.js';
import Order from '../models/Order.js';

class ActivityService {
  async _seedFromOrdersIfEmpty() {
    const count = await ActivityLog.countDocuments();
    if (count > 0) return;

    const orders = await Order.find({ isArchived: { $ne: true } })
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('OrderID OrderStatus statusHistory ProductName CustomerName')
      .lean();

    const logs = [];

    for (const order of orders) {
      logs.push({
        action: 'order_viewed',
        entityType: 'order',
        entityId: order.OrderID,
        description: `Order ${order.OrderID} (${order.ProductName}) status: ${order.OrderStatus}`,
        performedBy: order.CustomerName || 'system',
      });

      if (order.statusHistory?.length) {
        const latest = order.statusHistory[order.statusHistory.length - 1];
        logs.push({
          action: 'status_changed',
          entityType: 'order',
          entityId: order.OrderID,
          description: `Order ${order.OrderID} status changed to ${latest.status}`,
          performedBy: 'system',
          metadata: { reason: latest.reason, changedAt: latest.changedAt },
        });
      }
    }

    if (logs.length) {
      await ActivityLog.insertMany(logs);
    }
  }

  async getActivityLogs(query = {}) {
    await this._seedFromOrdersIfEmpty();

    const { page = 1, limit = 20, entityType } = query;
    const filter = {};
    if (entityType) {
      filter.entityType = entityType;
    }

    const skip = (page - 1) * limit;
    const [logs, totalRecords] = await Promise.all([
      ActivityLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)).lean(),
      ActivityLog.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    return {
      data: logs,
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
}

export default new ActivityService();
