import filterService from '../services/filter.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

const filterByStatus = asyncHandler(async (req, res) => {
  const result = await filterService.filterByStatus(req.query.type, req.query);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Orders filtered by status successfully',
        result.pagination
      )
    );
});

const filterByPayment = asyncHandler(async (req, res) => {
  const result = await filterService.filterByPayment(req.query.method, req.query);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Orders filtered by payment method successfully',
        result.pagination
      )
    );
});

const filterByCategory = asyncHandler(async (req, res) => {
  const result = await filterService.filterByCategory(req.query.name, req.query);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Orders filtered by category successfully',
        result.pagination
      )
    );
});

const filterByBrand = asyncHandler(async (req, res) => {
  const result = await filterService.filterByBrand(req.query.name, req.query);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Orders filtered by brand successfully',
        result.pagination
      )
    );
});

const filterByPrice = asyncHandler(async (req, res) => {
  const result = await filterService.filterByPrice(
    req.query.min,
    req.query.max,
    req.query
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Orders filtered by price range successfully',
        result.pagination
      )
    );
});

const filterByDateRange = asyncHandler(async (req, res) => {
  const result = await filterService.filterByDateRange(
    req.query.start,
    req.query.end,
    req.query
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Orders filtered by date range successfully',
        result.pagination
      )
    );
});

const filterByCountry = asyncHandler(async (req, res) => {
  const result = await filterService.filterByCountry(req.query.name, req.query);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Orders filtered by country successfully',
        result.pagination
      )
    );
});

const filterByState = asyncHandler(async (req, res) => {
  const result = await filterService.filterByState(req.query.name, req.query);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Orders filtered by state successfully',
        result.pagination
      )
    );
});

const filterByCity = asyncHandler(async (req, res) => {
  const result = await filterService.filterByCity(req.query.name, req.query);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Orders filtered by city successfully',
        result.pagination
      )
    );
});

const filterHighValue = asyncHandler(async (req, res) => {
  const result = await filterService.filterHighValue(req.query.amount, req.query);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'High value orders filtered successfully',
        result.pagination
      )
    );
});

const filterDiscounted = asyncHandler(async (req, res) => {
  const result = await filterService.filterDiscounted(req.query);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Discounted orders filtered successfully',
        result.pagination
      )
    );
});

const filterCancelled = asyncHandler(async (req, res) => {
  const result = await filterService.filterCancelled(req.query);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Cancelled orders filtered successfully',
        result.pagination
      )
    );
});

const filterRefunded = asyncHandler(async (req, res) => {
  const result = await filterService.filterRefunded(req.query);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Refunded orders filtered successfully',
        result.pagination
      )
    );
});

const filterShipped = asyncHandler(async (req, res) => {
  const result = await filterService.filterShipped(req.query);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Shipped orders filtered successfully',
        result.pagination
      )
    );
});

const filterDelivered = asyncHandler(async (req, res) => {
  const result = await filterService.filterDelivered(req.query);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.data,
        'Delivered orders filtered successfully',
        result.pagination
      )
    );
});

export {
  filterByStatus,
  filterByPayment,
  filterByCategory,
  filterByBrand,
  filterByPrice,
  filterByDateRange,
  filterByCountry,
  filterByState,
  filterByCity,
  filterHighValue,
  filterDiscounted,
  filterCancelled,
  filterRefunded,
  filterShipped,
  filterDelivered,
};
