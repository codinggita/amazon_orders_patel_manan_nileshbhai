import Order from '../models/Order.js';
import { resolveSortParam, SORT_PRESETS } from '../utils/sortMapper.js';

/**
 * Sort Service
 * Handles dedicated sort endpoints and sorted paginated listings
 */
class SortService {
  buildPaginationMeta(result) {
    return {
      totalRecords: result.totalDocs,
      totalPages: result.totalPages,
      currentPage: result.page,
      limit: result.limit,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    };
  }

  async paginateWithSort(query, sortValue) {
    const page = parseInt(query.page ?? 1, 10);
    const limit = parseInt(query.limit ?? 10, 10);
    const sort = sortValue || resolveSortParam(query.sort);

    const filter = { isArchived: false };

    const result = await Order.paginate(filter, {
      page,
      limit,
      sort,
      lean: true,
    });

    return {
      success: true,
      data: result.docs,
      pagination: {
        ...this.buildPaginationMeta(result),
        sortApplied: sort,
      },
    };
  }

  async getHighestValue(query) {
    return this.paginateWithSort(query, SORT_PRESETS['highest-value']);
  }

  async getLowestValue(query) {
    return this.paginateWithSort(query, SORT_PRESETS['lowest-value']);
  }

  async getLatest(query) {
    return this.paginateWithSort(query, SORT_PRESETS.latest);
  }

  async getOldest(query) {
    return this.paginateWithSort(query, SORT_PRESETS.oldest);
  }

  async getMostItems(query) {
    return this.paginateWithSort(query, SORT_PRESETS['most-items']);
  }

  async getLeastItems(query) {
    return this.paginateWithSort(query, SORT_PRESETS['least-items']);
  }

  async getByDiscount(query) {
    return this.paginateWithSort(query, SORT_PRESETS.discount);
  }
}

export default new SortService();
