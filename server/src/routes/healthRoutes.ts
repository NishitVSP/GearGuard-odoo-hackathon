import { Router } from 'express';
import { HealthController } from '../controllers/healthController';

const router = Router();

// Health check endpoints (no authentication required)
router.get('/health', HealthController.healthCheck);
router.get('/ping', HealthController.ping);
router.get('/system', HealthController.systemInfo);

export default router;
