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

export default router;
