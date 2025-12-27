import { Router } from 'express';
import dashboardController from '../controllers/dashboardController';
import { validate } from '../middleware/validator';
import { query } from 'express-validator';

const router = Router();

// Validation rules for limit query parameter
const limitValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be an integer between 1 and 50'),
];

/**
 * @route   GET /api/dashboard-test/stats
 * @desc    Get dashboard statistics with trends (NO AUTH for testing)
 * @access  Public (for testing only)
 */
router.get('/stats', dashboardController.getStats.bind(dashboardController));

/**
 * @route   GET /api/dashboard-test/recent-requests
 * @desc    Get recent maintenance requests (NO AUTH for testing)
 * @access  Public (for testing only)
 */
router.get(
  '/recent-requests',
  limitValidation,
  validate,
  dashboardController.getRecentRequests.bind(dashboardController)
);

/**
 * @route   GET /api/dashboard-test/upcoming-maintenance
 * @desc    Get upcoming scheduled maintenance (NO AUTH for testing)
 * @access  Public (for testing only)
 */
router.get(
  '/upcoming-maintenance',
  limitValidation,
  validate,
  dashboardController.getUpcomingMaintenance.bind(dashboardController)
);

export default router;
