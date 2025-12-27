// src/controllers/equipmentController.ts

import { Request, Response, NextFunction } from 'express';
import { getPool } from '../config/database';
import { RowDataPacket } from 'mysql2';

export class EquipmentController {

    // Get all equipment (for dropdowns in forms)
    static async getAllEquipment(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const pool = getPool();

            const [equipment] = await pool.query<RowDataPacket[]>(
                `SELECT 
          e.id,
          e.equipment_code,
          e.name,
          e.serial_number,
          e.status,
          ec.name as category_name,
          mt.name as team_name,
          mt.id as team_id,
          u.id as technician_id,
          u.name as technician_name
        FROM equipment e
        LEFT JOIN equipment_categories ec ON e.category_id = ec.id
        LEFT JOIN maintenance_teams mt ON e.assigned_team_id = mt.id
        LEFT JOIN users u ON e.assigned_technician_id = u.id
        WHERE e.status != 'scrapped'
        ORDER BY e.name ASC`
            );

            res.status(200).json({
                status: 'success',
                data: equipment
            });

        } catch (error) {
            next(error);
        }
    }

    // Get equipment by ID (includes team and technician info)
    static async getEquipmentById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const pool = getPool();

            const [equipment] = await pool.query<RowDataPacket[]>(
                `SELECT 
          e.*,
          ec.name as category_name,
          mt.id as team_id,
          mt.name as team_name,
          u.id as technician_id,
          u.name as technician_name
        FROM equipment e
        LEFT JOIN equipment_categories ec ON e.category_id = ec.id
        LEFT JOIN maintenance_teams mt ON e.assigned_team_id = mt.id
        LEFT JOIN users u ON e.assigned_technician_id = u.id
        WHERE e.id = ?`,
                [id]
            );

            if (equipment.length === 0) {
                res.status(404).json({
                    status: 'error',
                    message: 'Equipment not found'
                });
                return;
            }

            res.status(200).json({
                status: 'success',
                data: equipment[0]
            });

        } catch (error) {
            next(error);
        }
    }
}
