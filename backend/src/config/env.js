import dotenv from "dotenv";

// Load .env before any other module reads process.env
dotenv.config({ quiet: true });

const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];

const getEnv = (key, defaultValue) => {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

// Support legacy MONGO_URI from existing .env files
const mongodbUri =
  process.env.MONGODB_URI?.trim() ||
  process.env.MONGO_URI?.trim();

if (!mongodbUri) {
  throw new Error(
    "Missing MongoDB URI. Set MONGODB_URI (or MONGO_URI) in your .env file."
  );
}

for (const key of requiredEnvVars) {
  if (key === "MONGODB_URI") continue;
  if (!process.env[key]?.trim()) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongodbUri,
  jwtSecret: getEnv("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
  isDevelopment: (process.env.NODE_ENV || "development") === "development",
  isProduction: process.env.NODE_ENV === "production",
};

export default env;
