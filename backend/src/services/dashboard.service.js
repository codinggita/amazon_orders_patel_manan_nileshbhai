import analyticsService from './analytics.service.js';
import statsService from './stats.service.js';

class DashboardService {
  async getOverview() {
    const [revenue, ordersCount, avgValue, topProducts, topCustomers] = await Promise.all([
      analyticsService.getRevenueTotal(),
      analyticsService.getOrdersCount(),
      analyticsService.getOrdersAverageValue(),
      analyticsService.getProductsTopSelling(5),
      analyticsService.getCustomersTop(5),
    ]);

    return {
      revenue,
      orders: ordersCount,
      averageOrderValue: avgValue,
      topProducts,
      topCustomers,
      generatedAt: new Date().toISOString(),
    };
  }

  async getRevenueDashboard() {
    const [total, monthly, yearly, payments] = await Promise.all([
      analyticsService.getRevenueTotal(),
      analyticsService.getRevenueMonthly(),
      analyticsService.getRevenueYearly(),
      analyticsService.getPaymentsDistribution(),
    ]);

    return { total, monthly, yearly, payments };
  }

  async getOrdersDashboard() {
    const [count, cancelled, refunded, daily] = await Promise.all([
      analyticsService.getOrdersCount(),
      analyticsService.getOrdersCancelled(),
      analyticsService.getOrdersRefunded(),
      statsService.getOrdersDaily(),
    ]);

    return { count, cancelled, refunded, daily };
  }

  async getCustomersDashboard() {
    const topCustomers = await analyticsService.getCustomersTop(10);
    const customerCount = await statsService.getCustomersCount();

    return { totalCustomers: customerCount.totalCustomers, topCustomers };
  }

  async getProductsDashboard() {
    const [topSelling, lowSelling, categories, productCount] = await Promise.all([
      analyticsService.getProductsTopSelling(10),
      analyticsService.getProductsLowSelling(10),
      analyticsService.getCategoriesTop(10),
      statsService.getProductsCount(),
    ]);

    return {
      totalProducts: productCount.totalProducts,
      topSelling,
      lowSelling,
      topCategories: categories,
    };
  }
}

export default new DashboardService();
