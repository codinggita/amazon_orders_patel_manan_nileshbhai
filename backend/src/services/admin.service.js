import User from '../models/User.js';
import Session from '../models/Session.js';
import orderService from './order.service.js';
import statsService from './stats.service.js';
import ApiError from '../utils/ApiError.js';
import mongoose from 'mongoose';

/**
 * Admin Service
 * Handles business logic for administrator dashboards and operations
 */
class AdminService {
  /**
   * Fetch all users (paginated)
   */
  async getAllUsers(query = {}) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    try {
      const users = await User.find()
        .select('-password')
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const totalRecords = await User.countDocuments();
      const totalPages = Math.ceil(totalRecords / limit);

      return {
        data: users,
        pagination: {
          totalRecords,
          totalPages,
          currentPage: parseInt(page),
          limit: parseInt(limit),
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
        },
      };
    } catch (error) {
      throw new ApiError(500, 'Error fetching users', error.message);
    }
  }

  /**
   * Fetch a specific user by ID
   */
  async getUserById(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, 'Invalid User ID format');
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  /**
   * Ban a user (sets isBanned and terminates all active sessions)
   */
  async banUser(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, 'Invalid User ID format');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    user.isBanned = true;
    await user.save();

    // Terminate all active sessions for this user to kick them out immediately
    await Session.deleteMany({ userId });

    const userResponse = user.toObject();
    delete userResponse.password;
    return userResponse;
  }

  /**
   * Unban a user
   */
  async unbanUser(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, 'Invalid User ID format');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    user.isBanned = false;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    return userResponse;
  }

  /**
   * Change user role (user or admin)
   */
  async changeUserRole(userId, role) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, 'Invalid User ID format');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    user.role = role;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    return userResponse;
  }

  /**
   * Fetch all orders (reusing orderService pagination)
   */
  async getAllOrders(query = {}) {
    return await orderService.getAllOrders(query);
  }

  /**
   * Fetch sales reports (reusing StatsService aggregates)
   */
  async getSalesReport() {
    try {
      const total = await statsService.getOrdersTotal();
      const daily = await statsService.getOrdersDaily();
      const monthly = await statsService.getOrdersMonthly();
      const yearly = await statsService.getOrdersYearly();

      return {
        totalOrders: total.totalOrders,
        dailyStats: daily,
        monthlyStats: monthly,
        yearlyStats: yearly,
      };
    } catch (error) {
      throw new ApiError(500, 'Error compiling sales report', error.message);
    }
  }

  /**
   * Fetch revenue reports (reusing StatsService aggregates)
   */
  async getRevenueReport() {
    try {
      const total = await statsService.getRevenueTotal();
      const daily = await statsService.getRevenueDaily();
      const monthly = await statsService.getRevenueMonthly();
      const yearly = await statsService.getRevenueYearly();

      return {
        totalRevenue: total.totalRevenue,
        dailyStats: daily,
        monthlyStats: monthly,
        yearlyStats: yearly,
      };
    } catch (error) {
      throw new ApiError(500, 'Error compiling revenue report', error.message);
    }
  }

  /**
   * Clear cache (mock function)
   */
  async clearCache() {
    return {
      message: 'Application cache cleared successfully',
      keysCleared: 0,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * System health monitoring (reusing StatsService system stats)
   */
  async getSystemHealth() {
    try {
      return await statsService.getSystemPerformance();
    } catch (error) {
      throw new ApiError(500, 'Error checking system health', error.message);
    }
  }

  /**
   * Fetch server logs (mock function)
   */
  async getSystemLogs() {
    return [
      {
        timestamp: new Date(Date.now() - 50000).toISOString(),
        level: 'info',
        message: 'Admin system server online and listening.',
      },
      {
        timestamp: new Date(Date.now() - 40000).toISOString(),
        level: 'info',
        message: 'Database check performed. Status: healthy.',
      },
      {
        timestamp: new Date(Date.now() - 30000).toISOString(),
        level: 'warn',
        message: 'High traffic rate-limiter check initiated.',
      },
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'Fetch server logs request completed successfully.',
      },
    ];
  }

  /**
   * Enable/Disable maintenance mode (mock function)
   */
  async setMaintenanceMode(enabled) {
    return {
      maintenanceMode: enabled,
      updatedAt: new Date().toISOString(),
      message: enabled
        ? 'Maintenance mode enabled successfully. Users will see server offline message.'
        : 'Maintenance mode disabled successfully. Server is back online.',
    };
  }

  /**
   * Fetch backups list (mock function)
   */
  async getBackups() {
    return [
      {
        backupId: 'backup_2026_05_27_01',
        filename: 'db_dump_2026_05_27.tar.gz',
        size: '2.54 GB',
        status: 'completed',
        createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
      },
      {
        backupId: 'backup_2026_05_26_01',
        filename: 'db_dump_2026_05_26.tar.gz',
        size: '2.51 GB',
        status: 'completed',
        createdAt: new Date(Date.now() - 36 * 3600000).toISOString(),
      },
      {
        backupId: 'backup_2026_05_25_01',
        filename: 'db_dump_2026_05_25.tar.gz',
        size: '2.49 GB',
        status: 'completed',
        createdAt: new Date(Date.now() - 60 * 3600000).toISOString(),
      },
    ];
  }
}

export default new AdminService();
