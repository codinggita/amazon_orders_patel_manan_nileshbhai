import { Router } from 'express';
import * as shippingController from '../controllers/shipping.controller.js';
import {
  validateOrderId,
  validateUpdateStatus,
  validateShippingPagination,
  validateCreateLabel,
  validateChangeAddress,
  validateReschedule,
  handleValidationErrors,
} from '../validations/shipping.validation.js';

const router = Router();

/**
 * Shipping & Delivery Routes
 * Base path: /api/v1/shipping
 */

// Track shipment
router.get(
  '/tracking/:orderId',
  validateOrderId,
  handleValidationErrors,
  shippingController.trackShipment
);

// Update shipping status
router.patch(
  '/update-status/:orderId',
  validateUpdateStatus,
  handleValidationErrors,
  shippingController.updateShippingStatus
);

// Fetch pending shipments
router.get(
  '/pending',
  validateShippingPagination,
  handleValidationErrors,
  shippingController.getPendingShipments
);

// Fetch delivered shipments
router.get(
  '/delivered',
  validateShippingPagination,
  handleValidationErrors,
  shippingController.getDeliveredShipments
);

// Fetch returned shipments
router.get(
  '/returned',
  validateShippingPagination,
  handleValidationErrors,
  shippingController.getReturnedShipments
);

// Create shipping label
router.post(
  '/create-label',
  validateCreateLabel,
  handleValidationErrors,
  shippingController.createShippingLabel
);

// Estimate delivery date
router.get(
  '/estimate/:orderId',
  validateOrderId,
  handleValidationErrors,
  shippingController.estimateDeliveryDate
);

// Fetch shipping carriers
router.get(
  '/carriers',
  shippingController.getCarriers
);

// Change shipping address
router.patch(
  '/change-address/:orderId',
  validateChangeAddress,
  handleValidationErrors,
  shippingController.changeAddress
);

// Reschedule delivery
router.post(
  '/reschedule/:orderId',
  validateReschedule,
  handleValidationErrors,
  shippingController.rescheduleDelivery
);

export default router;
