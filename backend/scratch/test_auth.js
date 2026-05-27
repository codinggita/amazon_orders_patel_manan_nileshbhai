import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';
import authService from '../src/services/auth.service.js';
import User from '../src/models/User.js';
import Session from '../src/models/Session.js';

dotenv.config();

async function run() {
  await connectDB();

  console.log('\n--- Running Authentication Service Verification ---');

  const testEmail = 'manan_test@example.com';
  const initialPassword = 'password123';
  const newPassword = 'newsecurepassword123';
  let userId = null;

  try {
    // Clean up any leftovers from previous aborted tests
    await User.deleteMany({ email: testEmail });

    // 1. Register User
    console.log('\n1. registerUser:');
    const registeredUser = await authService.registerUser({
      name: 'Manan Patel',
      email: testEmail,
      password: initialPassword,
    });
    userId = registeredUser._id;
    console.log(`Registered user: ${registeredUser.name} (${registeredUser.email}), ID: ${userId}`);

    // 2. Login User
    console.log('\n2. loginUser (Success):');
    const loginResult = await authService.loginUser(testEmail, initialPassword, 'Test Laptop', '192.168.1.1');
    console.log('Login successful! Returned tokens:');
    console.log(`- Access Token (first 30 chars): ${loginResult.accessToken.substring(0, 30)}...`);
    console.log(`- Refresh Token (first 30 chars): ${loginResult.refreshToken.substring(0, 30)}...`);
    
    const sessionToken = loginResult.refreshToken;

    // 3. Get User Profile
    console.log('\n3. getUserProfile:');
    const profile = await authService.getUserProfile(userId);
    console.log(`Profile: name=${profile.name}, email=${profile.email}, isEmailVerified=${profile.isEmailVerified}`);

    // 4. Update User Profile
    console.log('\n4. updateUserProfile:');
    const updatedProfile = await authService.updateUserProfile(userId, { name: 'Manan Nileshbhai Patel' });
    console.log(`Updated Profile name: ${updatedProfile.name}`);

    // 5. Get Active Sessions
    console.log('\n5. getActiveSessions:');
    const sessions = await authService.getActiveSessions(userId);
    console.log(`Active sessions count: ${sessions.length}`);
    sessions.forEach((s) => console.log(`- ID: ${s._id}, Device: ${s.device}, IP: ${s.ip}`));

    const sessionId = sessions[0]._id;

    // 6. Refresh Access Token
    console.log('\n6. refreshAccessToken:');
    const refreshResult = await authService.refreshAccessToken(sessionToken);
    console.log(`Refreshed Access Token (first 30 chars): ${refreshResult.accessToken.substring(0, 30)}...`);

    // 7. Send Verification OTP
    console.log('\n7. sendOtp:');
    const sendOtpResult = await authService.sendOtp(testEmail);
    console.log(`OTP result: ${sendOtpResult.message}, Code: ${sendOtpResult.otp}`);

    // 8. Verify OTP
    console.log('\n8. verifyOtp:');
    const verifyOtpResult = await authService.verifyOtp(testEmail, sendOtpResult.otp);
    console.log(verifyOtpResult);

    // 9. Send email verification OTP & Verify Email
    console.log('\n9. verifyEmail:');
    const verificationOtp = await authService.sendOtp(testEmail);
    const verifyEmailResult = await authService.verifyEmail(userId, verificationOtp.otp);
    console.log(verifyEmailResult);

    // 10. Forgot Password
    console.log('\n10. forgotPassword:');
    const forgotResult = await authService.forgotPassword(testEmail);
    console.log(`Forgot password OTP sent. Code: ${forgotResult.otp}`);

    // 11. Reset Password
    console.log('\n11. resetPassword:');
    const resetResult = await authService.resetPassword(testEmail, forgotResult.otp, newPassword);
    console.log(resetResult);

    // 12. Login after password reset
    console.log('\n12. loginUser (after password reset):');
    const reLoginResult = await authService.loginUser(testEmail, newPassword, 'Test Phone', '10.0.0.1');
    console.log(`Re-logged in. New access token starts with: ${reLoginResult.accessToken.substring(0, 20)}...`);
    const newSessionToken = reLoginResult.refreshToken;

    // 13. Change Password
    console.log('\n13. changePassword:');
    const changeResult = await authService.changePassword(userId, newPassword, initialPassword);
    console.log(changeResult);

    // 14. Remove Active Session
    console.log('\n14. removeSession:');
    const activeSessionsBefore = await authService.getActiveSessions(userId);
    console.log(`Active sessions count before deletion: ${activeSessionsBefore.length}`);
    const deleteSessionResult = await authService.removeSession(userId, activeSessionsBefore[0]._id);
    console.log(deleteSessionResult);
    const activeSessionsAfter = await authService.getActiveSessions(userId);
    console.log(`Active sessions count after deletion: ${activeSessionsAfter.length}`);

    // 15. Logout
    console.log('\n15. logoutUser (using logout endpoint):');
    // Login again to get a fresh logout session
    const finalLogin = await authService.loginUser(testEmail, initialPassword, 'Test Tablet', '172.16.0.1');
    const logoutResult = await authService.logoutUser(finalLogin.refreshToken);
    console.log(logoutResult);

    // 16. Delete User Profile
    console.log('\n16. deleteUserProfile:');
    const deleteResult = await authService.deleteUserProfile(userId);
    console.log(deleteResult);

    console.log('\nVerification completed successfully!');
  } catch (error) {
    console.error('Error running auth tests:', error);
    // Attempt cleanup if failed
    if (userId) {
      await User.findByIdAndDelete(userId);
      await Session.deleteMany({ userId });
      console.log('Cleaned up test user after failure.');
    }
  } finally {
    await mongoose.disconnect();
    console.log('DB disconnected.');
  }
}

run();
