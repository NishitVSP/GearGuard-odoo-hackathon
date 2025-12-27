// src/controllers/userController.ts

import { Request, Response, NextFunction } from 'express';
import { getPool } from '../config/database';
import { RowDataPacket } from 'mysql2';

export class UserController {

    // Get all technicians (for dropdowns)
    static async getTechnicians(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const pool = getPool();

            const [users] = await pool.query<RowDataPacket[]>(
                `SELECT 
          u.id,
          u.name,
          u.email,
          u.role,
          u.avatar_url,
          GROUP_CONCAT(DISTINCT mt.name) as teams
        FROM users u
        LEFT JOIN team_members tm ON u.id = tm.user_id
        LEFT JOIN maintenance_teams mt ON tm.team_id = mt.id
        WHERE u.is_active = true 
        AND u.role IN ('technician', 'manager')
        GROUP BY u.id
        ORDER BY u.name ASC`
            );

            res.status(200).json({
                status: 'success',
                data: users
            });

        } catch (error) {
            next(error);
        }
    }
}
