// src/routes/equipmentRoutes.ts

import { Router } from 'express';
import { EquipmentController } from '../controllers/equipmentController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', EquipmentController.getAllEquipment);
router.get('/:id', EquipmentController.getEquipmentById);

export default router;
