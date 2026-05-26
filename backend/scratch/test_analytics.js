import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';
import Order from '../src/models/Order.js';
import analyticsService from '../src/services/analytics.service.js';

dotenv.config();

const sampleOrders = [
  {
    OrderID: 'ORD0000001',
    CustomerID: 'CUST000001',
    CustomerName: 'John Doe',
    ProductID: 'P00001',
    ProductName: 'iPhone 15 Pro',
    Category: 'Electronics',
    Brand: 'Apple',
    Quantity: 1,
    UnitPrice: mongoose.Types.Decimal128.fromString('999.99'),
    Discount: mongoose.Types.Decimal128.fromString('50.00'),
    Tax: mongoose.Types.Decimal128.fromString('80.00'),
    ShippingCost: mongoose.Types.Decimal128.fromString('15.00'),
    TotalAmount: mongoose.Types.Decimal128.fromString('1044.99'),
    OrderDate: new Date('2025-01-10T12:00:00Z'),
    PaymentMethod: 'Credit Card',
    OrderStatus: 'Delivered',
    City: 'New York',
    State: 'NY',
    Country: 'USA',
    SellerID: 'SELL00001',
  },
  {
    OrderID: 'ORD0000002',
    CustomerID: 'CUST000002',
    CustomerName: 'Jane Smith',
    ProductID: 'P00002',
    ProductName: 'Galaxy S24',
    Category: 'Electronics',
    Brand: 'Samsung',
    Quantity: 1,
    UnitPrice: mongoose.Types.Decimal128.fromString('899.99'),
    Discount: mongoose.Types.Decimal128.fromString('0.00'),
    Tax: mongoose.Types.Decimal128.fromString('72.00'),
    ShippingCost: mongoose.Types.Decimal128.fromString('0.00'),
    TotalAmount: mongoose.Types.Decimal128.fromString('971.99'),
    OrderDate: new Date('2025-02-15T15:30:00Z'),
    PaymentMethod: 'UPI',
    OrderStatus: 'Cancelled',
    City: 'Mumbai',
    State: 'Maharashtra',
    Country: 'India',
    SellerID: 'SELL00002',
  },
  {
    OrderID: 'ORD0000003',
    CustomerID: 'CUST000001',
    CustomerName: 'John Doe',
    ProductID: 'P00003',
    ProductName: 'Running Shoes',
    Category: 'Footwear',
    Brand: 'Nike',
    Quantity: 2,
    UnitPrice: mongoose.Types.Decimal128.fromString('120.00'),
    Discount: mongoose.Types.Decimal128.fromString('10.00'),
    Tax: mongoose.Types.Decimal128.fromString('15.00'),
    ShippingCost: mongoose.Types.Decimal128.fromString('10.00'),
    TotalAmount: mongoose.Types.Decimal128.fromString('255.00'),
    OrderDate: new Date('2025-03-01T09:00:00Z'),
    PaymentMethod: 'Debit Card',
    OrderStatus: 'Returned',
    City: 'London',
    State: 'England',
    Country: 'UK',
    SellerID: 'SELL00003',
  },
  {
    OrderID: 'ORD0000004',
    CustomerID: 'CUST000003',
    CustomerName: 'Alice Johnson',
    ProductID: 'P00004',
    ProductName: 'Ergonomic Chair',
    Category: 'Furniture',
    Brand: 'Steelcase',
    Quantity: 1,
    UnitPrice: mongoose.Types.Decimal128.fromString('450.00'),
    Discount: mongoose.Types.Decimal128.fromString('100.00'),
    Tax: mongoose.Types.Decimal128.fromString('35.00'),
    ShippingCost: mongoose.Types.Decimal128.fromString('50.00'),
    TotalAmount: mongoose.Types.Decimal128.fromString('435.00'),
    OrderDate: new Date('2025-03-20T10:45:00Z'),
    PaymentMethod: 'Credit Card',
    OrderStatus: 'Delivered',
    City: 'Chicago',
    State: 'IL',
    Country: 'USA',
    SellerID: 'SELL00001',
  },
  {
    OrderID: 'ORD0000005',
    CustomerID: 'CUST000002',
    CustomerName: 'Jane Smith',
    ProductID: 'P00001',
    ProductName: 'iPhone 15 Pro',
    Category: 'Electronics',
    Brand: 'Apple',
    Quantity: 1,
    UnitPrice: mongoose.Types.Decimal128.fromString('999.99'),
    Discount: mongoose.Types.Decimal128.fromString('0.00'),
    Tax: mongoose.Types.Decimal128.fromString('80.00'),
    ShippingCost: mongoose.Types.Decimal128.fromString('15.00'),
    TotalAmount: mongoose.Types.Decimal128.fromString('1094.99'),
    OrderDate: new Date('2026-01-05T14:20:00Z'),
    PaymentMethod: 'Net Banking',
    OrderStatus: 'Shipped',
    City: 'New Delhi',
    State: 'Delhi',
    Country: 'India',
    SellerID: 'SELL00001',
  },
];

async function run() {
  await connectDB();

  console.log('Checking database...');
  const count = await Order.countDocuments();
  console.log(`Current orders count in DB: ${count}`);

  if (count === 0) {
    console.log('Seeding sample data for testing...');
    await Order.insertMany(sampleOrders);
    console.log('Seeding completed.');
  } else {
    // Check if test orders already exist, if not we add them to make sure we have clean known data
    const testOrder = await Order.findOne({ OrderID: 'ORD0000001' });
    if (!testOrder) {
      console.log('Adding specific test orders for verification...');
      await Order.insertMany(sampleOrders);
    }
  }

  console.log('\n--- Running Analytics Service Verification ---');

  try {
    console.log('1. getRevenueTotal:');
    console.log(await analyticsService.getRevenueTotal());

    console.log('\n2. getRevenueMonthly:');
    console.log(await analyticsService.getRevenueMonthly());

    console.log('\n3. getRevenueYearly:');
    console.log(await analyticsService.getRevenueYearly());

    console.log('\n4. getOrdersAverageValue:');
    console.log(await analyticsService.getOrdersAverageValue());

    console.log('\n5. getOrdersCount:');
    console.log(JSON.stringify(await analyticsService.getOrdersCount(), null, 2));

    console.log('\n6. getOrdersCancelled:');
    console.log(JSON.stringify(await analyticsService.getOrdersCancelled(), null, 2));

    console.log('\n7. getOrdersRefunded:');
    console.log(JSON.stringify(await analyticsService.getOrdersRefunded(), null, 2));

    console.log('\n8. getCustomersTop:');
    console.log(await analyticsService.getCustomersTop());

    console.log('\n9. getProductsTopSelling:');
    console.log(await analyticsService.getProductsTopSelling());

    console.log('\n10. getProductsLowSelling:');
    console.log(await analyticsService.getProductsLowSelling());

    console.log('\n11. getCategoriesTop:');
    console.log(await analyticsService.getCategoriesTop());

    console.log('\n12. getPaymentsDistribution:');
    console.log(await analyticsService.getPaymentsDistribution());

    console.log('\n13. getLocationsTopCities:');
    console.log(await analyticsService.getLocationsTopCities());

    console.log('\n14. getReturnsRate:');
    console.log(JSON.stringify(await analyticsService.getReturnsRate(), null, 2));

    console.log('\n15. getDiscountsUsage:');
    console.log(JSON.stringify(await analyticsService.getDiscountsUsage(), null, 2));

    console.log('\nVerification completed successfully!');
  } catch (error) {
    console.error('Error running analytics tests:', error);
  } finally {
    await mongoose.disconnect();
    console.log('DB disconnected.');
  }
}

run();
