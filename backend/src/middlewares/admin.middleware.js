import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Middleware to verify that the authenticated user has the Admin role
 */
const verifyAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied. Admin rights required.');
  }
  next();
});

export { verifyAdmin };
export default verifyAdmin;
