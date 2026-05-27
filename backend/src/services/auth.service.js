import User from '../models/User.js';
import Session from '../models/Session.js';
import ApiError from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_amazon_clone';
const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '7d';

/**
 * Generate Access Token
 * Contains user basic info and active sessionId
 */
const generateAccessToken = (user, sessionId) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      sessionId,
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

/**
 * Generate Refresh Token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
    },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

/**
 * Authentication Service
 * Handles business logic for authentication, sessions, profiles, and password resets
 */
class AuthService {
  /**
   * Register a new user
   */
  async registerUser(userData) {
    const { name, email, password } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, 'User with this email already exists');
    }

    const user = await User.create({ name, email, password });
    
    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    return userResponse;
  }

  /**
   * Login user and create session
   */
  async loginUser(email, password, device = 'Unknown Device', ip = '127.0.0.1') {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate tokens
    const refreshToken = generateRefreshToken(user);

    // Create session in DB
    const sessionExpiry = new Date();
    sessionExpiry.setDate(sessionExpiry.getDate() + 7); // 7 days matching token expiry

    const session = await Session.create({
      userId: user._id,
      token: refreshToken,
      device,
      ip,
      expiresAt: sessionExpiry,
    });

    const accessToken = generateAccessToken(user, session._id);

    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Logout user and terminate current session
   */
  async logoutUser(sessionToken) {
    if (!sessionToken) {
      throw new ApiError(400, 'Refresh token is required for logout');
    }

    const result = await Session.deleteOne({ token: sessionToken });
    if (result.deletedCount === 0) {
      throw new ApiError(404, 'Session not found');
    }
    return { message: 'Logged out successfully' };
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId, updateData) {
    const { name, email } = updateData;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (email && email !== user.email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        throw new ApiError(400, 'Email is already taken by another user');
      }
      user.email = email;
      user.isEmailVerified = false; // Reset verification if email changes
    }

    if (name) {
      user.name = name;
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    return userResponse;
  }

  /**
   * Delete user profile & all associated sessions
   */
  async deleteUserProfile(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Terminate all sessions
    await Session.deleteMany({ userId });

    return { message: 'Profile deleted successfully' };
  }

  /**
   * Request password reset (Forgot password)
   */
  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, 'User not found with this email');
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    user.resetPasswordOtp = { code: otp, expiresAt };
    await user.save();

    console.log(`[MAIL SIMULATOR] Password Reset OTP for ${email}: ${otp}`);

    return {
      message: 'Password reset OTP sent successfully',
      otp, // Returning OTP for mock environment testing
    };
  }

  /**
   * Reset password using OTP
   */
  async resetPassword(email, otp, newPassword) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const otpData = user.resetPasswordOtp;
    if (!otpData || otpData.code !== otp || new Date() > otpData.expiresAt) {
      throw new ApiError(400, 'Invalid or expired OTP');
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordOtp = undefined; // Clear OTP
    await user.save();

    // Terminate all active sessions to force re-login
    await Session.deleteMany({ userId: user._id });

    return { message: 'Password has been reset successfully' };
  }

  /**
   * Change password for logged-in user
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isPasswordValid = await user.isPasswordCorrect(currentPassword);
    if (!isPasswordValid) {
      throw new ApiError(400, 'Incorrect current password');
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }

  /**
   * Verify email address with OTP
   */
  async verifyEmail(userId, otp) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const otpData = user.otp;
    if (!otpData || otpData.code !== otp || new Date() > otpData.expiresAt) {
      throw new ApiError(400, 'Invalid or expired OTP');
    }

    user.isEmailVerified = true;
    user.otp = undefined; // Clear OTP
    await user.save();

    return { message: 'Email verified successfully' };
  }

  /**
   * Send OTP for email verification
   */
  async sendOtp(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = { code: otp, expiresAt };
    await user.save();

    console.log(`[MAIL SIMULATOR] Email verification OTP for ${email}: ${otp}`);

    return {
      message: 'OTP sent successfully',
      otp, // Returning OTP for mock environment testing
    };
  }

  /**
   * Verify general OTP
   */
  async verifyOtp(email, otp) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const otpData = user.otp;
    if (!otpData || otpData.code !== otp || new Date() > otpData.expiresAt) {
      throw new ApiError(400, 'Invalid or expired OTP');
    }

    // Clear OTP upon success
    user.otp = undefined;
    await user.save();

    return { message: 'OTP verified successfully' };
  }

  /**
   * Fetch active sessions for user
   */
  async getActiveSessions(userId) {
    const sessions = await Session.find({ userId }).select('_id device ip createdAt expiresAt');
    return sessions;
  }

  /**
   * Remove specific active session
   */
  async removeSession(userId, sessionId) {
    const session = await Session.findById(sessionId);
    if (!session) {
      throw new ApiError(404, 'Session not found');
    }

    if (session.userId.toString() !== userId.toString()) {
      throw new ApiError(403, 'Unauthorized to terminate this session');
    }

    await session.deleteOne();
    return { message: 'Session terminated successfully' };
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET);

      const session = await Session.findOne({ token: refreshToken });
      if (!session) {
        throw new ApiError(401, 'Invalid session or session has expired');
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new ApiError(401, 'User not found');
      }

      const accessToken = generateAccessToken(user, session._id);

      return { accessToken };
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }
  }
}

export default new AuthService();
