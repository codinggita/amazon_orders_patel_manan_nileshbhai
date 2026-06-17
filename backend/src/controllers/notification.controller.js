import notificationService from '../services/notification.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getNotifications(req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, result.data, 'Notifications retrieved successfully', result.pagination));
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const data = await notificationService.markAsRead(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Notification marked as read'));
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const data = await notificationService.deleteNotification(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Notification deleted successfully'));
});
