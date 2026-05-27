import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';
import shippingService from '../src/services/shipping.service.js';
import Order from '../src/models/Order.js';

dotenv.config();

async function run() {
  await connectDB();

  console.log('\n--- Running Shipping Service Verification ---');

  let testOrder = null;
  let createdTestOrder = false;

  try {
    // 1. Fetch/Create test order
    testOrder = await Order.findOne({ isArchived: false });
    if (!testOrder) {
      console.log('No order found. Creating a temporary order for testing...');
      testOrder = await Order.create({
        OrderID: 'ORD9999999',
        CustomerID: 'CUST000001',
        CustomerName: 'John Doe',
        ProductID: 'P00001',
        ProductName: 'Test Product',
        Category: 'Test Category',
        Brand: 'Test Brand',
        Quantity: 1,
        UnitPrice: '10.00',
        Discount: '0.00',
        Tax: '1.00',
        ShippingCost: '2.00',
        TotalAmount: '13.00',
        OrderDate: new Date(),
        PaymentMethod: 'COD',
        OrderStatus: 'Pending',
        City: 'Test City',
        State: 'Test State',
        Country: 'Test Country',
        SellerID: 'SELL00001',
      });
      createdTestOrder = true;
      console.log(`Temporary order created with ID: ${testOrder._id}`);
    } else {
      console.log(`Using existing order ID for testing: ${testOrder._id} (${testOrder.OrderID})`);
    }

    // Save original status and address to restore later
    const originalStatus = testOrder.OrderStatus;
    const originalCity = testOrder.City;
    const originalState = testOrder.State;
    const originalCountry = testOrder.Country;

    // 2. Fetch carriers
    console.log('\n1. getCarriers:');
    const carriers = await shippingService.getCarriers();
    console.log(carriers);

    // 3. Fetch pending shipments
    console.log('\n2. getPendingShipments:');
    const pending = await shippingService.getPendingShipments({ page: 1, limit: 2 });
    console.log(`Fetched ${pending.data.length} pending shipments. Total: ${pending.pagination.totalRecords}`);

    // 4. Fetch delivered shipments
    console.log('\n3. getDeliveredShipments:');
    const delivered = await shippingService.getDeliveredShipments({ page: 1, limit: 2 });
    console.log(`Fetched ${delivered.data.length} delivered shipments. Total: ${delivered.pagination.totalRecords}`);

    // 5. Fetch returned shipments
    console.log('\n4. getReturnedShipments:');
    const returned = await shippingService.getReturnedShipments({ page: 1, limit: 2 });
    console.log(`Fetched ${returned.data.length} returned shipments. Total: ${returned.pagination.totalRecords}`);

    // 6. Track shipment
    console.log('\n5. trackShipment:');
    const tracking = await shippingService.trackShipment(testOrder._id);
    console.log(tracking);

    // 7. Estimate delivery date
    console.log('\n6. estimateDeliveryDate:');
    const estimate = await shippingService.estimateDeliveryDate(testOrder._id);
    console.log(estimate);

    // 8. Create shipping label
    console.log('\n7. createShippingLabel:');
    const label = await shippingService.createShippingLabel(testOrder._id, 'DHL', 'Express');
    console.log(label);

    // 9. Reschedule delivery
    console.log('\n8. rescheduleDelivery:');
    const reschedule = await shippingService.rescheduleDelivery(testOrder._id, '2026-06-10T14:00:00Z');
    console.log(reschedule);

    // 10. Change address
    console.log('\n9. changeAddress:');
    const updatedAddress = await shippingService.changeAddress(testOrder._id, {
      City: 'Updated City',
      State: 'Updated State',
      Country: 'Updated Country',
    });
    console.log(`Address changed. New City: ${updatedAddress.City}, State: ${updatedAddress.State}, Country: ${updatedAddress.Country}`);

    // 11. Update shipping status
    console.log('\n10. updateShippingStatus:');
    const updatedStatus = await shippingService.updateShippingStatus(testOrder._id, 'Shipped', 'Status updated for verification tests');
    console.log(`Status changed from ${originalStatus} to ${updatedStatus.OrderStatus}`);

    // 12. Cleanup / Restoring data
    console.log('\n--- Cleaning up / Restoring test data ---');
    if (createdTestOrder) {
      await Order.deleteOne({ _id: testOrder._id });
      console.log('Temporary test order deleted.');
    } else {
      // Restore original values
      await Order.updateOne(
        { _id: testOrder._id },
        {
          $set: {
            OrderStatus: originalStatus,
            City: originalCity,
            State: originalState,
            Country: originalCountry,
          },
          // Pop statusHistory entry to avoid polluting history
          $pop: { statusHistory: 1 },
        }
      );
      console.log('Original order status and address restored.');
    }

    console.log('\nVerification completed successfully!');
  } catch (error) {
    console.error('Error running shipping tests:', error);
  } finally {
    await mongoose.disconnect();
    console.log('DB disconnected.');
  }
}

run();
