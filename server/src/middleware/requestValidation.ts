// src/middleware/requestValidation.ts

import { body, param, query } from 'express-validator';

export const createRequestValidation = [
    body('subject')
        .trim()
        .notEmpty()
        .withMessage('Subject is required')
        .isLength({ max: 255 })
        .withMessage('Subject must be less than 255 characters'),

    body('request_type')
        .isIn(['corrective', 'preventive'])
        .withMessage('Request type must be corrective or preventive'),

    body('equipment_id')
        .isInt()
        .withMessage('Equipment ID must be a valid integer'),

    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'urgent'])
        .withMessage('Invalid priority'),

    body('scheduled_date')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),

    body('scheduled_time')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Invalid time format (HH:MM)')
];

export const updateStageValidation = [
    param('id')
        .isInt()
        .withMessage('Invalid request ID'),

    body('stage')
        .isIn(['new', 'in_progress', 'repaired', 'scrap'])
        .withMessage('Invalid stage')
];

export const requestIdValidation = [
    param('id')
        .isInt()
        .withMessage('Invalid request ID')
];

export const calendarQueryValidation = [
    query('year')
        .optional()
        .isInt({ min: 2020, max: 2100 })
        .withMessage('Invalid year'),

    query('month')
        .optional()
        .isInt({ min: 1, max: 12 })
        .withMessage('Invalid month')
];
