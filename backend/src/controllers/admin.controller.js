import adminService from '../services/admin.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Fetch all users
 * @route GET /api/v1/admin/users
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const result = await adminService.getAllUsers(req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, result.data, 'Users fetched successfully', result.pagination));
});

/**
 * Fetch specific user
 * @route GET /api/v1/admin/users/:id
 */
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await adminService.getUserById(id);
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User details fetched successfully'));
});

/**
 * Ban user
 * @route PATCH /api/v1/admin/users/:id/ban
 */
const banUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await adminService.banUser(id);
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User account banned successfully'));
});

/**
 * Unban user
 * @route PATCH /api/v1/admin/users/:id/unban
 */
const unbanUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await adminService.unbanUser(id);
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User account unbanned successfully'));
});

/**
 * Change user role
 * @route PATCH /api/v1/admin/users/:id/role
 */
const changeUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = await adminService.changeUserRole(id, role);
  return res
    .status(200)
    .json(new ApiResponse(200, user, `User role changed to ${role} successfully`));
});

/**
 * Fetch all orders
 * @route GET /api/v1/admin/orders
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const result = await adminService.getAllOrders(req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, result.data, 'Orders fetched successfully', result.pagination));
});

/**
 * Fetch sales reports
 * @route GET /api/v1/admin/reports/sales
 */
const getSalesReport = asyncHandler(async (req, res) => {
  const salesReport = await adminService.getSalesReport();
  return res
    .status(200)
    .json(new ApiResponse(200, salesReport, 'Sales report compiled successfully'));
});

/**
 * Fetch revenue reports
 * @route GET /api/v1/admin/reports/revenue
 */
const getRevenueReport = asyncHandler(async (req, res) => {
  const revenueReport = await adminService.getRevenueReport();
  return res
    .status(200)
    .json(new ApiResponse(200, revenueReport, 'Revenue report compiled successfully'));
});

/**
 * Clear application cache
 * @route DELETE /api/v1/admin/cache/clear
 */
const clearCache = asyncHandler(async (req, res) => {
  const result = await adminService.clearCache();
  return res
    .status(200)
    .json(new ApiResponse(200, result, result.message));
});

/**
 * System health monitoring
 * @route GET /api/v1/admin/system/health
 */
const getSystemHealth = asyncHandler(async (req, res) => {
  const health = await adminService.getSystemHealth();
  return res
    .status(200)
    .json(new ApiResponse(200, health, 'System health report compiled successfully'));
});

/**
 * Fetch server logs
 * @route GET /api/v1/admin/system/logs
 */
const getSystemLogs = asyncHandler(async (req, res) => {
  const logs = await adminService.getSystemLogs();
  return res
    .status(200)
    .json(new ApiResponse(200, logs, 'Server logs retrieved successfully'));
});

/**
 * Enable/Disable maintenance mode
 * @route POST /api/v1/admin/system/maintenance
 */
const setMaintenanceMode = asyncHandler(async (req, res) => {
  const { enabled } = req.body;
  const result = await adminService.setMaintenanceMode(enabled);
  return res
    .status(200)
    .json(new ApiResponse(200, result, result.message));
});

/**
 * Fetch backups list
 * @route GET /api/v1/admin/backups
 */
const getBackups = asyncHandler(async (req, res) => {
  const backups = await adminService.getBackups();
  return res
    .status(200)
    .json(new ApiResponse(200, backups, 'Backups list retrieved successfully'));
});

export {
  getAllUsers,
  getUserById,
  banUser,
  unbanUser,
  changeUserRole,
  getAllOrders,
  getSalesReport,
  getRevenueReport,
  clearCache,
  getSystemHealth,
  getSystemLogs,
  setMaintenanceMode,
  getBackups,
};
