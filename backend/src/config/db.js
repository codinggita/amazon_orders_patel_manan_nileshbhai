import mongoose from 'mongoose';

/**
 * Database Configuration
 * Handles MongoDB connection
 */

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/amazon-ecommerce';

    const connection = await mongoose.connect(mongoURI);

    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
