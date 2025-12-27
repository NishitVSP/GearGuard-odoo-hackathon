import { RowDataPacket } from 'mysql2';
import { query } from '../config/database';

interface DashboardStats {
  totalEquipment: number;
  activeRequests: number;
  completedToday: number;
  overdue: number;
}

interface RecentRequestRow extends RowDataPacket {
  id: number;
  request_number: string;
  subject: string;
  description: string;
  equipment_id: number;
  equipment_name: string;
  equipment_code: string;
  stage: string;
  priority: string;
  request_type: string;
  scheduled_date: Date | null;
  deadline: Date | null;
  started_at: Date | null;
  completed_at: Date | null;
  duration_hours: number | null;
  assigned_technician_id: number | null;
  technician_name: string | null;
  requested_by_id: number;
  requester_name: string;
  created_at: Date;
  updated_at: Date;
}

interface UpcomingMaintenanceRow extends RowDataPacket {
  id: number;
  request_number: string;
  subject: string;
  equipment_id: number;
  equipment_name: string;
  equipment_code: string;
  scheduled_date: Date;
  scheduled_time: string | null;
  request_type: string;
  assigned_technician_id: number | null;
  technician_name: string | null;
}

interface CriticalEquipmentRow extends RowDataPacket {
  id: number;
  equipment_code: string;
  name: string;
  health_percentage: number;
  status: string;
  last_maintenance_date: Date | null;
}

interface TechnicianLoadRow extends RowDataPacket {
  technician_id: number;
  technician_name: string;
  active_requests: number;
  total_capacity: number;
  utilization_percentage: number;
}

export class DashboardRepository {
  /**
   * Get critical equipment with health < 30%
   * Health is calculated based on: status, days since last maintenance, and overdue maintenance requests
   */
  async getCriticalEquipment(): Promise<CriticalEquipmentRow[]> {
    const sql = `
      SELECT 
        e.id,
        e.equipment_code,
        e.name,
        e.status,
        MAX(mr.completed_at) as last_maintenance_date,
        -- Calculate health based on multiple factors
        CASE 
          WHEN e.status = 'broken' THEN 10
          WHEN e.status = 'scrapped' THEN 0
          WHEN e.status = 'under_maintenance' THEN 40
          ELSE GREATEST(0, 100 - 
            -- Subtract points for days since last maintenance (max 30 points)
            LEAST(30, COALESCE(DATEDIFF(CURDATE(), MAX(mr.completed_at)), 90) / 3) -
            -- Subtract points for open requests (10 points each, max 20)
            LEAST(20, COUNT(CASE WHEN mr.stage IN ('new', 'in_progress') THEN 1 END) * 10) -
            -- Subtract points for overdue requests (15 points each, max 30)
            LEAST(30, COUNT(CASE WHEN mr.deadline < CURDATE() AND mr.stage NOT IN ('repaired', 'scrap') THEN 1 END) * 15)
          )
        END as health_percentage
      FROM equipment e
      LEFT JOIN maintenance_requests mr ON e.id = mr.equipment_id
      WHERE e.status != 'scrapped'
      GROUP BY e.id, e.equipment_code, e.name, e.status
      HAVING health_percentage < 30
      ORDER BY health_percentage ASC
      LIMIT 10
    `;
    
    return await query<CriticalEquipmentRow[]>(sql);
  }

  /**
   * Get technician workload statistics
   */
  async getTechnicianLoad(): Promise<TechnicianLoadRow[]> {
    const sql = `
      SELECT 
        u.id as technician_id,
        u.name as technician_name,
        COUNT(CASE WHEN mr.stage IN ('new', 'in_progress') THEN 1 END) as active_requests,
        8 as total_capacity,
        ROUND((COUNT(CASE WHEN mr.stage IN ('new', 'in_progress') THEN 1 END) / 8.0) * 100) as utilization_percentage
      FROM users u
      LEFT JOIN maintenance_requests mr ON u.id = mr.assigned_technician_id
      WHERE u.role = 'technician' AND u.is_active = TRUE
      GROUP BY u.id, u.name
      ORDER BY utilization_percentage DESC
    `;
    
    return await query<TechnicianLoadRow[]>(sql);
  }

  /**
   * Get open requests summary (pending and overdue)
   */
  async getOpenRequestsSummary(): Promise<{ pending: number; overdue: number }> {
    const sql = `
      SELECT 
        COUNT(CASE WHEN stage IN ('new', 'in_progress') AND (deadline IS NULL OR deadline >= CURDATE()) THEN 1 END) as pending,
        COUNT(CASE WHEN deadline < CURDATE() AND stage NOT IN ('repaired', 'scrap') THEN 1 END) as overdue
      FROM maintenance_requests
    `;
    
    const result = await query<RowDataPacket[]>(sql);
    return {
      pending: result[0]?.pending || 0,
      overdue: result[0]?.overdue || 0
    };
  }

  /**
   * Get today's dashboard statistics
   */
  async getTodayStats(): Promise<DashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    // Total equipment count
    const totalEquipmentQuery = `
      SELECT COUNT(*) as count 
      FROM equipment 
      WHERE status IN ('operational', 'under_maintenance', 'broken')
    `;

    // Active requests (new, in_progress stages)
    const activeRequestsQuery = `
      SELECT COUNT(*) as count 
      FROM maintenance_requests 
      WHERE stage IN ('new', 'in_progress')
    `;

