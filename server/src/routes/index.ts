// C:\Users\Lenovo\Desktop\programming\gearguard\server\src\routes\index.ts

import { Router } from 'express';
import dashboardRoutes from './dashboardRoutes';
import teamRoutes from './teamRoutes';
import authRoutes from './authRoutes';
import equipmentRoutes from './equipmentRoutes';
import workCenterRoutes from './workCenterRoutes';
const router = Router();

// Import routes (to be implemented)
// import teamRoutes from './teamRoutes';
// import requestRoutes from './requestRoutes';
// import reportRoutes from './reportRoutes';

// Use routes
router.use('/dashboard', dashboardRoutes);
router.use('/equipment', equipmentRoutes);
router.use('/teams', teamRoutes);
router.use('/work-centers', workCenterRoutes);
// router.use('/requests', requestRoutes);
router.use('/auth', authRoutes);
// router.use('/reports', reportRoutes);

// Placeholder endpoint
router.get('/', (_req, res) => {
  res.json({ message: 'GearGuard API v1.0.0' });
});

export default router;
