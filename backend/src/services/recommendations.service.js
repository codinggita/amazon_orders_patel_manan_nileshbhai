import Order from '../models/Order.js';
import analyticsService from './analytics.service.js';
import ApiError from '../utils/ApiError.js';

class RecommendationsService {
  /**
   * Recommend products for a customer based on purchase history
   */
  async getProductRecommendations(customerId, limit = 10) {
    if (!/^CUST\d{6}$/.test(customerId)) {
      throw new ApiError(400, 'CustomerID must follow format: CUST000001');
    }

    const customerOrders = await Order.find({
      CustomerID: customerId,
      isArchived: { $ne: true },
      OrderStatus: { $nin: ['Cancelled', 'Returned'] },
    })
      .select('Category Brand ProductID ProductName')
      .lean();

    if (!customerOrders.length) {
      const trending = await analyticsService.getProductsTopSelling(limit);
      return {
        customerId,
        strategy: 'popular-fallback',
        recommendations: trending,
      };
    }

    const categories = [...new Set(customerOrders.map((o) => o.Category))];
    const brands = [...new Set(customerOrders.map((o) => o.Brand))];
    const purchasedProductIds = customerOrders.map((o) => o.ProductID);

    const recommendations = await Order.aggregate([
      {
        $match: {
          isArchived: { $ne: true },
          OrderStatus: { $nin: ['Cancelled', 'Returned'] },
          ProductID: { $nin: purchasedProductIds },
          $or: [{ Category: { $in: categories } }, { Brand: { $in: brands } }],
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
          relevanceScore: {
            $sum: {
              $add: [
                { $cond: [{ $in: ['$Category', categories] }, 2, 0] },
                { $cond: [{ $in: ['$Brand', brands] }, 1, 0] },
              ],
            },
          },
        },
      },
      { $sort: { relevanceScore: -1, totalQuantitySold: -1 } },
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
          relevanceScore: 1,
        },
      },
    ]);

    return {
      customerId,
      strategy: 'purchase-history',
      basedOn: { categories, brands },
      recommendations,
    };
  }

  /**
   * Recommend similar products for an order
   */
  async getOrderRecommendations(orderId, limit = 10) {
    const order = await Order.findOne({ OrderID: orderId, isArchived: { $ne: true } }).lean();
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    const recommendations = await Order.aggregate([
      {
        $match: {
          isArchived: { $ne: true },
          OrderStatus: { $nin: ['Cancelled', 'Returned'] },
          ProductID: { $ne: order.ProductID },
          $or: [
            { Category: order.Category },
            { Brand: order.Brand },
          ],
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
          similarityScore: {
            $sum: {
              $add: [
                { $cond: [{ $eq: ['$Category', order.Category] }, 3, 0] },
                { $cond: [{ $eq: ['$Brand', order.Brand] }, 2, 0] },
              ],
            },
          },
        },
      },
      { $sort: { similarityScore: -1, totalQuantitySold: -1 } },
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
          similarityScore: 1,
        },
      },
    ]);

    return {
      orderId,
      sourceProduct: {
        productId: order.ProductID,
        productName: order.ProductName,
        category: order.Category,
        brand: order.Brand,
      },
      recommendations,
    };
  }
}

export default new RecommendationsService();
