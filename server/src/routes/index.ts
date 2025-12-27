import { Router } from 'express';
import dashboardRoutes from './dashboardRoutes';
import dashboardTestRoutes from './dashboardTestRoutes';

const router = Router();

// Import routes (to be implemented)
// import equipmentRoutes from './equipmentRoutes';
// import teamRoutes from './teamRoutes';
// import requestRoutes from './requestRoutes';
// import authRoutes from './authRoutes';
// import reportRoutes from './reportRoutes';

// Use routes
router.use('/dashboard', dashboardRoutes);
router.use('/dashboard-test', dashboardTestRoutes); // Test routes without auth
// router.use('/equipment', equipmentRoutes);
// router.use('/teams', teamRoutes);
// router.use('/requests', requestRoutes);
// router.use('/auth', authRoutes);
// router.use('/reports', reportRoutes);

// Placeholder endpoint
router.get('/', (_req, res) => {
  res.json({ message: 'GearGuard API v1.0.0' });
});

export default router;
