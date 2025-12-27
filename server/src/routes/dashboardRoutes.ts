import { Router } from 'express';
import dashboardController from '../controllers/dashboardController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validator';
import { query } from 'express-validator';

const router = Router();

// Apply authentication to all dashboard routes
router.use(authMiddleware);

// Validation rules for limit query parameter
const limitValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be an integer between 1 and 50'),
];

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard statistics with trends
 * @access  Private (requires authentication)
 */
router.get('/stats', dashboardController.getStats.bind(dashboardController));

/**
 * @route   GET /api/dashboard/recent-requests
 * @desc    Get recent maintenance requests
 * @query   limit - Number of requests to return (default: 5, max: 50)
 * @access  Private (requires authentication)
 */
router.get(
  '/recent-requests',
  limitValidation,
  validate,
  dashboardController.getRecentRequests.bind(dashboardController)
);

/**
 * @route   GET /api/dashboard/upcoming-maintenance
 * @desc    Get upcoming scheduled maintenance
 * @query   limit - Number of maintenance items to return (default: 5, max: 50)
 * @access  Private (requires authentication)
 */
router.get(
  '/upcoming-maintenance',
  limitValidation,
  validate,
  dashboardController.getUpcomingMaintenance.bind(dashboardController)
);

/**
 * @route   GET /api/dashboard/critical-equipment
 * @desc    Get critical equipment with health < 30%
 * @access  Private (requires authentication)
 */
router.get('/critical-equipment', dashboardController.getCriticalEquipment.bind(dashboardController));

/**
 * @route   GET /api/dashboard/technician-load
 * @desc    Get technician workload statistics
 * @access  Private (requires authentication)
 */
router.get('/technician-load', dashboardController.getTechnicianLoad.bind(dashboardController));

/**
 * @route   GET /api/dashboard/open-requests
 * @desc    Get open requests summary (pending and overdue)
 * @access  Private (requires authentication)
 */
router.get('/open-requests', dashboardController.getOpenRequestsSummary.bind(dashboardController));

export default router;
