// src/controllers/requestController.ts

import { Request, Response, NextFunction } from 'express';
import { getPool } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { AuthRequest } from '../middleware/authMiddleware';
import { CreateRequestRequest, UpdateRequestRequest } from '../types/request.types';

export class RequestController {

    // Get all requests grouped by stage (for Kanban)
    static async getKanbanRequests(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const pool = getPool();

            const [requests] = await pool.query<RowDataPacket[]>(
                `SELECT 
          mr.id,
          mr.request_number,
          mr.subject,
          mr.description,
          mr.request_type,
          mr.stage,
          mr.priority,
          mr.scheduled_date,
          mr.scheduled_time,
          mr.deadline,
          mr.created_at,
          e.name as equipment_name,
          e.equipment_code,
          u.name as technician_name,
          u.avatar_url as technician_avatar
        FROM maintenance_requests mr
        INNER JOIN equipment e ON mr.equipment_id = e.id
        LEFT JOIN users u ON mr.assigned_technician_id = u.id
        ORDER BY 
          FIELD(mr.stage, 'new', 'in_progress', 'repaired', 'scrap'),
          mr.created_at DESC`
            );

            // Group by stage
            const grouped = {
                new: requests.filter(r => r.stage === 'new'),
                in_progress: requests.filter(r => r.stage === 'in_progress'),
                repaired: requests.filter(r => r.stage === 'repaired'),
                scrap: requests.filter(r => r.stage === 'scrap')
            };

            res.status(200).json({
                status: 'success',
                data: grouped
            });

        } catch (error) {
            next(error);
        }
    }

    // Get calendar events
    static async getCalendarEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { year, month } = req.query;
            const pool = getPool();

            let query = `
        SELECT 
          mr.id,
          mr.request_number,
          mr.subject,
          mr.request_type,
          mr.scheduled_date,
          mr.scheduled_time,
          mr.stage,
          mr.priority,
          e.name as equipment_name,
          u.name as technician_name
        FROM maintenance_requests mr
        INNER JOIN equipment e ON mr.equipment_id = e.id
        LEFT JOIN users u ON mr.assigned_technician_id = u.id
        WHERE mr.scheduled_date IS NOT NULL
      `;

            const params: any[] = [];

            if (year && month) {
                query += ` AND YEAR(mr.scheduled_date) = ? AND MONTH(mr.scheduled_date) = ?`;
                params.push(year, month);
            }

            query += ` ORDER BY mr.scheduled_date ASC, mr.scheduled_time ASC`;

            const [requests] = await pool.query<RowDataPacket[]>(query, params);

            const events = requests.map(req => ({
                id: req.request_number,
                equipment: req.equipment_name,
                subject: req.subject,
                type: req.request_type,
                scheduledDate: req.scheduled_date,
                scheduledTime: req.scheduled_time || '00:00',
                technician: req.technician_name || 'Unassigned',
                stage: req.stage,
                priority: req.priority
            }));

            res.status(200).json({
                status: 'success',
                data: events
            });

        } catch (error) {
            next(error);
        }
    }

    // Create new maintenance request
    static async createRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const {
                subject,
                description,
                request_type,
                equipment_id,
                assigned_technician_id,
                priority = 'medium',
                scheduled_date,
                scheduled_time,
                deadline
            }: CreateRequestRequest = req.body;

            const userId = req.userId;
            const pool = getPool();

            // Get equipment details
            const [equipment] = await pool.query<RowDataPacket[]>(
                `SELECT id, category_id, assigned_team_id, assigned_technician_id 
         FROM equipment WHERE id = ?`,
                [equipment_id]
            );

            if (equipment.length === 0) {
                throw new AppError('Equipment not found', 404);
            }

            const equipmentData = equipment[0];

            // Generate request number
            const [lastRequest] = await pool.query<RowDataPacket[]>(
                'SELECT request_number FROM maintenance_requests ORDER BY id DESC LIMIT 1'
            );

            let requestNumber = 'REQ-2025-001';
            if (lastRequest.length > 0) {
                const lastNum = parseInt(lastRequest[0].request_number.split('-')[2]);
                requestNumber = `REQ-2025-${String(lastNum + 1).padStart(3, '0')}`;
            }

            // Insert request
            const [result] = await pool.query<ResultSetHeader>(
                `INSERT INTO maintenance_requests (
          request_number, subject, description, request_type, equipment_id,
          equipment_category_id, maintenance_team_id, assigned_technician_id,
          priority, scheduled_date, scheduled_time, deadline, requested_by_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    requestNumber,
                    subject,
                    description || null,
                    request_type,
                    equipment_id,
                    equipmentData.category_id,
                    equipmentData.assigned_team_id,
                    assigned_technician_id || equipmentData.assigned_technician_id,
                    priority,
                    scheduled_date || null,
                    scheduled_time || null,
                    deadline || null,
                    userId
                ]
            );

            // Fetch created request with details
            const [newRequest] = await pool.query<RowDataPacket[]>(
                `SELECT mr.*, e.name as equipment_name, u.name as technician_name
         FROM maintenance_requests mr
         INNER JOIN equipment e ON mr.equipment_id = e.id
         LEFT JOIN users u ON mr.assigned_technician_id = u.id
         WHERE mr.id = ?`,
                [result.insertId]
            );

            res.status(201).json({
                status: 'success',
                message: 'Maintenance request created successfully',
                data: newRequest[0]
            });

        } catch (error) {
            next(error);
        }
    }

    // Update request
    static async updateRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const updateData: UpdateRequestRequest = req.body;
            const pool = getPool();

            // Check if request exists
            const [requests] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM maintenance_requests WHERE id = ?',
                [id]
            );

            if (requests.length === 0) {
                throw new AppError('Request not found', 404);
            }

            // Build dynamic update query
            const updates: string[] = [];
            const values: any[] = [];

            if (updateData.subject) {
                updates.push('subject = ?');
                values.push(updateData.subject);
            }
            if (updateData.description !== undefined) {
                updates.push('description = ?');
                values.push(updateData.description);
            }
            if (updateData.assigned_technician_id !== undefined) {
                updates.push('assigned_technician_id = ?');
                values.push(updateData.assigned_technician_id);
            }
            if (updateData.priority) {
                updates.push('priority = ?');
                values.push(updateData.priority);
            }
            if (updateData.scheduled_date !== undefined) {
                updates.push('scheduled_date = ?');
                values.push(updateData.scheduled_date);
            }
            if (updateData.scheduled_time !== undefined) {
                updates.push('scheduled_time = ?');
                values.push(updateData.scheduled_time);
            }
            if (updateData.deadline !== undefined) {
                updates.push('deadline = ?');
                values.push(updateData.deadline);
            }
            if (updateData.technician_notes !== undefined) {
                updates.push('technician_notes = ?');
                values.push(updateData.technician_notes);
            }
            if (updateData.scrap_reason !== undefined) {
                updates.push('scrap_reason = ?');
                values.push(updateData.scrap_reason);
            }

            if (updates.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            values.push(id);

            await pool.query(
                `UPDATE maintenance_requests SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            // Fetch updated request
            const [updatedRequest] = await pool.query<RowDataPacket[]>(
                `SELECT mr.*, e.name as equipment_name, u.name as technician_name
         FROM maintenance_requests mr
         INNER JOIN equipment e ON mr.equipment_id = e.id
         LEFT JOIN users u ON mr.assigned_technician_id = u.id
         WHERE mr.id = ?`,
                [id]
            );

            res.status(200).json({
                status: 'success',
                message: 'Request updated successfully',
                data: updatedRequest[0]
            });

        } catch (error) {
            next(error);
        }
    }

    // Update request stage (for Kanban drag-drop)
    static async updateRequestStage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { stage, notes } = req.body;
            const userId = req.userId;
            const pool = getPool();

            // Get current stage
            const [requests] = await pool.query<RowDataPacket[]>(
                'SELECT stage FROM maintenance_requests WHERE id = ?',
                [id]
            );

            if (requests.length === 0) {
                throw new AppError('Request not found', 404);
            }

            const oldStage = requests[0].stage;

            // Update stage and timestamps
            const updates: string[] = ['stage = ?'];
            const values: any[] = [stage];

            if (stage === 'in_progress' && oldStage === 'new') {
                updates.push('started_at = NOW()');
            }

            if ((stage === 'repaired' || stage === 'scrap') && oldStage !== 'repaired' && oldStage !== 'scrap') {
                updates.push('completed_at = NOW()');
            }

            values.push(id);

            await pool.query(
                `UPDATE maintenance_requests SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            // Log stage change
            await pool.query(
                `INSERT INTO request_stage_history 
         (request_id, from_stage, to_stage, changed_by_id, notes)
         VALUES (?, ?, ?, ?, ?)`,
                [id, oldStage, stage, userId, notes || null]
            );

            // Fetch updated request
            const [updatedRequest] = await pool.query<RowDataPacket[]>(
                `SELECT mr.*, e.name as equipment_name, u.name as technician_name
         FROM maintenance_requests mr
         INNER JOIN equipment e ON mr.equipment_id = e.id
         LEFT JOIN users u ON mr.assigned_technician_id = u.id
         WHERE mr.id = ?`,
                [id]
            );

            res.status(200).json({
                status: 'success',
                message: 'Request stage updated successfully',
                data: updatedRequest[0]
            });

        } catch (error) {
            next(error);
        }
    }

    // Delete request
    static async deleteRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const pool = getPool();

            const [requests] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM maintenance_requests WHERE id = ?',
                [id]
            );

            if (requests.length === 0) {
                throw new AppError('Request not found', 404);
            }

            await pool.query('DELETE FROM maintenance_requests WHERE id = ?', [id]);

            res.status(200).json({
                status: 'success',
                message: 'Request deleted successfully'
            });

        } catch (error) {
            next(error);
        }
    }
}
