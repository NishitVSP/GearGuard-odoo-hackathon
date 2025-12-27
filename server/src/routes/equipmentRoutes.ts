import { Router } from 'express';
import equipmentController from '../controllers/equipmentController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validator';
import { body, param } from 'express-validator';

const router = Router();

// All equipment routes require authentication
router.use(authMiddleware);

// GET /api/equipment/meta/categories - Get categories (must be before /:id)
router.get('/meta/categories', equipmentController.getCategories);

// GET /api/equipment - Get all equipment with filters
router.get('/', equipmentController.getAllEquipment);

// GET /api/equipment/:id - Get equipment by ID
router.get('/:id', equipmentController.getEquipmentById);

// POST /api/equipment - Create new equipment
router.post(
  '/',
  [
    body('name').notEmpty().isLength({ min: 1, max: 255 }).withMessage('Name is required (1-255 chars)'),
    body('equipment_code').notEmpty().isLength({ min: 1, max: 100 }).withMessage('Equipment code is required (1-100 chars)'),
    body('category_id').isInt({ min: 1 }).withMessage('Valid category ID is required'),
    body('assigned_team_id').isInt({ min: 1 }).withMessage('Valid team ID is required'),
    body('status').optional().isString().withMessage('Status must be a string'),
  ],
  validate,
  equipmentController.createEquipment
);

// PUT /api/equipment/:id - Update equipment
router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Valid equipment ID is required'),
    body('name').optional().isLength({ min: 1, max: 255 }).withMessage('Name must be 1-255 chars'),
    body('equipment_code').optional().isLength({ min: 1, max: 100 }).withMessage('Equipment code must be 1-100 chars'),
    body('category_id').optional().isInt({ min: 1 }).withMessage('Category ID must be valid'),
    body('status').optional().isString().withMessage('Status must be a string'),
  ],
  validate,
  equipmentController.updateEquipment
);

// DELETE /api/equipment/:id - Delete equipment
router.delete('/:id', equipmentController.deleteEquipment);

export default router;
