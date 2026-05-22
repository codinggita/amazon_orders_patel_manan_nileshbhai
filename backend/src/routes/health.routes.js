import { Router } from 'express';

const router = Router();

/**
 * Health Check Route
 * @route GET /api/v1/health
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
