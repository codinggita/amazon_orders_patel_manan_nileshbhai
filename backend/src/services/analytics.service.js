import mongoose from 'mongoose';
import Order from '../models/Order.js';

class AnalyticsService {
  /**
   * 1. Calculate total revenue
   * Excludes archived orders, and orders with status 'Cancelled' or 'Returned'.
   */
  async getRevenueTotal() {
    const result = await Order.aggregate([
      {
        $match: {
          isArchived: { $ne: true },
          OrderStatus: { $nin: ['Cancelled', 'Returned'] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $toDouble: '$TotalAmount' } },
          totalOrdersCount: { $sum: 1 },
        },
      },
    ]);

    const data = result[0] || { totalRevenue: 0, totalOrdersCount: 0 };
    return {
      totalRevenue: parseFloat(data.totalRevenue.toFixed(2)),
      totalOrdersCount: data.totalOrdersCount,
    };
  }

  /**
   * 2. Monthly revenue analytics
   * Excludes archived orders, and orders with status 'Cancelled' or 'Returned'.
   */
  async getRevenueMonthly() {
    const result = await Order.aggregate([
      {
        $match: {
          isArchived: { $ne: true },
          OrderStatus: { $nin: ['Cancelled', 'Returned'] },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$OrderDate' },
            month: { $month: '$OrderDate' },
          },
          revenue: { $sum: { $toDouble: '$TotalAmount' } },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: {
                  if: { $lt: ['$_id.month', 10] },
                  then: { $concat: ['0', { $toString: '$_id.month' }] },
                  else: { $toString: '$_id.month' },
                },
              },
            ],
          },
          revenue: { $round: ['$revenue', 2] },
          orderCount: 1,
        },
      },
    ]);

    return result;
  }

  /**
   * 3. Yearly revenue analytics
   * Excludes archived orders, and orders with status 'Cancelled' or 'Returned'.
   */
  async getRevenueYearly() {
    const result = await Order.aggregate([
      {
        $match: {
          isArchived: { $ne: true },
          OrderStatus: { $nin: ['Cancelled', 'Returned'] },
        },
      },
      {
        $group: {
          _id: { $year: '$OrderDate' },
          revenue: { $sum: { $toDouble: '$TotalAmount' } },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          year: '$_id',
          revenue: { $round: ['$revenue', 2] },
          orderCount: 1,
        },
      },
    ]);

    return result;
  }

  /**
   * 4. Average order value
   * Excludes archived and Cancelled orders.
   */
  async getOrdersAverageValue() {
    const result = await Order.aggregate([
      {
        $match: {
          isArchived: { $ne: true },
          OrderStatus: { $nin: ['Cancelled'] },
        },
      },
      {
        $group: {
          _id: null,
          averageOrderValue: { $avg: { $toDouble: '$TotalAmount' } },
          totalOrdersCount: { $sum: 1 },
        },
      },
    ]);

    const data = result[0] || { averageOrderValue: 0, totalOrdersCount: 0 };
    return {
      averageOrderValue: parseFloat(data.averageOrderValue.toFixed(2)),
      totalOrdersCount: data.totalOrdersCount,
    };
  }

  /**
   * 5. Total orders count with breakdown by status
   */
  async getOrdersCount() {
    const result = await Order.aggregate([
      {
        $match: { isArchived: { $ne: true } },
      },
      {
        $group: {
          _id: '$OrderStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    const breakdown = {
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
      Returned: 0,
    };

    let totalOrders = 0;
    result.forEach((item) => {
      if (item._id in breakdown) {
        breakdown[item._id] = item.count;
      }
      totalOrders += item.count;
    });

    return {
      totalOrders,
      breakdown,
    };
  }

  /**
   * 6. Cancelled order analytics
   */
  async getOrdersCancelled() {
    const cancelledStats = await Order.aggregate([
      {
        $match: { isArchived: { $ne: true } },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          cancelledCount: {
            $sum: {
              $cond: [{ $eq: ['$OrderStatus', 'Cancelled'] }, 1, 0],
            },
          },
          cancelledRevenue: {
            $sum: {
              $cond: [
                { $eq: ['$OrderStatus', 'Cancelled'] },
                { $toDouble: '$TotalAmount' },
                0,
              ],
            },
          },
        },
      },
    ]);

    const trend = await Order.aggregate([
      {
        $match: { isArchived: { $ne: true }, OrderStatus: 'Cancelled' },
      },
      {
        $group: {
          _id: {
            year: { $year: '$OrderDate' },
            month: { $month: '$OrderDate' },
          },
          count: { $sum: 1 },
          lostRevenue: { $sum: { $toDouble: '$TotalAmount' } },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: {
                  if: { $lt: ['$_id.month', 10] },
                  then: { $concat: ['0', { $toString: '$_id.month' }] },
                  else: { $toString: '$_id.month' },
                },
              },
            ],
          },
          count: 1,
          lostRevenue: { $round: ['$lostRevenue', 2] },
        },
      },
    ]);

    const stats = cancelledStats[0] || {
      totalOrders: 0,
      cancelledCount: 0,
      cancelledRevenue: 0,
    };
    const percentage =
      stats.totalOrders > 0
        ? (stats.cancelledCount / stats.totalOrders) * 100
        : 0;

    return {
      cancelledCount: stats.cancelledCount,
      cancelledPercentage: parseFloat(percentage.toFixed(2)),
      lostRevenue: parseFloat(stats.cancelledRevenue.toFixed(2)),
      trend,
    };
  }

  /**
   * 7. Refunded order analytics
   */
  async getOrdersRefunded() {
    const refundedStats = await Order.aggregate([
      {
        $match: { isArchived: { $ne: true } },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          refundedCount: {
            $sum: {
              $cond: [{ $eq: ['$OrderStatus', 'Returned'] }, 1, 0],
            },
          },
          refundedRevenue: {
            $sum: {
              $cond: [
                { $eq: ['$OrderStatus', 'Returned'] },
                { $toDouble: '$TotalAmount' },
                0,
              ],
            },
          },
        },
      },
    ]);

    const trend = await Order.aggregate([
      {
        $match: { isArchived: { $ne: true }, OrderStatus: 'Returned' },
      },
      {
        $group: {
          _id: {
            year: { $year: '$OrderDate' },
            month: { $month: '$OrderDate' },
          },
          count: { $sum: 1 },
          refundedAmount: { $sum: { $toDouble: '$TotalAmount' } },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: {
                  if: { $lt: ['$_id.month', 10] },
                  then: { $concat: ['0', { $toString: '$_id.month' }] },
                  else: { $toString: '$_id.month' },
                },
              },
            ],
          },
          count: 1,
          refundedAmount: { $round: ['$refundedAmount', 2] },
        },
      },
    ]);

    const stats = refundedStats[0] || {
      totalOrders: 0,
      refundedCount: 0,
      refundedRevenue: 0,
    };
    const percentage =
      stats.totalOrders > 0
        ? (stats.refundedCount / stats.totalOrders) * 100
        : 0;

    return {
      refundedCount: stats.refundedCount,
      refundedPercentage: parseFloat(percentage.toFixed(2)),
      refundedAmount: parseFloat(stats.refundedRevenue.toFixed(2)),
      trend,
    };
  }

  /**
   * 8. Top customers analytics
   */
  async getCustomersTop(limit = 10) {
    const result = await Order.aggregate([
      {
        $match: {
          isArchived: { $ne: true },
          OrderStatus: { $nin: ['Cancelled'] },
        },
      },
      {
        $group: {
          _id: '$CustomerID',
          customerName: { $first: '$CustomerName' },
          totalSpent: { $sum: { $toDouble: '$TotalAmount' } },
          ordersCount: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          customerId: '$_id',
          customerName: 1,
          totalSpent: { $round: ['$totalSpent', 2] },
          ordersCount: 1,
        },
      },
    ]);

    return result;
  }

  /**
   * 9. Top selling products
   */
  async getProductsTopSelling(limit = 10) {
    const result = await Order.aggregate([
      {
        $match: {
          isArchived: { $ne: true },
          OrderStatus: { $nin: ['Cancelled', 'Returned'] },
        },
      },
      {
        $group: {
          _id: '$ProductID',
          productName: { $first: '$ProductName' },
          category: { $first: '$Category' },
          brand: { $first: '$Brand' },
          totalQuantitySold: { $sum: '$Quantity' },
          totalRevenue: { $sum: { $toDouble: '$TotalAmount' } },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          productName: 1,
          category: 1,
          brand: 1,
          totalQuantitySold: 1,
          totalRevenue: { $round: ['$totalRevenue', 2] },
        },
      },
    ]);

    return result;
  }

  /**
   * 10. Low selling products
   */
  async getProductsLowSelling(limit = 10) {
    const result = await Order.aggregate([
      {
        $match: {
          isArchived: { $ne: true },
          OrderStatus: { $nin: ['Cancelled', 'Returned'] },
        },
      },
      {
        $group: {
          _id: '$ProductID',
          productName: { $first: '$ProductName' },
          category: { $first: '$Category' },
          brand: { $first: '$Brand' },
          totalQuantitySold: { $sum: '$Quantity' },
          totalRevenue: { $sum: { $toDouble: '$TotalAmount' } },
        },
      },
      { $sort: { totalQuantitySold: 1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          productName: 1,
          category: 1,
          brand: 1,
          totalQuantitySold: 1,
          totalRevenue: { $round: ['$totalRevenue', 2] },
        },
      },
    ]);

    return result;
  }

  /**
   * 11. Top categories analytics
   */
  async getCategoriesTop(limit = 10) {
    const result = await Order.aggregate([
      {
        $match: {
          isArchived: { $ne: true },
          OrderStatus: { $nin: ['Cancelled', 'Returned'] },
        },
      },
      {
        $group: {
          _id: '$Category',
          totalRevenue: { $sum: { $toDouble: '$TotalAmount' } },
          totalQuantitySold: { $sum: '$Quantity' },
          ordersCount: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalRevenue: { $round: ['$totalRevenue', 2] },
          totalQuantitySold: 1,
          ordersCount: 1,
        },
      },
    ]);

    return result;
  }

  /**
   * 12. Payment methods distribution
   */
  async getPaymentsDistribution() {
    const stats = await Order.aggregate([
      {
        $match: { isArchived: { $ne: true } },
      },
      {
        $group: {
          _id: '$PaymentMethod',
          count: { $sum: 1 },
          totalAmount: { $sum: { $toDouble: '$TotalAmount' } },
        },
      },
    ]);

    const totalOrders = stats.reduce((sum, item) => sum + item.count, 0);
    const result = stats.map((item) => ({
      paymentMethod: item._id,
      count: item.count,
      totalAmount: parseFloat(item.totalAmount.toFixed(2)),
      percentage:
        totalOrders > 0
          ? parseFloat(((item.count / totalOrders) * 100).toFixed(2))
          : 0,
    }));

    result.sort((a, b) => b.count - a.count);
    return result;
  }

  /**
   * 13. Top performing cities
   */
  async getLocationsTopCities(limit = 10) {
    const result = await Order.aggregate([
      {
        $match: {
          isArchived: { $ne: true },
          OrderStatus: { $nin: ['Cancelled', 'Returned'] },
        },
      },
      {
        $group: {
          _id: { city: '$City', state: '$State', country: '$Country' },
          totalRevenue: { $sum: { $toDouble: '$TotalAmount' } },
          ordersCount: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          city: '$_id.city',
          state: '$_id.state',
          country: '$_id.country',
          totalRevenue: { $round: ['$totalRevenue', 2] },
          ordersCount: 1,
        },
      },
    ]);

    return result;
  }

  /**
   * 14. Return rate analytics
   */
  async getReturnsRate() {
    const overallStats = await Order.aggregate([
      {
        $match: { isArchived: { $ne: true } },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          returnedOrders: {
            $sum: {
              $cond: [{ $eq: ['$OrderStatus', 'Returned'] }, 1, 0],
            },
          },
        },
      },
    ]);

    const stats = overallStats[0] || { totalOrders: 0, returnedOrders: 0 };
    const returnRate =
      stats.totalOrders > 0 ? (stats.returnedOrders / stats.totalOrders) * 100 : 0;

    const categoryStats = await Order.aggregate([
      {
        $match: { isArchived: { $ne: true } },
      },
      {
        $group: {
          _id: '$Category',
          totalOrders: { $sum: 1 },
          returnedOrders: {
            $sum: {
              $cond: [{ $eq: ['$OrderStatus', 'Returned'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalOrders: 1,
          returnedOrders: 1,
          returnRate: {
            $cond: [
              { $gt: ['$totalOrders', 0] },
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ['$returnedOrders', '$totalOrders'] },
                      100,
                    ],
                  },
                  2,
                ],
              },
              0,
            ],
          },
        },
      },
      { $sort: { returnRate: -1 } },
    ]);

    return {
      totalOrders: stats.totalOrders,
      returnedOrders: stats.returnedOrders,
      overallReturnRate: parseFloat(returnRate.toFixed(2)),
      byCategory: categoryStats,
    };
  }

  /**
   * 15. Discount usage analytics
   */
  async getDiscountsUsage() {
    const overallStats = await Order.aggregate([
      {
        $match: { isArchived: { $ne: true } },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          ordersWithDiscount: {
            $sum: {
              $cond: [{ $gt: [{ $toDouble: '$Discount' }, 0] }, 1, 0],
            },
          },
          totalDiscountAmount: { $sum: { $toDouble: '$Discount' } },
          averageDiscount: { $avg: { $toDouble: '$Discount' } },
        },
      },
    ]);

    const stats = overallStats[0] || {
      totalOrders: 0,
      ordersWithDiscount: 0,
      totalDiscountAmount: 0,
      averageDiscount: 0,
    };
    const discountPercentage =
      stats.totalOrders > 0
        ? (stats.ordersWithDiscount / stats.totalOrders) * 100
        : 0;

    const categoryDiscounts = await Order.aggregate([
      {
        $match: {
          isArchived: { $ne: true },
          $expr: { $gt: [{ $toDouble: '$Discount' }, 0] },
        },
      },
      {
        $group: {
          _id: '$Category',
          totalDiscountGiven: { $sum: { $toDouble: '$Discount' } },
          discountedOrdersCount: { $sum: 1 },
        },
      },
      { $sort: { totalDiscountGiven: -1 } },
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalDiscountGiven: { $round: ['$totalDiscountGiven', 2] },
          discountedOrdersCount: 1,
        },
      },
    ]);

    return {
      totalOrders: stats.totalOrders,
      ordersWithDiscount: stats.ordersWithDiscount,
      discountPercentage: parseFloat(discountPercentage.toFixed(2)),
      totalDiscountAmount: parseFloat(stats.totalDiscountAmount.toFixed(2)),
      averageDiscount: parseFloat(stats.averageDiscount.toFixed(2)),
      byCategory: categoryDiscounts,
    };
  }
}

export default new AnalyticsService();
