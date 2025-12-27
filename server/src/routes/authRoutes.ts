// src/routes/authRoutes.ts

import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { signupValidation, loginValidation, forgotPasswordValidation } from '../middleware/authValidation';
import { validate } from '../middleware/validator';

const router = Router();

router.post('/signup', signupValidation, validate, AuthController.signup);
router.post('/login', loginValidation, validate, AuthController.login);
router.post('/forgot-password', forgotPasswordValidation, validate, AuthController.forgotPassword);

export default router;
