import mongoose from 'mongoose';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';
import { ORDER_STATUSES } from '../validations/filter.validation.js';

const STATUS_ALIASES = {
  refunded: 'Returned',
  refund: 'Returned',
  canceled: 'Cancelled',
  cancel: 'Cancelled',
};

/**
 * Filter Service
 * Handles all filter operations for orders
 */
class FilterService {
  toDecimal128(value) {
    return mongoose.Types.Decimal128.fromString(String(value));
  }

  normalizeStatus(type) {
    if (!type) {
      throw new ApiError(400, 'Status type is required');
    }

    const trimmed = type.trim();
    const alias = STATUS_ALIASES[trimmed.toLowerCase()];
    if (alias) {
      return alias;
    }

    const exact = ORDER_STATUSES.find(
      (status) => status.toLowerCase() === trimmed.toLowerCase()
    );
    if (exact) {
      return exact;
    }

    throw new ApiError(
      400,
      `Invalid status type. Allowed values: ${ORDER_STATUSES.join(', ')}`
    );
  }

  async _executePaginatedFilter(filter, query) {
    const { page = 1, limit = 10, sort = '-createdAt' } = query;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort,
      lean: true,
    };

    filter.isArchived = false;

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
  }

  async filterByStatus(type, query) {
    const status = this.normalizeStatus(type);
    return this._executePaginatedFilter({ OrderStatus: status }, query);
  }

  async filterByPayment(method, query) {
    const filter = {
      PaymentMethod: { $regex: method.trim(), $options: 'i' },
    };
    return this._executePaginatedFilter(filter, query);
  }

  async filterByCategory(name, query) {
    const filter = { Category: { $regex: name.trim(), $options: 'i' } };
    return this._executePaginatedFilter(filter, query);
  }

  async filterByBrand(name, query) {
    const filter = { Brand: { $regex: name.trim(), $options: 'i' } };
    return this._executePaginatedFilter(filter, query);
  }

  async filterByPrice(min, max, query) {
    const filter = {};
    const minNum = min !== undefined && min !== '' ? parseFloat(min) : null;
    const maxNum = max !== undefined && max !== '' ? parseFloat(max) : null;

    if (minNum === null && maxNum === null) {
      throw new ApiError(400, 'At least one of min or max is required');
    }

    if (minNum !== null && maxNum !== null && minNum > maxNum) {
      throw new ApiError(400, 'min cannot be greater than max');
    }

    filter.TotalAmount = {};
    if (minNum !== null) {
      filter.TotalAmount.$gte = this.toDecimal128(minNum);
    }
    if (maxNum !== null) {
      filter.TotalAmount.$lte = this.toDecimal128(maxNum);
    }

    return this._executePaginatedFilter(filter, query);
  }

  async filterByDateRange(start, end, query) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      throw new ApiError(400, 'Invalid date format. Use YYYY-MM-DD');
    }

    if (startDate > endDate) {
      throw new ApiError(400, 'start date cannot be after end date');
    }

    const filter = {
      OrderDate: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    return this._executePaginatedFilter(filter, query);
  }

  async filterByCountry(name, query) {
    const filter = { Country: { $regex: name.trim(), $options: 'i' } };
    return this._executePaginatedFilter(filter, query);
  }

  async filterByState(name, query) {
    const filter = { State: { $regex: name.trim(), $options: 'i' } };
    return this._executePaginatedFilter(filter, query);
  }

  async filterByCity(name, query) {
    const filter = { City: { $regex: name.trim(), $options: 'i' } };
    return this._executePaginatedFilter(filter, query);
  }

  async filterHighValue(amount, query) {
    const filter = {
      TotalAmount: { $gte: this.toDecimal128(amount) },
    };
    return this._executePaginatedFilter(filter, query);
  }

  async filterDiscounted(query) {
    const filter = {
      $expr: { $gt: [{ $toDouble: '$Discount' }, 0] },
    };
    return this._executePaginatedFilter(filter, query);
  }

  async filterCancelled(query) {
    return this._executePaginatedFilter({ OrderStatus: 'Cancelled' }, query);
  }

  async filterRefunded(query) {
    return this._executePaginatedFilter({ OrderStatus: 'Returned' }, query);
  }

  async filterShipped(query) {
    return this._executePaginatedFilter({ OrderStatus: 'Shipped' }, query);
  }

  async filterDelivered(query) {
    return this._executePaginatedFilter({ OrderStatus: 'Delivered' }, query);
  }
}

export default new FilterService();
