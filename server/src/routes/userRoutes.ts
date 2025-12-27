// src/routes/userRoutes.ts

import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/technicians', UserController.getTechnicians);

export default router;
