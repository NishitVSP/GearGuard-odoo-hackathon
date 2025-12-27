// src/routes/teamRoutes.ts

import { Router } from 'express';
import { TeamController } from '../controllers/teamController';
import { authMiddleware } from '../middleware/authMiddleware';
import {
    createTeamValidation,
    updateTeamValidation,
    addMemberValidation,
    teamIdValidation,
    removeMemberValidation
} from '../middleware/teamValidation';
import { validate } from '../middleware/validator';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Team routes
router.get('/', TeamController.getAllTeams);
router.get('/:id', teamIdValidation, validate, TeamController.getTeamById);
router.post('/', createTeamValidation, validate, TeamController.createTeam);
router.put('/:id', updateTeamValidation, validate, TeamController.updateTeam);
router.delete('/:id', teamIdValidation, validate, TeamController.deleteTeam);

// Member routes
router.post('/:id/members', addMemberValidation, validate, TeamController.addMember);
router.delete('/:id/members/:memberId', removeMemberValidation, validate, TeamController.removeMember);
router.get('/:id/available-users', teamIdValidation, validate, TeamController.getAvailableUsers);

export default router;