    // Completed today
    const completedTodayQuery = `
      SELECT COUNT(*) as count 
      FROM maintenance_requests 
      WHERE stage = 'repaired' 
        AND DATE(completed_at) = ?
    `;

    // Overdue requests (deadline passed and not completed)
    const overdueQuery = `
      SELECT COUNT(*) as count 
      FROM maintenance_requests 
      WHERE deadline < CURDATE() 
        AND stage NOT IN ('repaired', 'scrap')
    `;

    const totalEquipmentResult = await query<RowDataPacket[]>(totalEquipmentQuery);
    const activeRequestsResult = await query<RowDataPacket[]>(activeRequestsQuery);
    const completedTodayResult = await query<RowDataPacket[]>(completedTodayQuery, [todayStr]);
    const overdueResult = await query<RowDataPacket[]>(overdueQuery);

    return {
      totalEquipment: totalEquipmentResult[0]?.count || 0,
      activeRequests: activeRequestsResult[0]?.count || 0,
      completedToday: completedTodayResult[0]?.count || 0,
      overdue: overdueResult[0]?.count || 0,
    };
  }

  /**
   * Get yesterday's dashboard statistics for trend calculation
   */
  async getYesterdayStats(): Promise<DashboardStats> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    // Total equipment at end of yesterday (created before today)
    const totalEquipmentQuery = `
      SELECT COUNT(*) as count 
      FROM equipment 
      WHERE status IN ('operational', 'under_maintenance', 'broken')
        AND DATE(created_at) < ?
    `;

    // Active requests at end of yesterday
    const activeRequestsQuery = `
      SELECT COUNT(*) as count 
      FROM maintenance_requests 
      WHERE stage IN ('new', 'in_progress')
        AND DATE(created_at) <= ?
        AND (completed_at IS NULL OR DATE(completed_at) > ?)
    `;

    // Completed yesterday
    const completedYesterdayQuery = `
      SELECT COUNT(*) as count 
      FROM maintenance_requests 
      WHERE stage = 'repaired' 
        AND DATE(completed_at) = ?
    `;

    // Overdue at end of yesterday
    const overdueQuery = `
      SELECT COUNT(*) as count 
      FROM maintenance_requests 
      WHERE deadline < ? 
        AND stage NOT IN ('repaired', 'scrap')
        AND DATE(created_at) <= ?
    `;

    const totalEquipmentResult = await query<RowDataPacket[]>(totalEquipmentQuery, [todayStr]);
    const activeRequestsResult = await query<RowDataPacket[]>(activeRequestsQuery, [yesterdayStr, yesterdayStr]);
    const completedYesterdayResult = await query<RowDataPacket[]>(completedYesterdayQuery, [yesterdayStr]);
    const overdueResult = await query<RowDataPacket[]>(overdueQuery, [todayStr, yesterdayStr]);

    return {
      totalEquipment: totalEquipmentResult[0]?.count || 0,
      activeRequests: activeRequestsResult[0]?.count || 0,
      completedToday: completedYesterdayResult[0]?.count || 0,
      overdue: overdueResult[0]?.count || 0,
    };
  }

  /**
   * Get recent maintenance requests with equipment and user details
   */
  async getRecentRequests(limit: number = 5): Promise<RecentRequestRow[]> {
    const sql = `
      SELECT 
        mr.id,
        mr.request_number,
        mr.subject,
        mr.description,
        mr.equipment_id,
        e.name as equipment_name,
        e.equipment_code,
        mr.stage,
        mr.priority,
        mr.request_type,
        mr.scheduled_date,
        mr.deadline,
        mr.started_at,
        mr.completed_at,
        mr.duration_hours,
        mr.assigned_technician_id,
        tech.name as technician_name,
        mr.requested_by_id,
        req.name as requester_name,
        mr.created_at,
        mr.updated_at
      FROM maintenance_requests mr
      INNER JOIN equipment e ON mr.equipment_id = e.id
      INNER JOIN users req ON mr.requested_by_id = req.id
      LEFT JOIN users tech ON mr.assigned_technician_id = tech.id
      ORDER BY mr.created_at DESC
      LIMIT ${limit}
    `;

    return await query<RecentRequestRow[]>(sql);
  }

  /**
   * Get upcoming scheduled preventive maintenance
   */
  async getUpcomingMaintenance(limit: number = 5): Promise<UpcomingMaintenanceRow[]> {
    const sql = `
      SELECT 
        mr.id,
        mr.request_number,
        mr.subject,
        mr.equipment_id,
        e.name as equipment_name,
        e.equipment_code,
        mr.scheduled_date,
        mr.scheduled_time,
        mr.request_type,
        mr.assigned_technician_id,
        tech.name as technician_name
      FROM maintenance_requests mr
      INNER JOIN equipment e ON mr.equipment_id = e.id
      LEFT JOIN users tech ON mr.assigned_technician_id = tech.id
      WHERE mr.request_type = 'preventive'
        AND mr.scheduled_date >= CURDATE()
        AND mr.stage IN ('new', 'in_progress')
      ORDER BY mr.scheduled_date ASC, mr.scheduled_time ASC
      LIMIT ${limit}
    `;

    return await query<UpcomingMaintenanceRow[]>(sql);
  }
}

export default new DashboardRepository();
