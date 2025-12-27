// src/routes/requestRoutes.ts

import { Router } from 'express';
import { RequestController } from '../controllers/requestController';
import { authMiddleware } from '../middleware/authMiddleware';
import {
    createRequestValidation,
    updateStageValidation,
    requestIdValidation,
    calendarQueryValidation
} from '../middleware/requestValidation';
import { validate } from '../middleware/validator';

const router = Router();

router.use(authMiddleware);

// Kanban view
router.get('/kanban', RequestController.getKanbanRequests);

// Calendar view
router.get('/calendar', calendarQueryValidation, validate, RequestController.getCalendarEvents);

// CRUD operations
router.post('/', createRequestValidation, validate, RequestController.createRequest);
router.put('/:id', requestIdValidation, validate, RequestController.updateRequest);
router.patch('/:id/stage', updateStageValidation, validate, RequestController.updateRequestStage);
router.delete('/:id', requestIdValidation, validate, RequestController.deleteRequest);

export default router;
