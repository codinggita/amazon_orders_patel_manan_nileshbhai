import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';
import statsService from '../src/services/stats.service.js';

dotenv.config();

async function run() {
  await connectDB();

  console.log('\n--- Running Stats Service Verification ---');

  try {
    console.log('1. getOrdersTotal:');
    console.log(await statsService.getOrdersTotal());

    console.log('\n2. getOrdersDaily:');
    console.log(await statsService.getOrdersDaily());

    console.log('\n3. getOrdersMonthly:');
    console.log(await statsService.getOrdersMonthly());

    console.log('\n4. getOrdersYearly:');
    console.log(await statsService.getOrdersYearly());

    console.log('\n5. getRevenueTotal:');
    console.log(await statsService.getRevenueTotal());

    console.log('\n6. getRevenueDaily:');
    console.log(await statsService.getRevenueDaily());

    console.log('\n7. getRevenueMonthly:');
    console.log(await statsService.getRevenueMonthly());

    console.log('\n8. getRevenueYearly:');
    console.log(await statsService.getRevenueYearly());

    console.log('\n9. getProductsCount:');
    console.log(await statsService.getProductsCount());

    console.log('\n10. getCustomersCount:');
    console.log(await statsService.getCustomersCount());

    console.log('\n11. getCategoriesCount:');
    console.log(await statsService.getCategoriesCount());

    console.log('\n12. getRefundsCount:');
    console.log(await statsService.getRefundsCount());

    console.log('\n13. getCancellationsCount:');
    console.log(await statsService.getCancellationsCount());

    console.log('\n14. getShippingAverageTime:');
    console.log(await statsService.getShippingAverageTime());

    console.log('\n15. getSystemPerformance:');
    console.log(JSON.stringify(await statsService.getSystemPerformance(), null, 2));

    console.log('\nVerification completed successfully!');
  } catch (error) {
    console.error('Error running stats tests:', error);
  } finally {
    await mongoose.disconnect();
    console.log('DB disconnected.');
  }
}

run();
