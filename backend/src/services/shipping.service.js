import Order from '../models/Order.js';
import orderService from './order.service.js';
import ApiError from '../utils/ApiError.js';
import mongoose from 'mongoose';

/**
 * Shipping Service
 * Handles business logic for shipping & delivery operations
 */
class ShippingService {
  /**
   * Track shipment
   * @param {String} orderId - Order MongoDB ID
   */
  async trackShipment(orderId) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ApiError(400, 'Invalid order ID format');
    }

    const order = await Order.findOne({ _id: orderId, isArchived: { $ne: true } });
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // Mock tracking details using order data
    const trackingSuffix = order.OrderID.replace('ORD', '');
    return {
      orderId: order._id,
      orderStatus: order.OrderStatus,
      trackingNumber: `TRK${trackingSuffix}US`,
      carrier: 'DHL Express',
      estimatedDelivery: new Date(order.OrderDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      history: order.statusHistory || [],
    };
  }

  /**
   * Update shipping status
   * @param {String} orderId - Order MongoDB ID
   * @param {String} status - New status
   * @param {String} reason - Reason for status change
   */
  async updateShippingStatus(orderId, status, reason = '') {
    // Reuses standard order status update logic
    return await orderService.updateOrderStatus(orderId, status, reason || 'Shipping status updated');
  }

  /**
   * Fetch pending shipments (Pending status)
   * @param {Object} query - Pagination parameters
   */
  async getPendingShipments(query = {}) {
    const { page = 1, limit = 10 } = query;
    try {
      const result = await Order.paginate(
        { OrderStatus: 'Pending', isArchived: { $ne: true } },
        { page: parseInt(page), limit: parseInt(limit), lean: true }
      );
      
      return {
        success: true,
        data: result.docs,
        pagination: {
          totalRecords: result.totalDocs,
          totalPages: result.totalPages,
          currentPage: result.page,
          limit: result.limit,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
        },
      };
    } catch (error) {
      throw new ApiError(500, 'Error fetching pending shipments', error.message);
    }
  }

  /**
   * Fetch delivered shipments (Delivered status)
   * @param {Object} query - Pagination parameters
   */
  async getDeliveredShipments(query = {}) {
    const { page = 1, limit = 10 } = query;
    try {
      const result = await Order.paginate(
        { OrderStatus: 'Delivered', isArchived: { $ne: true } },
        { page: parseInt(page), limit: parseInt(limit), lean: true }
      );
      
      return {
        success: true,
        data: result.docs,
        pagination: {
          totalRecords: result.totalDocs,
          totalPages: result.totalPages,
          currentPage: result.page,
          limit: result.limit,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
        },
      };
    } catch (error) {
      throw new ApiError(500, 'Error fetching delivered shipments', error.message);
    }
  }

  /**
   * Fetch returned shipments (Returned status)
   * @param {Object} query - Pagination parameters
   */
  async getReturnedShipments(query = {}) {
    const { page = 1, limit = 10 } = query;
    try {
      const result = await Order.paginate(
        { OrderStatus: 'Returned', isArchived: { $ne: true } },
        { page: parseInt(page), limit: parseInt(limit), lean: true }
      );
      
      return {
        success: true,
        data: result.docs,
        pagination: {
          totalRecords: result.totalDocs,
          totalPages: result.totalPages,
          currentPage: result.page,
          limit: result.limit,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
        },
      };
    } catch (error) {
      throw new ApiError(500, 'Error fetching returned shipments', error.message);
    }
  }

  /**
   * Create shipping label
   * @param {String} orderId - Order MongoDB ID
   * @param {String} carrier - Carrier name
   * @param {String} serviceType - Service type
   */
  async createShippingLabel(orderId, carrier = 'FedEx', serviceType = 'Standard') {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ApiError(400, 'Invalid order ID format');
    }

    const order = await Order.findOne({ _id: orderId, isArchived: { $ne: true } });
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    if (['Cancelled', 'Returned'].includes(order.OrderStatus)) {
      throw new ApiError(400, `Cannot create shipping label for an order with status: ${order.OrderStatus}`);
    }

    const trackingSuffix = order.OrderID.replace('ORD', '');
    return {
      orderId: order._id,
      labelId: `LBL-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      trackingNumber: `TRK${trackingSuffix}US`,
      carrier,
      serviceType,
      labelUrl: `https://shipping-provider.com/labels/LBL-${order.OrderID}.pdf`,
    };
  }

  /**
   * Estimate delivery date
   * @param {String} orderId - Order MongoDB ID
   */
  async estimateDeliveryDate(orderId) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ApiError(400, 'Invalid order ID format');
    }

    const order = await Order.findOne({ _id: orderId, isArchived: { $ne: true } });
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    const estimatedDate = new Date(order.OrderDate);
    estimatedDate.setDate(estimatedDate.getDate() + 5);

    return {
      orderId: order._id,
      estimatedDeliveryDate: estimatedDate.toISOString(),
      transitDays: 5,
      shippingAddress: {
        city: order.City,
        state: order.State,
        country: order.Country,
      },
    };
  }

  /**
   * Get active shipping carriers
   */
  async getCarriers() {
    return [
      { id: 'dhl', name: 'DHL Express', status: 'active' },
      { id: 'fedex', name: 'FedEx', status: 'active' },
      { id: 'ups', name: 'UPS', status: 'active' },
      { id: 'usps', name: 'USPS', status: 'active' },
    ];
  }

  /**
   * Change shipping address
   * @param {String} orderId - Order MongoDB ID
   * @param {Object} addressData - Address update details
   */
  async changeAddress(orderId, addressData) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ApiError(400, 'Invalid order ID format');
    }

    const order = await Order.findOne({ _id: orderId, isArchived: { $ne: true } });
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // Check if change is allowed based on status
    const nonChangeable = ['Shipped', 'Delivered', 'Cancelled', 'Returned'];
    if (nonChangeable.includes(order.OrderStatus)) {
      throw new ApiError(400, `Cannot change address once order is ${order.OrderStatus}`);
    }

    const updateFields = {};
    if (addressData.City) updateFields.City = addressData.City;
    if (addressData.State) updateFields.State = addressData.State;
    if (addressData.Country) updateFields.Country = addressData.Country;

    const changeDetailString = Object.keys(updateFields)
      .map((k) => `${k}: ${order[k]} -> ${updateFields[k]}`)
      .join(', ');

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, isArchived: { $ne: true } },
      {
        $set: updateFields,
        $push: {
          statusHistory: {
            status: order.OrderStatus,
            changedAt: new Date(),
            reason: `Shipping address updated: ${changeDetailString}`,
          },
        },
      },
      { new: true, runValidators: true }
    );

    return updatedOrder;
  }

  /**
   * Reschedule delivery
   * @param {String} orderId - Order MongoDB ID
   * @param {String} newDeliveryDate - ISO date string
   */
  async rescheduleDelivery(orderId, newDeliveryDate) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ApiError(400, 'Invalid order ID format');
    }

    const order = await Order.findOne({ _id: orderId, isArchived: { $ne: true } });
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // Ensure order is not delivered, cancelled or returned
    if (['Delivered', 'Cancelled', 'Returned'].includes(order.OrderStatus)) {
      throw new ApiError(400, `Cannot reschedule delivery for an order with status: ${order.OrderStatus}`);
    }

    return {
      orderId: order._id,
      status: 'Rescheduled',
      rescheduledDate: newDeliveryDate,
      message: 'Delivery rescheduled successfully',
    };
  }
}

export default new ShippingService();
