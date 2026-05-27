import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';
import adminService from '../src/services/admin.service.js';
import User from '../src/models/User.js';

dotenv.config();

async function run() {
  await connectDB();

  console.log('\n--- Running Admin Service Verification ---');

  const adminEmail = 'admin_test@example.com';
  const standardEmail = 'user_test@example.com';
  let adminUserId = null;
  let standardUserId = null;

  try {
    // Clean up leftovers from previous aborted tests
    await User.deleteMany({ email: { $in: [adminEmail, standardEmail] } });

    // 1. Setup Admin and Standard Users
    console.log('Setting up test users...');
    const adminUser = await User.create({
      name: 'Test Administrator',
      email: adminEmail,
      password: 'password123',
      role: 'admin',
    });
    adminUserId = adminUser._id;

    const standardUser = await User.create({
      name: 'Test Standard User',
      email: standardEmail,
      password: 'password123',
      role: 'user',
    });
    standardUserId = standardUser._id;

    console.log(`- Admin User created: ${adminUser.name} (${adminUser.email}), ID: ${adminUserId}`);
    console.log(`- Standard User created: ${standardUser.name} (${standardUser.email}), ID: ${standardUserId}`);

    // 2. Fetch all users
    console.log('\n1. getAllUsers:');
    const usersList = await adminService.getAllUsers({ page: 1, limit: 5 });
    console.log(`Fetched ${usersList.data.length} users. Total in DB: ${usersList.pagination.totalRecords}`);

    // 3. Fetch specific user
    console.log('\n2. getUserById:');
    const fetchedUser = await adminService.getUserById(standardUserId);
    console.log(`Fetched User details: ${fetchedUser.name}, Role: ${fetchedUser.role}, Banned: ${fetchedUser.isBanned}`);

    // 4. Change User Role
    console.log('\n3. changeUserRole (Standard -> Admin):');
    const roleChange = await adminService.changeUserRole(standardUserId, 'admin');
    console.log(`Updated User Role: ${roleChange.role}`);

    // Restore to standard
    await adminService.changeUserRole(standardUserId, 'user');

    // 5. Ban User
    console.log('\n4. banUser:');
    const bannedUser = await adminService.banUser(standardUserId);
    console.log(`Banned status: ${bannedUser.isBanned}`);

    // 6. Unban User
    console.log('\n5. unbanUser:');
    const unbannedUser = await adminService.unbanUser(standardUserId);
    console.log(`Banned status after unban: ${unbannedUser.isBanned}`);

    // 7. Fetch all orders
    console.log('\n6. getAllOrders:');
    const ordersList = await adminService.getAllOrders({ page: 1, limit: 2 });
    console.log(`Fetched ${ordersList.data.length} orders. Total in DB: ${ordersList.pagination.totalRecords}`);

    // 8. Fetch sales reports
    console.log('\n7. getSalesReport:');
    const salesReport = await adminService.getSalesReport();
    console.log(`Sales report total orders: ${salesReport.totalOrders}`);
    console.log(`Daily data points: ${salesReport.dailyStats.length}`);

    // 9. Fetch revenue reports
    console.log('\n8. getRevenueReport:');
    const revenueReport = await adminService.getRevenueReport();
    console.log(`Revenue report total revenue: ${revenueReport.totalRevenue}`);
    console.log(`Daily data points: ${revenueReport.dailyStats.length}`);

    // 10. Clear cache
    console.log('\n9. clearCache:');
    const cacheResult = await adminService.clearCache();
    console.log(cacheResult);

    // 11. System health
    console.log('\n10. getSystemHealth:');
    const health = await adminService.getSystemHealth();
    console.log(`Uptime: ${health.uptimeFriendly}, Memory heap used: ${health.memory.heapUsed}, Database: ${health.databaseStatus}`);

    // 12. System logs
    console.log('\n11. getSystemLogs:');
    const logs = await adminService.getSystemLogs();
    console.log(`Retrieved ${logs.length} log statements. Latest log: "${logs[logs.length - 1].message}"`);

    // 13. Enable maintenance mode
    console.log('\n12. setMaintenanceMode (Enable):');
    const maintenanceResult = await adminService.setMaintenanceMode(true);
    console.log(maintenanceResult);

    // 14. Fetch backups
    console.log('\n13. getBackups:');
    const backups = await adminService.getBackups();
    console.log(`Retrieved backups:`);
    backups.forEach((b) => console.log(`- Filename: ${b.filename}, Size: ${b.size}, CreatedAt: ${b.createdAt}`));

    // 15. Cleanup test users
    console.log('\n--- Cleaning up test data ---');
    await User.deleteMany({ email: { $in: [adminEmail, standardEmail] } });
    console.log('Test users removed from DB.');

    console.log('\nVerification completed successfully!');
  } catch (error) {
    console.error('Error running admin tests:', error);
    // Cleanup if failure occurs
    await User.deleteMany({ email: { $in: [adminEmail, standardEmail] } });
  } finally {
    await mongoose.disconnect();
    console.log('DB disconnected.');
  }
}

run();
