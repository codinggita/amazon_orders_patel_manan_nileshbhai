/**
 * Environment Configuration
 * Centralizes all environment variables
 */

export const config = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/amazon-ecommerce',

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  // API
  API_VERSION: 'v1',
  API_PREFIX: '/api/v1',

  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // Rate Limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: 100,
};

export default config;
