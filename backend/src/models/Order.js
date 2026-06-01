import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const orderSchema = new mongoose.Schema(
  {
    // Identifiers
    OrderID: {
      type: String,
      required: [true, 'OrderID is required'],
      unique: true,
      trim: true,
      match: [/^ORD\d{7}$/, 'OrderID must follow format: ORD0000001'],
      index: true,
    },

    // Customer Information
    CustomerID: {
      type: String,
      required: [true, 'CustomerID is required'],
      match: [/^CUST\d{6}$/, 'CustomerID must follow format: CUST000001'],
      index: true,
    },
    CustomerName: {
      type: String,
      required: [true, 'CustomerName is required'],
      trim: true,
      minlength: [2, 'CustomerName must be at least 2 characters'],
      maxlength: [100, 'CustomerName cannot exceed 100 characters'],
    },

    // Product Information
    ProductID: {
      type: String,
      required: [true, 'ProductID is required'],
      match: [/^P\d{5}$/, 'ProductID must follow format: P00001'],
      index: true,
    },
    ProductName: {
      type: String,
      required: [true, 'ProductName is required'],
      trim: true,
      maxlength: [200, 'ProductName cannot exceed 200 characters'],
    },
    Category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    Brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      maxlength: [100, 'Brand cannot exceed 100 characters'],
    },

    // Order Quantities
    Quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be an integer',
      },
    },

    // Pricing (using Decimal128 for financial accuracy)
    UnitPrice: {
      type: mongoose.Decimal128,
      required: [true, 'UnitPrice is required'],
      min: [0, 'UnitPrice cannot be negative'],
      get: (value) => value ? value.toString() : null,
    },
    Discount: {
      type: mongoose.Decimal128,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      get: (value) => value ? value.toString() : '0',
    },
    Tax: {
      type: mongoose.Decimal128,
      default: 0,
      min: [0, 'Tax cannot be negative'],
      get: (value) => value ? value.toString() : '0',
    },
    ShippingCost: {
      type: mongoose.Decimal128,
      default: 0,
      min: [0, 'ShippingCost cannot be negative'],
      get: (value) => value ? value.toString() : '0',
    },
    TotalAmount: {
      type: mongoose.Decimal128,
      required: [true, 'TotalAmount is required'],
      min: [0, 'TotalAmount cannot be negative'],
      get: (value) => value ? value.toString() : null,
    },

    // Order Details
    OrderDate: {
      type: Date,
      required: [true, 'OrderDate is required'],
      index: true,
    },
    PaymentMethod: {
      type: String,
      required: [true, 'PaymentMethod is required'],
      enum: {
        values: ['Credit Card', 'Debit Card', 'UPI', 'COD', 'Net Banking'],
        message: 'PaymentMethod must be one of: Credit Card, Debit Card, UPI, COD, Net Banking',
      },
      index: true,
    },
    OrderStatus: {
      type: String,
      required: [true, 'OrderStatus is required'],
      enum: {
        values: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
        message: 'OrderStatus must be one of: Pending, Processing, Shipped, Delivered, Cancelled, Returned',
      },
      default: 'Pending',
      index: true,
    },

    // Shipping Information
    City: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [100, 'City cannot exceed 100 characters'],
    },
    State: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      maxlength: [100, 'State cannot exceed 100 characters'],
      index: true,
    },
    Country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      maxlength: [100, 'Country cannot exceed 100 characters'],
      index: true,
    },

    // Seller Information
    SellerID: {
      type: String,
      required: [true, 'SellerID is required'],
      match: [/^SELL\d{5}$/, 'SellerID must follow format: SELL00001'],
      index: true,
    },

    // Status History (for audit trail)
    statusHistory: [
      {
        status: String,
        changedAt: {
          type: Date,
          default: Date.now,
        },
        reason: String,
      },
    ],

    // Archive flag for soft delete
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// Enable pagination plugin
orderSchema.plugin(mongoosePaginate);

// Compound indexes for efficient querying
orderSchema.index({ CustomerID: 1, OrderDate: -1 });
orderSchema.index({ ProductID: 1, OrderStatus: 1 });
orderSchema.index({ OrderStatus: 1, OrderDate: -1 });
orderSchema.index({ Country: 1, State: 1, City: 1 });
orderSchema.index({ isArchived: 1, createdAt: -1 });

// Pre-save hook to initialize status history
orderSchema.pre('save', function () {
  if (this.isNew) {
    this.statusHistory = [
      {
        status: this.OrderStatus,
        changedAt: new Date(),
        reason: 'Order created',
      },
    ];
  }
});

const Order = mongoose.model('Order', orderSchema, 'e-commerce');

export default Order;
