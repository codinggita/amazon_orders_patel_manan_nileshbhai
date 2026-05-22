/**
 * Pagination Utility
 * Helper functions for pagination, sorting, and filtering
 */

/**
 * Parse pagination parameters from query
 * @param {Object} query - Query object
 * @returns {Object} Parsed pagination parameters
 */
export const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

/**
 * Parse sort parameter
 * @param {String} sortParam - Sort parameter (e.g., "-createdAt", "name")
 * @returns {Object} Sort object for MongoDB
 */
export const parseSort = (sortParam = '-createdAt') => {
  if (!sortParam) {
    return { createdAt: -1 };
  }

  const sort = {};
  const fields = sortParam.split(',');

  fields.forEach((field) => {
    field = field.trim();
    if (field.startsWith('-')) {
      sort[field.substring(1)] = -1;
    } else {
      sort[field] = 1;
    }
  });

  return Object.keys(sort).length > 0 ? sort : { createdAt: -1 };
};

/**
 * Build filter object from query parameters
 * @param {Object} query - Query object
 * @param {Array} filterableFields - List of filterable fields
 * @returns {Object} MongoDB filter object
 */
export const buildFilter = (query, filterableFields = []) => {
  const filter = {};

  filterableFields.forEach((field) => {
    if (query[field]) {
      filter[field] = query[field];
    }
  });

  return filter;
};

/**
 * Build regex search filter
 * @param {String} search - Search term
 * @param {Array} searchableFields - Fields to search
 * @returns {Object} MongoDB $or filter
 */
export const buildSearchFilter = (search, searchableFields = []) => {
  if (!search || searchableFields.length === 0) {
    return null;
  }

  return {
    $or: searchableFields.map((field) => ({
      [field]: { $regex: search, $options: 'i' },
    })),
  };
};

/**
 * Calculate pagination metadata
 * @param {Number} totalRecords - Total records count
 * @param {Number} limit - Records per page
 * @param {Number} page - Current page
 * @returns {Object} Pagination metadata
 */
export const getPaginationMetadata = (totalRecords, limit, page) => {
  const totalPages = Math.ceil(totalRecords / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    totalRecords,
    totalPages,
    currentPage: page,
    limit,
    hasNextPage,
    hasPrevPage,
  };
};

export default {
  parsePagination,
  parseSort,
  buildFilter,
  buildSearchFilter,
  getPaginationMetadata,
};
