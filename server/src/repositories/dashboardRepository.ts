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

export class DashboardRepository {
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
