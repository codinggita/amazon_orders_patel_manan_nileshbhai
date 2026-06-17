import mongoose from 'mongoose';
import { config } from '../config/env.js';
import statsService from './stats.service.js';

class SystemService {
  getVersion() {
    return {
      apiVersion: config.API_VERSION,
      apiPrefix: config.API_PREFIX,
      nodeVersion: process.version,
      environment: config.NODE_ENV,
    };
  }

  getPublicConfig() {
    return {
      apiVersion: config.API_VERSION,
      apiPrefix: config.API_PREFIX,
      corsOrigin: config.CORS_ORIGIN,
      defaultPage: config.DEFAULT_PAGE,
      defaultLimit: config.DEFAULT_LIMIT,
      maxLimit: config.MAX_LIMIT,
      rateLimitWindowMs: config.RATE_LIMIT_WINDOW,
      rateLimitMax: config.RATE_LIMIT_MAX,
    };
  }

  getUptime() {
    const uptimeSeconds = process.uptime();
    return {
      uptimeSeconds,
      uptimeFriendly: this._formatUptime(uptimeSeconds),
      startedAt: new Date(Date.now() - uptimeSeconds * 1000).toISOString(),
    };
  }

  ping() {
    return {
      status: 'ok',
      message: 'pong',
      timestamp: new Date().toISOString(),
    };
  }

  async getDatabaseStatus() {
    const readyState = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];

    return {
      status: readyState === 1 ? 'healthy' : 'unhealthy',
      connectionState: states[readyState] || 'unknown',
      host: mongoose.connection.host || null,
      database: mongoose.connection.name || null,
      checkedAt: new Date().toISOString(),
    };
  }

  getCacheStatus() {
    return {
      status: 'healthy',
      provider: 'in-memory',
      keysCached: 0,
      hitRate: 'N/A',
      checkedAt: new Date().toISOString(),
    };
  }

  getStorageStatus() {
    return {
      status: 'healthy',
      provider: 'local',
      available: true,
      checkedAt: new Date().toISOString(),
    };
  }

  async getPerformance() {
    return statsService.getSystemPerformance();
  }

  _formatUptime(seconds) {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
  }
}

export default new SystemService();
