import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { query } from '../config/database';

export interface WorkCenterRow extends RowDataPacket {
  id: number;
  name: string;
  code: string;
  category: string;
  location: string | null;
  department_id: number | null;
  department_name: string | null;
  assigned_team_id: number | null;
  assigned_team_name: string | null;
  assigned_member_id: number | null;
  assigned_member_name: string | null;
  status: 'active' | 'inactive' | 'maintenance';
  capacity: number;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateWorkCenterData {
  name: string;
  code: string;
  category: string;
  location?: string;
  department_id?: number;
  assigned_team_id?: number;
  assigned_member_id?: number;
  status?: 'active' | 'inactive' | 'maintenance';
  capacity?: number;
  description?: string;
}

export interface UpdateWorkCenterData {
  name?: string;
  code?: string;
  category?: string;
  location?: string;
  department_id?: number;
  assigned_team_id?: number;
  assigned_member_id?: number;
  status?: 'active' | 'inactive' | 'maintenance';
  capacity?: number;
  description?: string;
}

export class WorkCenterRepository {
  /**
   * Get all work centers with department and team info
   */
  async getAllWorkCenters(): Promise<WorkCenterRow[]> {
    const sql = `
      SELECT 
        wc.id,
        wc.name,
        wc.code,
        wc.category,
        wc.location,
        wc.department_id,
        d.name as department_name,
        wc.assigned_team_id,
        mt.name as assigned_team_name,
        wc.assigned_member_id,
        u.name as assigned_member_name,
        wc.status,
        wc.capacity,
        wc.description,
        wc.created_at,
        wc.updated_at
      FROM work_centers wc
      LEFT JOIN departments d ON wc.department_id = d.id
      LEFT JOIN maintenance_teams mt ON wc.assigned_team_id = mt.id
      LEFT JOIN users u ON wc.assigned_member_id = u.id
      ORDER BY wc.created_at DESC
    `;

    const results = await query<WorkCenterRow[]>(sql);
    return results;
  }

  /**
   * Get a single work center by ID
   */
  async getWorkCenterById(id: number): Promise<WorkCenterRow | null> {
    const sql = `
      SELECT 
        wc.id,
        wc.name,
        wc.code,
        wc.category,
        wc.location,
        wc.department_id,
        d.name as department_name,
        wc.assigned_team_id,
        mt.name as assigned_team_name,
        wc.assigned_member_id,
        u.name as assigned_member_name,
        wc.status,
        wc.capacity,
        wc.description,
        wc.created_at,
        wc.updated_at
      FROM work_centers wc
      LEFT JOIN departments d ON wc.department_id = d.id
      LEFT JOIN maintenance_teams mt ON wc.assigned_team_id = mt.id
      LEFT JOIN users u ON wc.assigned_member_id = u.id
      WHERE wc.id = ?
    `;

    const results = await query<WorkCenterRow[]>(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Get work center utilization (based on open requests for equipment in that work center)
   */
  async getWorkCenterUtilization(id: number): Promise<number> {
    const sql = `
      SELECT 
        wc.capacity,
        COALESCE(COUNT(DISTINCT mr.id), 0) as open_requests
      FROM work_centers wc
      LEFT JOIN equipment e ON e.location LIKE CONCAT('%', wc.location, '%')
      LEFT JOIN maintenance_requests mr ON mr.equipment_id = e.id 
        AND mr.stage IN ('new', 'in_progress')
      WHERE wc.id = ?
      GROUP BY wc.id, wc.capacity
    `;

    const results = await query<RowDataPacket[]>(sql, [id]);
    if (results.length === 0) return 0;

    const { capacity, open_requests } = results[0];
    const utilization = capacity > 0 ? (open_requests / capacity) * 100 : 0;
    return Math.min(100, Math.round(utilization));
  }

  /**
   * Create a new work center
   */
  async createWorkCenter(data: CreateWorkCenterData): Promise<number> {
    const sql = `
      INSERT INTO work_centers (
        name, code, category, location, department_id, 
        assigned_team_id, assigned_member_id, status, capacity, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.name,
      data.code,
      data.category,
      data.location || null,
      data.department_id || null,
      data.assigned_team_id || null,
      data.assigned_member_id || null,
      data.status || 'active',
      data.capacity || 100,
      data.description || null,
    ];

    const result = await query<ResultSetHeader>(sql, values);
    return result.insertId;
  }

  /**
   * Update a work center
   */
  async updateWorkCenter(id: number, data: UpdateWorkCenterData): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.code !== undefined) {
      fields.push('code = ?');
      values.push(data.code);
    }
    if (data.category !== undefined) {
      fields.push('category = ?');
      values.push(data.category);
    }
    if (data.location !== undefined) {
      fields.push('location = ?');
      values.push(data.location);
    }
    if (data.department_id !== undefined) {
      fields.push('department_id = ?');
      values.push(data.department_id);
    }
    if (data.assigned_team_id !== undefined) {
      fields.push('assigned_team_id = ?');
      values.push(data.assigned_team_id);
    }
    if (data.assigned_member_id !== undefined) {
      fields.push('assigned_member_id = ?');
      values.push(data.assigned_member_id);
    }
    if (data.status !== undefined) {
      fields.push('status = ?');
      values.push(data.status);
    }
    if (data.capacity !== undefined) {
      fields.push('capacity = ?');
      values.push(data.capacity);
    }
    if (data.description !== undefined) {
      fields.push('description = ?');
      values.push(data.description);
    }

    if (fields.length === 0) return false;

    const sql = `UPDATE work_centers SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    const result = await query<ResultSetHeader>(sql, values);
    return result.affectedRows > 0;
  }

  /**
   * Delete a work center
   */
  async deleteWorkCenter(id: number): Promise<boolean> {
    const sql = 'DELETE FROM work_centers WHERE id = ?';
    const result = await query<ResultSetHeader>(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Check if work center code already exists
   */
  async isCodeExists(code: string, excludeId?: number): Promise<boolean> {
    let sql = 'SELECT COUNT(*) as count FROM work_centers WHERE code = ?';
    const params: any[] = [code];

    if (excludeId) {
      sql += ' AND id != ?';
      params.push(excludeId);
    }

    const results = await query<RowDataPacket[]>(sql, params);
    return results[0].count > 0;
  }
}

export default new WorkCenterRepository();
