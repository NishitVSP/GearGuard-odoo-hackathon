// src/controllers/teamController.ts

import { Request, Response, NextFunction } from 'express';
import { getPool } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { CreateTeamRequest, UpdateTeamRequest, AddMemberRequest } from '../types/team.types';

export class TeamController {

    // Get all teams with stats
    static async getAllTeams(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const pool = getPool();

            const [teams] = await pool.query<RowDataPacket[]>(`
        SELECT 
          mt.*,
          COUNT(DISTINCT tm.user_id) as member_count,
          COUNT(DISTINCT CASE WHEN mr.stage IN ('new', 'in_progress') THEN mr.id END) as active_requests,
          COUNT(DISTINCT CASE 
            WHEN mr.stage = 'repaired' 
            AND MONTH(mr.updated_at) = MONTH(CURRENT_DATE())
            AND YEAR(mr.updated_at) = YEAR(CURRENT_DATE())
            THEN mr.id 
          END) as completed_this_month
        FROM maintenance_teams mt
        LEFT JOIN team_members tm ON mt.id = tm.team_id
        LEFT JOIN maintenance_requests mr ON mt.id = mr.maintenance_team_id
        WHERE mt.is_active = true
        GROUP BY mt.id
        ORDER BY mt.created_at DESC
      `);

            res.status(200).json({
                status: 'success',
                data: teams
            });

        } catch (error) {
            next(error);
        }
    }

    // Get single team by ID with members
    static async getTeamById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const pool = getPool();

            // Get team details
            const [teams] = await pool.query<RowDataPacket[]>(
                `SELECT mt.*,
          COUNT(DISTINCT tm.user_id) as member_count,
          COUNT(DISTINCT CASE WHEN mr.stage IN ('new', 'in_progress') THEN mr.id END) as active_requests,
          COUNT(DISTINCT CASE 
            WHEN mr.stage = 'repaired' 
            AND MONTH(mr.updated_at) = MONTH(CURRENT_DATE())
            AND YEAR(mr.updated_at) = YEAR(CURRENT_DATE())
            THEN mr.id 
          END) as completed_this_month
        FROM maintenance_teams mt
        LEFT JOIN team_members tm ON mt.id = tm.team_id
        LEFT JOIN maintenance_requests mr ON mt.id = mr.maintenance_team_id
        WHERE mt.id = ? AND mt.is_active = true
        GROUP BY mt.id`,
                [id]
            );

            if (teams.length === 0) {
                throw new AppError('Team not found', 404);
            }

            // Get team members with their active requests count
            const [members] = await pool.query<RowDataPacket[]>(
                `SELECT 
          tm.*,
          u.name as user_name,
          u.email as user_email,
          u.role as user_role,
          u.avatar_url as user_avatar,
          COUNT(mr.id) as active_requests
        FROM team_members tm
        INNER JOIN users u ON tm.user_id = u.id
        LEFT JOIN maintenance_requests mr ON u.id = mr.assigned_technician_id 
          AND mr.stage IN ('new', 'in_progress')
        WHERE tm.team_id = ? AND u.is_active = true
        GROUP BY tm.id, u.id
        ORDER BY tm.joined_at ASC`,
                [id]
            );

            res.status(200).json({
                status: 'success',
                data: {
                    ...teams[0],
                    members
                }
            });

        } catch (error) {
            next(error);
        }
    }

    // Create new team
    static async createTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, description, team_leader_id }: CreateTeamRequest = req.body;
            const pool = getPool();

            // Check if team name already exists
            const [existing] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM maintenance_teams WHERE name = ? AND is_active = true',
                [name]
            );

            if (existing.length > 0) {
                throw new AppError('Team with this name already exists', 400);
            }

            // Insert team
            const [result] = await pool.query<ResultSetHeader>(
                'INSERT INTO maintenance_teams (name, description, team_leader_id) VALUES (?, ?, ?)',
                [name, description, team_leader_id || null]
            );

            // Fetch created team
            const [newTeam] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM maintenance_teams WHERE id = ?',
                [result.insertId]
            );

            res.status(201).json({
                status: 'success',
                message: 'Team created successfully',
                data: newTeam[0]
            });

        } catch (error) {
            next(error);
        }
    }

    // Update team
    static async updateTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const updateData: UpdateTeamRequest = req.body;
            const pool = getPool();

            // Check if team exists
            const [teams] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM maintenance_teams WHERE id = ?',
                [id]
            );

            if (teams.length === 0) {
                throw new AppError('Team not found', 404);
            }

            // Build dynamic update query
            const updates: string[] = [];
            const values: any[] = [];

            if (updateData.name !== undefined) {
                updates.push('name = ?');
                values.push(updateData.name);
            }
            if (updateData.description !== undefined) {
                updates.push('description = ?');
                values.push(updateData.description);
            }
            if (updateData.team_leader_id !== undefined) {
                updates.push('team_leader_id = ?');
                values.push(updateData.team_leader_id);
            }
            if (updateData.is_active !== undefined) {
                updates.push('is_active = ?');
                values.push(updateData.is_active);
            }

            if (updates.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            values.push(id);

            await pool.query(
                `UPDATE maintenance_teams SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            // Fetch updated team
            const [updatedTeam] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM maintenance_teams WHERE id = ?',
                [id]
            );

            res.status(200).json({
                status: 'success',
                message: 'Team updated successfully',
                data: updatedTeam[0]
            });

        } catch (error) {
            next(error);
        }
    }

    // Delete team (soft delete)
    static async deleteTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const pool = getPool();

            // Check if team exists
            const [teams] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM maintenance_teams WHERE id = ?',
                [id]
            );

            if (teams.length === 0) {
                throw new AppError('Team not found', 404);
            }

            // Soft delete (set is_active to false)
            await pool.query(
                'UPDATE maintenance_teams SET is_active = false WHERE id = ?',
                [id]
            );

            res.status(200).json({
                status: 'success',
                message: 'Team deleted successfully'
            });

        } catch (error) {
            next(error);
        }
    }

    // Add member to team
    static async addMember(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { user_id }: AddMemberRequest = req.body;
            const pool = getPool();

            // Check if team exists
            const [teams] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM maintenance_teams WHERE id = ? AND is_active = true',
                [id]
            );

            if (teams.length === 0) {
                throw new AppError('Team not found', 404);
            }

            // Check if user exists
            const [users] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM users WHERE id = ? AND is_active = true',
                [user_id]
            );

            if (users.length === 0) {
                throw new AppError('User not found', 404);
            }

            // Check if user is already a member
            const [existing] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM team_members WHERE team_id = ? AND user_id = ?',
                [id, user_id]
            );

            if (existing.length > 0) {
                throw new AppError('User is already a member of this team', 400);
            }

            // Add member
            await pool.query<ResultSetHeader>(
                'INSERT INTO team_members (team_id, user_id) VALUES (?, ?)',
                [id, user_id]
            );

            // Fetch member details
            const [member] = await pool.query<RowDataPacket[]>(
                `SELECT tm.*, u.name as user_name, u.email as user_email, 
                u.role as user_role, u.avatar_url as user_avatar
         FROM team_members tm
         INNER JOIN users u ON tm.user_id = u.id
         WHERE tm.team_id = ? AND tm.user_id = ?`,
                [id, user_id]
            );

            res.status(201).json({
                status: 'success',
                message: 'Member added successfully',
                data: member[0]
            });

        } catch (error) {
            next(error);
        }
    }

    // Remove member from team
    static async removeMember(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id, memberId } = req.params;
            const pool = getPool();

            // Check if membership exists
            const [members] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM team_members WHERE team_id = ? AND user_id = ?',
                [id, memberId]
            );

            if (members.length === 0) {
                throw new AppError('Member not found in this team', 404);
            }

            // Remove member
            await pool.query(
                'DELETE FROM team_members WHERE team_id = ? AND user_id = ?',
                [id, memberId]
            );

            res.status(200).json({
                status: 'success',
                message: 'Member removed successfully'
            });

        } catch (error) {
            next(error);
        }
    }

    // Get available users to add to team
    static async getAvailableUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const pool = getPool();

            const [users] = await pool.query<RowDataPacket[]>(
                `SELECT u.id, u.name, u.email, u.role, u.avatar_url
         FROM users u
         WHERE u.is_active = true
         AND u.id NOT IN (
           SELECT user_id FROM team_members WHERE team_id = ?
         )
         ORDER BY u.name ASC`,
                [id]
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
