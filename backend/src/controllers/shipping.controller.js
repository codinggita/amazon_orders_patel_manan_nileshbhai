import shippingService from '../services/shipping.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Track shipment
 * @route GET /api/v1/shipping/tracking/:orderId
 */
const trackShipment = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const trackingData = await shippingService.trackShipment(orderId);
  return res
    .status(200)
    .json(new ApiResponse(200, trackingData, 'Shipment tracking information fetched successfully'));
});

/**
 * Update shipping status
 * @route PATCH /api/v1/shipping/update-status/:orderId
 */
const updateShippingStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status, reason } = req.body;
  const updatedOrder = await shippingService.updateShippingStatus(orderId, status, reason);
  return res
    .status(200)
    .json(new ApiResponse(200, updatedOrder, 'Shipping status updated successfully'));
});

/**
 * Fetch pending shipments
 * @route GET /api/v1/shipping/pending
 */
const getPendingShipments = asyncHandler(async (req, res) => {
  const result = await shippingService.getPendingShipments(req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, result.data, 'Pending shipments fetched successfully', result.pagination));
});

/**
 * Fetch delivered shipments
 * @route GET /api/v1/shipping/delivered
 */
const getDeliveredShipments = asyncHandler(async (req, res) => {
  const result = await shippingService.getDeliveredShipments(req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, result.data, 'Delivered shipments fetched successfully', result.pagination));
});

/**
 * Fetch returned shipments
 * @route GET /api/v1/shipping/returned
 */
const getReturnedShipments = asyncHandler(async (req, res) => {
  const result = await shippingService.getReturnedShipments(req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, result.data, 'Returned shipments fetched successfully', result.pagination));
});

/**
 * Create shipping label
 * @route POST /api/v1/shipping/create-label
 */
const createShippingLabel = asyncHandler(async (req, res) => {
  const { orderId, carrier, serviceType } = req.body;
  const labelData = await shippingService.createShippingLabel(orderId, carrier, serviceType);
  return res
    .status(201)
    .json(new ApiResponse(201, labelData, 'Shipping label created successfully'));
});

/**
 * Estimate delivery date
 * @route GET /api/v1/shipping/estimate/:orderId
 */
const estimateDeliveryDate = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const estimateData = await shippingService.estimateDeliveryDate(orderId);
  return res
    .status(200)
    .json(new ApiResponse(200, estimateData, 'Delivery date estimated successfully'));
});

/**
 * Fetch shipping carriers
 * @route GET /api/v1/shipping/carriers
 */
const getCarriers = asyncHandler(async (req, res) => {
  const carriers = await shippingService.getCarriers();
  return res
    .status(200)
    .json(new ApiResponse(200, carriers, 'Shipping carriers fetched successfully'));
});

/**
 * Change shipping address
 * @route PATCH /api/v1/shipping/change-address/:orderId
 */
const changeAddress = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const addressData = req.body;
  const updatedOrder = await shippingService.changeAddress(orderId, addressData);
  return res
    .status(200)
    .json(new ApiResponse(200, updatedOrder, 'Shipping address updated successfully'));
});

/**
 * Reschedule delivery
 * @route POST /api/v1/shipping/reschedule/:orderId
 */
const rescheduleDelivery = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { newDeliveryDate } = req.body;
  const rescheduleData = await shippingService.rescheduleDelivery(orderId, newDeliveryDate);
  return res
    .status(200)
    .json(new ApiResponse(200, rescheduleData, 'Delivery rescheduled successfully'));
});

export {
  trackShipment,
  updateShippingStatus,
  getPendingShipments,
  getDeliveredShipments,
  getReturnedShipments,
  createShippingLabel,
  estimateDeliveryDate,
  getCarriers,
  changeAddress,
  rescheduleDelivery,
};
