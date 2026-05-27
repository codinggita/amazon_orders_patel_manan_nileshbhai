import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Session from '../models/Session.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Middleware to verify JSON Web Token and Session validity
 */
const verifyJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authorization token is required');
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_amazon_clone');

    // Find User
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      throw new ApiError(401, 'Invalid user or token');
    }

    // Verify if the session exists (has not been logged out or terminated)
    if (decoded.sessionId) {
      const session = await Session.findById(decoded.sessionId);
      if (!session) {
        throw new ApiError(401, 'Session has expired or been terminated. Please login again.');
      }
      req.session = session;
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || 'Invalid or expired token');
  }
});

export { verifyJWT };
export default verifyJWT;
