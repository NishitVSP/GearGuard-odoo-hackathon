// C:\Users\Lenovo\Desktop\programming\gearguard\server\src\routes\index.ts

import { Router } from 'express';
import dashboardRoutes from './dashboardRoutes';
import authRoutes from './authRoutes';
import teamRoutes from './teamRoutes';
import requestRoutes from './requestRoutes';
import equipmentRoutes from './equipmentRoutes';
import userRoutes from './userRoutes';
const router = Router();

// Import routes (to be implemented)
// import equipmentRoutes from './equipmentRoutes';
// import teamRoutes from './teamRoutes';
// import requestRoutes from './requestRoutes';
// import reportRoutes from './reportRoutes';

// Use routes
router.use('/dashboard', dashboardRoutes);
// router.use('/equipment', equipmentRoutes);
router.use('/auth', authRoutes);
router.use('/teams', teamRoutes);
router.use('/requests', requestRoutes);
router.use('/equipment', equipmentRoutes);
router.use('/users', userRoutes);
// router.use('/reports', reportRoutes);

// Placeholder endpoint
router.get('/', (_req, res) => {
  res.json({ message: 'GearGuard API v1.0.0' });
});

export default router;
