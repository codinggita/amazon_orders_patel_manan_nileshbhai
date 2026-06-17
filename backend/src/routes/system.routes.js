import { Router } from 'express';
import * as systemController from '../controllers/system.controller.js';

const router = Router();

router.get('/version', systemController.getVersion);
router.get('/config', systemController.getConfig);
router.get('/uptime', systemController.getUptime);
router.get('/ping', systemController.ping);
router.get('/status/database', systemController.getDatabaseStatus);
router.get('/status/cache', systemController.getCacheStatus);
router.get('/status/storage', systemController.getStorageStatus);

export default router;
