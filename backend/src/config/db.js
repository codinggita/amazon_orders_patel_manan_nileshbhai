import mongoose from "mongoose";
import env from "./env.js";

/**
 * Mongoose connection event listeners for observability in production.
 */
const registerConnectionEvents = () => {
  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to MongoDB");
  });

  mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("Mongoose disconnected from MongoDB");
  });
};

/**
 * Reusable MongoDB connection via Mongoose.
 * Call once at startup before accepting HTTP traffic.
 */
const connectDB = async () => {
  try {
    registerConnectionEvents();

    const conn = await mongoose.connect(env.mongodbUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

/** Graceful disconnect for shutdown hooks */
export const disconnectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    return;
  }
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
};

export default connectDB;
