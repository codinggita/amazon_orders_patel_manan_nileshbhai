import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';
import mongoose from 'mongoose';

/**
 * Order Service
 * Handles all business logic for order operations
 */

class OrderService {
  /**
   * Create a new order
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>} Created order
   */
  async createOrder(orderData) {
    try {
      // Validate TotalAmount calculation
      const unitPrice = parseFloat(orderData.UnitPrice);
      const quantity = parseInt(orderData.Quantity);
      const discount = parseFloat(orderData.Discount) || 0;
      const tax = parseFloat(orderData.Tax) || 0;
      const shippingCost = parseFloat(orderData.ShippingCost) || 0;

      const calculatedTotal = unitPrice * quantity - discount + tax + shippingCost;

      // Verify total matches (with tolerance for floating-point precision)
      const providedTotal = parseFloat(orderData.TotalAmount);
      if (Math.abs(calculatedTotal - providedTotal) > 0.01) {
        throw new ApiError(400, 'TotalAmount calculation mismatch');
      }

      const order = await Order.create(orderData);
      return order;
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new ApiError(400, `${field} already exists`);
      }
      throw error;
    }
  }

  /**
   * Get all orders with filtering, sorting, and pagination
   * @param {Object} query - Query parameters
   * @returns {Promise<Object>} Paginated orders
   */
  async getAllOrders(query = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = '-createdAt',
        search,
        CustomerName,
        ProductName,
        Category,
        Brand,
        OrderStatus,
        PaymentMethod,
        Country,
        State,
        City,
      } = query;

      // Build filter object
      const filter = { isArchived: false };

      // Regex search across multiple fields
      if (search) {
        filter.$or = [
          { CustomerName: { $regex: search, $options: 'i' } },
          { ProductName: { $regex: search, $options: 'i' } },
          { OrderID: { $regex: search, $options: 'i' } },
          { Brand: { $regex: search, $options: 'i' } },
        ];
      }

      // Add individual filters
      if (CustomerName) {
        filter.CustomerName = { $regex: CustomerName, $options: 'i' };
      }
      if (ProductName) {
        filter.ProductName = { $regex: ProductName, $options: 'i' };
      }
      if (Category) {
        filter.Category = { $regex: Category, $options: 'i' };
      }
      if (Brand) {
        filter.Brand = { $regex: Brand, $options: 'i' };
      }
      if (OrderStatus) {
        filter.OrderStatus = OrderStatus;
      }
      if (PaymentMethod) {
        filter.PaymentMethod = PaymentMethod;
      }
      if (Country) {
        filter.Country = { $regex: Country, $options: 'i' };
      }
      if (State) {
        filter.State = { $regex: State, $options: 'i' };
      }
      if (City) {
        filter.City = { $regex: City, $options: 'i' };
      }

      // Pagination options
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        lean: true,
      };

      const result = await Order.paginate(filter, options);
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
      throw new ApiError(500, 'Error fetching orders', error.message);
    }
  }

  /**
   * Get order by ID
   * @param {String} orderId - Order MongoDB ID
   * @returns {Promise<Object>} Order details
   */
  async getOrderById(orderId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, 'Invalid order ID format');
      }

      const order = await Order.findOne({
        _id: orderId,
        isArchived: false,
      });

      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      return order;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error fetching order', error.message);
    }
  }

  /**
   * Get order by OrderID (business ID)
   * @param {String} OrderID - Order business ID
   * @returns {Promise<Object>} Order details
   */
  async getOrderByOrderID(OrderID) {
    try {
      const order = await Order.findOne({
        OrderID,
        isArchived: false,
      });

      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      return order;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error fetching order', error.message);
    }
  }

  /**
   * Update complete order (PUT)
   * @param {String} orderId - Order MongoDB ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated order
   */
  async updateOrder(orderId, updateData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, 'Invalid order ID format');
      }

      // Prevent updating certain fields
      delete updateData._id;
      delete updateData.createdAt;

      const order = await Order.findOneAndUpdate(
        { _id: orderId, isArchived: false },
        updateData,
        { new: true, runValidators: true }
      );

      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      return order;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new ApiError(400, `${field} already exists`);
      }
      throw new ApiError(500, 'Error updating order', error.message);
    }
  }

  /**
   * Partial update order (PATCH)
   * @param {String} orderId - Order MongoDB ID
   * @param {Object} updateData - Partial update data
   * @returns {Promise<Object>} Updated order
   */
  async partialUpdateOrder(orderId, updateData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, 'Invalid order ID format');
      }

      // Prevent updating certain fields
      delete updateData._id;
      delete updateData.createdAt;

      const order = await Order.findOneAndUpdate(
        { _id: orderId, isArchived: false },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      return order;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new ApiError(400, `${field} already exists`);
      }
      throw new ApiError(500, 'Error updating order', error.message);
    }
  }

  /**
   * Delete order permanently
   * @param {String} orderId - Order MongoDB ID
   * @returns {Promise<void>}
   */
  async deleteOrder(orderId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, 'Invalid order ID format');
      }

      const result = await Order.deleteOne({
        _id: orderId,
        isArchived: false,
      });

      if (result.deletedCount === 0) {
        throw new ApiError(404, 'Order not found');
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error deleting order', error.message);
    }
  }

  /**
   * Check if order exists
   * @param {String} orderId - Order MongoDB ID
   * @returns {Promise<Boolean>}
   */
  async checkOrderExists(orderId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return false;
      }

      const exists = await Order.findOne({
        _id: orderId,
        isArchived: false,
      }).lean();

      return !!exists;
    } catch (error) {
      throw new ApiError(500, 'Error checking order existence', error.message);
    }
  }

  /**
   * Get order summary (minimal data)
   * @param {String} orderId - Order MongoDB ID
   * @returns {Promise<Object>} Order summary
   */
  async getOrderSummary(orderId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, 'Invalid order ID format');
      }

      const order = await Order.findOne(
        { _id: orderId, isArchived: false },
        'OrderID CustomerName ProductName TotalAmount OrderStatus OrderDate'
      ).lean();

      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      return order;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error fetching order summary', error.message);
    }
  }

  /**
   * Get order items (product details)
   * @param {String} orderId - Order MongoDB ID
   * @returns {Promise<Object>} Order item details
   */
  async getOrderItems(orderId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, 'Invalid order ID format');
      }

      const order = await Order.findOne(
        { _id: orderId, isArchived: false },
        'ProductID ProductName Brand Category Quantity UnitPrice Discount Tax ShippingCost TotalAmount'
      ).lean();

      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      return {
        ProductID: order.ProductID,
        ProductName: order.ProductName,
        Brand: order.Brand,
        Category: order.Category,
        Quantity: order.Quantity,
        UnitPrice: order.UnitPrice,
        Discount: order.Discount,
        Tax: order.Tax,
        ShippingCost: order.ShippingCost,
        TotalAmount: order.TotalAmount,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error fetching order items', error.message);
    }
  }

  /**
   * Get order status history
   * @param {String} orderId - Order MongoDB ID
   * @returns {Promise<Array>} Status history
   */
  async getOrderHistory(orderId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, 'Invalid order ID format');
      }

      const order = await Order.findOne(
        { _id: orderId, isArchived: false },
        'statusHistory'
      ).lean();

      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      return order.statusHistory || [];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error fetching order history', error.message);
    }
  }

  /**
   * Update order status and track history
   * @param {String} orderId - Order MongoDB ID
   * @param {String} newStatus - New status
   * @param {String} reason - Status change reason
   * @returns {Promise<Object>} Updated order
   */
  async updateOrderStatus(orderId, newStatus, reason = '') {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, 'Invalid order ID format');
      }

      const order = await Order.findOneAndUpdate(
        { _id: orderId, isArchived: false },
        {
          $set: { OrderStatus: newStatus },
          $push: {
            statusHistory: {
              status: newStatus,
              changedAt: new Date(),
              reason,
            },
          },
        },
        { new: true, runValidators: true }
      );

      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      return order;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating order status', error.message);
    }
  }

  /**
   * Archive order (soft delete)
   * @param {String} orderId - Order MongoDB ID
   * @returns {Promise<Object>} Archived order
   */
  async archiveOrder(orderId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, 'Invalid order ID format');
      }

      const order = await Order.findOneAndUpdate(
        { _id: orderId, isArchived: false },
        { $set: { isArchived: true } },
        { new: true }
      );

      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      return order;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error archiving order', error.message);
    }
  }

  /**
   * Restore archived order
   * @param {String} orderId - Order MongoDB ID
   * @returns {Promise<Object>} Restored order
   */
  async restoreOrder(orderId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, 'Invalid order ID format');
      }

      const order = await Order.findOneAndUpdate(
        { _id: orderId, isArchived: true },
        { $set: { isArchived: false } },
        { new: true }
      );

      if (!order) {
        throw new ApiError(404, 'Archived order not found');
      }

      return order;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error restoring order', error.message);
    }
  }

  /**
   * Cancel order
   * @param {String} orderId - Order MongoDB ID
   * @param {String} reason - Cancellation reason
   * @returns {Promise<Object>} Cancelled order
   */
  async cancelOrder(orderId, reason = 'Cancelled by customer') {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, 'Invalid order ID format');
      }

      const order = await Order.findOne({
        _id: orderId,
        isArchived: false,
      });

      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      // Check if order can be cancelled
      const nonCancellableStatuses = ['Delivered', 'Cancelled', 'Returned'];
      if (nonCancellableStatuses.includes(order.OrderStatus)) {
        throw new ApiError(400, `Cannot cancel order with status: ${order.OrderStatus}`);
      }

      return await this.updateOrderStatus(orderId, 'Cancelled', reason);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error cancelling order', error.message);
    }
  }

  /**
   * Duplicate order
   * @param {String} orderId - Order MongoDB ID
   * @returns {Promise<Object>} Duplicated order
   */
  async duplicateOrder(orderId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, 'Invalid order ID format');
      }

      const originalOrder = await Order.findOne({
        _id: orderId,
        isArchived: false,
      }).lean();

      if (!originalOrder) {
        throw new ApiError(404, 'Order not found');
      }

      // Create new order without _id and timestamps
      const newOrderData = { ...originalOrder };
      delete newOrderData._id;
      delete newOrderData.createdAt;
      delete newOrderData.updatedAt;

      // Generate new OrderID
      const lastOrder = await Order.findOne()
        .sort({ _id: -1 })
        .lean();
      const lastNumber = parseInt(lastOrder?.OrderID?.replace('ORD', '') || '0');
      newOrderData.OrderID = `ORD${String(lastNumber + 1).padStart(7, '0')}`;

      // Reset status to Pending
      newOrderData.OrderStatus = 'Pending';
      newOrderData.OrderDate = new Date();
      newOrderData.statusHistory = [];

      const duplicatedOrder = await Order.create(newOrderData);
      return duplicatedOrder;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error duplicating order', error.message);
    }
  }

  /**
   * Generate invoice data
   * @param {String} orderId - Order MongoDB ID
   * @returns {Promise<Object>} Invoice data
   */
  async generateInvoice(orderId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, 'Invalid order ID format');
      }

      const order = await Order.findOne({
        _id: orderId,
        isArchived: false,
      }).lean();

      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      const invoice = {
        invoiceNumber: order.OrderID,
        invoiceDate: new Date().toISOString().split('T')[0],
        orderDate: order.OrderDate,
        
        // Customer Details
        customer: {
          id: order.CustomerID,
          name: order.CustomerName,
        },
        
        // Seller Details
        seller: {
          id: order.SellerID,
        },
        
        // Shipping Address
        shippingAddress: {
          city: order.City,
          state: order.State,
          country: order.Country,
        },
        
        // Order Items
        items: [
          {
            productId: order.ProductID,
            productName: order.ProductName,
            category: order.Category,
            brand: order.Brand,
            quantity: order.Quantity,
            unitPrice: parseFloat(order.UnitPrice),
            subtotal: order.Quantity * parseFloat(order.UnitPrice),
          },
        ],
        
        // Totals
        subtotal: order.Quantity * parseFloat(order.UnitPrice),
        discount: parseFloat(order.Discount),
        tax: parseFloat(order.Tax),
        shippingCost: parseFloat(order.ShippingCost),
        total: parseFloat(order.TotalAmount),
        
        // Payment & Status
        paymentMethod: order.PaymentMethod,
        orderStatus: order.OrderStatus,
      };

      return invoice;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error generating invoice', error.message);
    }
  }
}

export default new OrderService();
