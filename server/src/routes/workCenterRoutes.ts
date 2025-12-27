import { Router } from 'express';
import workCenterController from '../controllers/workCenterController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validator';
import { body, param, query } from 'express-validator';

const router = Router();

// Apply authentication to all work center routes
router.use(authMiddleware);

// Validation rules
const createWorkCenterValidation = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('code').notEmpty().trim().withMessage('Code is required'),
  body('category').notEmpty().trim().withMessage('Category is required'),
  body('location').optional().trim(),
  body('departmentId').optional().isInt().withMessage('Department ID must be an integer'),
  body('assignedTeamId').optional().isInt().withMessage('Assigned team ID must be an integer'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'maintenance'])
    .withMessage('Status must be active, inactive, or maintenance'),
  body('capacity').optional().isInt({ min: 0 }).withMessage('Capacity must be a positive integer'),
  body('description').optional().trim(),
];

const updateWorkCenterValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('code').optional().trim().notEmpty().withMessage('Code cannot be empty'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('location').optional().trim(),
  body('departmentId').optional().isInt().withMessage('Department ID must be an integer'),
  body('assignedTeamId').optional().isInt().withMessage('Assigned team ID must be an integer'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'maintenance'])
    .withMessage('Status must be active, inactive, or maintenance'),
  body('capacity').optional().isInt({ min: 0 }).withMessage('Capacity must be a positive integer'),
  body('description').optional().trim(),
];

const idValidation = [param('id').isInt({ min: 1 }).withMessage('Invalid work center ID')];

const utilizationQueryValidation = [
  query('includeUtilization')
    .optional()
    .isBoolean()
    .withMessage('includeUtilization must be a boolean'),
];

/**
 * @route   GET /api/work-centers
 * @desc    Get all work centers
 * @query   includeUtilization - Include utilization percentage (default: false)
 * @access  Private (requires authentication)
 */
router.get(
  '/',
  utilizationQueryValidation,
  validate,
  workCenterController.getAllWorkCenters.bind(workCenterController)
);

/**
 * @route   GET /api/work-centers/:id
 * @desc    Get a single work center by ID
 * @access  Private (requires authentication)
 */
router.get(
  '/:id',
  idValidation,
  validate,
  workCenterController.getWorkCenterById.bind(workCenterController)
);

/**
 * @route   POST /api/work-centers
 * @desc    Create a new work center
 * @access  Private (requires authentication)
 */
router.post(
  '/',
  createWorkCenterValidation,
  validate,
  workCenterController.createWorkCenter.bind(workCenterController)
);

/**
 * @route   PUT /api/work-centers/:id
 * @desc    Update a work center
 * @access  Private (requires authentication)
 */
router.put(
  '/:id',
  idValidation,
  updateWorkCenterValidation,
  validate,
  workCenterController.updateWorkCenter.bind(workCenterController)
);

/**
 * @route   DELETE /api/work-centers/:id
 * @desc    Delete a work center
 * @access  Private (requires authentication)
 */
router.delete(
  '/:id',
  idValidation,
  validate,
  workCenterController.deleteWorkCenter.bind(workCenterController)
);

export default router;
