import authService from '../services/auth.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Register User
 * @route POST /api/v1/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, user, 'User registered successfully'));
});

/**
 * Login User
 * @route POST /api/v1/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const device = req.get('User-Agent') || 'Unknown Device';
  const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';

  const loginData = await authService.loginUser(email, password, device, ip);
  return res
    .status(200)
    .json(new ApiResponse(200, loginData, 'User logged in successfully'));
});

/**
 * Logout User
 * @route POST /api/v1/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const logoutResult = await authService.logoutUser(refreshToken);
  return res
    .status(200)
    .json(new ApiResponse(200, null, logoutResult.message));
});

/**
 * Get Profile
 * @route GET /api/v1/auth/profile
 */
const getProfile = asyncHandler(async (req, res) => {
  // req.user is loaded by the verifyJWT middleware
  const profile = await authService.getUserProfile(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, profile, 'User profile fetched successfully'));
});

/**
 * Update Profile
 * @route PATCH /api/v1/auth/profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await authService.updateUserProfile(req.user._id, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, 'Profile updated successfully'));
});

/**
 * Delete Profile
 * @route DELETE /api/v1/auth/profile
 */
const deleteProfile = asyncHandler(async (req, res) => {
  const result = await authService.deleteUserProfile(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, null, result.message));
});

/**
 * Request Password Reset (Forgot Password)
 * @route POST /api/v1/auth/forgot-password
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);
  return res
    .status(200)
    .json(new ApiResponse(200, { otp: result.otp }, result.message));
});

/**
 * Reset Password
 * @route POST /api/v1/auth/reset-password
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const result = await authService.resetPassword(email, otp, newPassword);
  return res
    .status(200)
    .json(new ApiResponse(200, null, result.message));
});

/**
 * Change Password
 * @route POST /api/v1/auth/change-password
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await authService.changePassword(req.user._id, currentPassword, newPassword);
  return res
    .status(200)
    .json(new ApiResponse(200, null, result.message));
});

/**
 * Verify Email
 * @route POST /api/v1/auth/verify-email
 */
const verifyEmail = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const result = await authService.verifyEmail(req.user._id, otp);
  return res
    .status(200)
    .json(new ApiResponse(200, null, result.message));
});

/**
 * Send OTP
 * @route POST /api/v1/auth/send-otp
 */
const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.sendOtp(email);
  return res
    .status(200)
    .json(new ApiResponse(200, { otp: result.otp }, result.message));
});

/**
 * Verify OTP
 * @route POST /api/v1/auth/verify-otp
 */
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const result = await authService.verifyOtp(email, otp);
  return res
    .status(200)
    .json(new ApiResponse(200, null, result.message));
});

/**
 * Fetch Active Sessions
 * @route GET /api/v1/auth/sessions
 */
const getSessions = asyncHandler(async (req, res) => {
  const sessions = await authService.getActiveSessions(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, sessions, 'Active sessions fetched successfully'));
});

/**
 * Terminate Session
 * @route DELETE /api/v1/auth/sessions/:id
 */
const removeSession = asyncHandler(async (req, res) => {
  const sessionId = req.params.id;
  const result = await authService.removeSession(req.user._id, sessionId);
  return res
    .status(200)
    .json(new ApiResponse(200, null, result.message));
});

/**
 * Refresh Token
 * @route POST /api/v1/auth/refresh-token
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshAccessToken(refreshToken);
  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Token refreshed successfully'));
});

export {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  deleteProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  sendOtp,
  verifyOtp,
  getSessions,
  removeSession,
  refreshToken,
};
