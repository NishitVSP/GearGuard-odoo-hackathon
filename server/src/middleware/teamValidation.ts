// src/middleware/teamValidation.ts

import { body, param } from 'express-validator';

export const createTeamValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Team name is required')
        .isLength({ min: 2, max: 255 })
        .withMessage('Team name must be between 2 and 255 characters'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),

    body('team_leader_id')
        .optional()
        .isInt()
        .withMessage('Team leader ID must be a valid integer')
];

export const updateTeamValidation = [
    param('id')
        .isInt()
        .withMessage('Invalid team ID'),

    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('Team name must be between 2 and 255 characters'),

    body('description')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Description cannot be empty'),

    body('team_leader_id')
        .optional()
        .isInt()
        .withMessage('Team leader ID must be a valid integer'),

    body('is_active')
        .optional()
        .isBoolean()
        .withMessage('is_active must be a boolean')
];

export const addMemberValidation = [
    param('id')
        .isInt()
        .withMessage('Invalid team ID'),

    body('user_id')
        .isInt()
        .withMessage('User ID must be a valid integer')
];

export const teamIdValidation = [
    param('id')
        .isInt()
        .withMessage('Invalid team ID')
];

export const removeMemberValidation = [
    param('id')
        .isInt()
        .withMessage('Invalid team ID'),

    param('memberId')
        .isInt()
        .withMessage('Invalid member ID')
];
