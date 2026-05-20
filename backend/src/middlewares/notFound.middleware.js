import ApiError from "../utils/ApiError.js";

/**
 * Catches requests that did not match any registered route.
 */
const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export default notFoundHandler;
