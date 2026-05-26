import mongoose from 'mongoose';
import Order from '../models/Order.js';

class StatsService {
  /**
   * 1. Total number of orders
   */
  async getOrdersTotal() {
    const count = await Order.countDocuments({ isArchived: false });
    return { totalOrders: count };
  }

  /**
   * 2. Daily orders statistics
   */
  async getOrdersDaily() {
    const stats = await Order.aggregate([
      { $match: { isArchived: false } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$OrderDate' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1,
        },
      },
    ]);
    return stats;
  }

  /**
   * 3. Monthly orders statistics
   */
  async getOrdersMonthly() {
    const stats = await Order.aggregate([
      { $match: { isArchived: false } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$OrderDate' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          month: '$_id',
          count: 1,
        },
      },
    ]);
    return stats;
  }

  /**
   * 4. Yearly orders statistics
   */
  async getOrdersYearly() {
    const stats = await Order.aggregate([
      { $match: { isArchived: false } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y', date: '$OrderDate' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          year: '$_id',
          count: 1,
        },
      },
    ]);
    return stats;
  }

  /**
   * 5. Total revenue statistics
   */
  async getRevenueTotal() {
    const result = await Order.aggregate([
      {
        $match: {
          isArchived: false,
          OrderStatus: { $nin: ['Cancelled', 'Returned'] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $toDouble: '$TotalAmount' } },
        },
      },
    ]);
    const totalRevenue = result[0]?.totalRevenue || 0;
    return { totalRevenue: parseFloat(totalRevenue.toFixed(2)) };
  }

  /**
   * 6. Daily revenue statistics
   */
  async getRevenueDaily() {
    const stats = await Order.aggregate([
      {
        $match: {
          isArchived: false,
          OrderStatus: { $nin: ['Cancelled', 'Returned'] },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$OrderDate' } },
          revenue: { $sum: { $toDouble: '$TotalAmount' } },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          revenue: { $round: ['$revenue', 2] },
        },
      },
    ]);
    return stats;
  }

  /**
   * 7. Monthly revenue statistics
   */
  async getRevenueMonthly() {
    const stats = await Order.aggregate([
      {
        $match: {
          isArchived: false,
          OrderStatus: { $nin: ['Cancelled', 'Returned'] },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$OrderDate' } },
          revenue: { $sum: { $toDouble: '$TotalAmount' } },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          month: '$_id',
          revenue: { $round: ['$revenue', 2] },
        },
      },
    ]);
    return stats;
  }

  /**
   * 8. Yearly revenue statistics
   */
  async getRevenueYearly() {
    const stats = await Order.aggregate([
      {
        $match: {
          isArchived: false,
          OrderStatus: { $nin: ['Cancelled', 'Returned'] },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y', date: '$OrderDate' } },
          revenue: { $sum: { $toDouble: '$TotalAmount' } },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          year: '$_id',
          revenue: { $round: ['$revenue', 2] },
        },
      },
    ]);
    return stats;
  }

  /**
   * 9. Total products count
   */
  async getProductsCount() {
    const result = await Order.distinct('ProductID', { isArchived: false });
    return { totalProducts: result.length };
  }

  /**
   * 10. Total customers count
   */
  async getCustomersCount() {
    const result = await Order.distinct('CustomerID', { isArchived: false });
    return { totalCustomers: result.length };
  }

  /**
   * 11. Total categories count
   */
  async getCategoriesCount() {
    const result = await Order.distinct('Category', { isArchived: false });
    return { totalCategories: result.length };
  }

  /**
   * 12. Refund count statistics (Returned orders count)
   */
  async getRefundsCount() {
    const count = await Order.countDocuments({
      isArchived: false,
      OrderStatus: 'Returned',
    });
    return { totalRefunds: count };
  }

  /**
   * 13. Cancellation count statistics (Cancelled orders count)
   */
  async getCancellationsCount() {
    const count = await Order.countDocuments({
      isArchived: false,
      OrderStatus: 'Cancelled',
    });
    return { totalCancellations: count };
  }

  /**
   * 14. Average shipping duration
   */
  async getShippingAverageTime() {
    const result = await Order.aggregate([
      {
        $match: {
          isArchived: false,
          'statusHistory.status': 'Shipped',
        },
      },
      {
        $project: {
          OrderDate: 1,
          shippedDate: {
            $filter: {
              input: '$statusHistory',
              as: 'history',
              cond: { $eq: ['$$history.status', 'Shipped'] },
            },
          },
        },
      },
      {
        $project: {
          durationMs: {
            $subtract: [
              { $arrayElemAt: ['$shippedDate.changedAt', 0] },
              '$OrderDate',
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          averageDurationHours: { $avg: { $divide: ['$durationMs', 3600000] } },
        },
      },
    ]);

    const averageDurationHours = result[0]?.averageDurationHours || 0;
    return {
      averageDurationHours: parseFloat(averageDurationHours.toFixed(2)),
      averageDurationDays: parseFloat((averageDurationHours / 24).toFixed(2)),
    };
  }

  /**
   * 15. API performance statistics
   */
  async getSystemPerformance() {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    const dbStatus =
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    return {
      uptimeSeconds: process.uptime(),
      uptimeFriendly: this._formatUptime(process.uptime()),
      memory: {
        rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
        heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
        external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
      },
      cpu: cpuUsage,
      databaseStatus: dbStatus,
      nodeVersion: process.version,
      platform: process.platform,
    };
  }

  _formatUptime(seconds) {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
  }
}

export default new StatsService();
