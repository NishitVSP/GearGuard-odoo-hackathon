// C:\Users\Lenovo\Desktop\programming\gearguard\server\src\routes\index.ts

import { Router } from 'express';
import dashboardRoutes from './dashboardRoutes';
import teamRoutes from './teamRoutes';
import authRoutes from './authRoutes';
import equipmentRoutes from './equipmentRoutes';
import workCenterRoutes from './workCenterRoutes';
import requestRoutes from './requestRoutes';
import userRoutes from './userRoutes';
import healthRoutes from './healthRoutes';

const router = Router();

// Health check routes (no auth required)
router.use('/', healthRoutes);

// Authentication routes (no auth required)
router.use('/auth', authRoutes);

// Protected routes
router.use('/dashboard', dashboardRoutes);
router.use('/equipment', equipmentRoutes);
router.use('/teams', teamRoutes);
router.use('/work-centers', workCenterRoutes);
router.use('/requests', requestRoutes);
router.use('/users', userRoutes);

// API root
router.get('/', (_req, res) => {
  res.json({ 
    message: 'GearGuard - Equipment Maintenance Management System API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      dashboard: '/api/dashboard',
      equipment: '/api/equipment',
      teams: '/api/teams',
      workCenters: '/api/work-centers',
      requests: '/api/requests',
      users: '/api/users'
    }
  });
});

export default router;
