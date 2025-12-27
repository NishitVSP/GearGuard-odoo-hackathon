// src/controllers/authController.ts

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { getPool } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { config } from '../config';
import { SignupRequest, LoginRequest, AuthResponse } from '../types/auth.types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class AuthController {

    // Signup - Create portal user
    static async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password, name, role = 'user' }: SignupRequest = req.body;

            const pool = getPool();

            // 1. Check if email already exists
            const [existingUsers] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM users WHERE email = ?',
                [email]
            );

            if (existingUsers.length > 0) {
                throw new AppError('Email already exists. Please use a different email.', 400);
            }

            // 2. Validate password strength
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
            if (!passwordRegex.test(password)) {
                throw new AppError(
                    'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one special character (@$!%*?&#)',
                    400
                );
            }

            // 3. Hash password
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            // 4. Insert user into database (portal user role)
            const [result] = await pool.query<ResultSetHeader>(
                'INSERT INTO users (email, password_hash, name, role, is_active) VALUES (?, ?, ?, ?, ?)',
                [email, passwordHash, name, role, true]
            );

            const userId = result.insertId;

            // 5. Generate JWT token
            const token = jwt.sign(
                { userId, role },
                config.jwt.secret as string,
                { expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'] }
            );


            // 6. Return response
            const response: AuthResponse = {
                token,
                user: {
                    id: userId,
                    email,
                    name,
                    role
                }
            };

            res.status(201).json({
                status: 'success',
                message: 'User registered successfully',
                data: response
            });

        } catch (error) {
            next(error);
        }
    }

    // Login
    static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password }: LoginRequest = req.body;

            const pool = getPool();

            // 1. Check if user exists
            const [users] = await pool.query<RowDataPacket[]>(
                'SELECT id, email, password_hash, name, role, is_active FROM users WHERE email = ?',
                [email]
            );

            if (users.length === 0) {
                throw new AppError('Account does not exist', 404);
            }

            const user = users[0];

            // 2. Check if account is active
            if (!user.is_active) {
                throw new AppError('Account is deactivated. Please contact administrator.', 403);
            }

            // 3. Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);

            if (!isPasswordValid) {
                throw new AppError('Invalid password', 401);
            }

            // 4. Generate JWT token
            const token = jwt.sign(
                { userId: user.id, role: user.role },
                config.jwt.secret as string,
                { expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'] }
            );


            // 5. Return response
            const response: AuthResponse = {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            };

            res.status(200).json({
                status: 'success',
                message: 'Login successful',
                data: response
            });

        } catch (error) {
            next(error);
        }
    }

    // Forgot Password (placeholder for now)
    static async forgotPassword(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // const { email } = req.body;

            // // TODO: Implement password reset logic with token generation and email sending

            res.status(200).json({
                status: 'success',
                message: 'Password reset link has been sent to your email'
            });

        } catch (error) {
            next(error);
        }
    }
}
