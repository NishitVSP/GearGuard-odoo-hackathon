import dashboardRepository from '../repositories/dashboardRepository';

interface StatWithTrend {
  value: number;
  trend: number; // Percentage change from yesterday
  trendDirection: 'up' | 'down' | 'neutral';
}

interface DashboardStatsResponse {
  totalEquipment: StatWithTrend;
  activeRequests: StatWithTrend;
  completedToday: StatWithTrend;
  overdue: StatWithTrend;
}

interface MaintenanceRequestDTO {
  id: number;
  requestNumber: string;
  subject: string;
  description: string;
  equipmentId: number;
  equipmentName: string;
  equipmentCode: string;
  stage: string;
  priority: string;
  requestType: string;
  scheduledDate: string | null;
  deadline: string | null;
  startedAt: string | null;
  completedAt: string | null;
  durationHours: number | null;
  assignedTechnicianId: number | null;
  technicianName: string | null;
  requestedById: number;
  requesterName: string;
  createdAt: string;
  updatedAt: string;
}

interface UpcomingMaintenanceDTO {
  id: number;
  requestNumber: string;
  subject: string;
  equipmentId: number;
  equipmentName: string;
  equipmentCode: string;
  scheduledDate: string;
  scheduledTime: string | null;
  requestType: string;
  assignedTechnicianId: number | null;
  technicianName: string | null;
}

export class DashboardService {
  /**
   * Calculate percentage change between two values
   */
  private calculateTrend(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return Math.round(((current - previous) / previous) * 100);
  }

  /**
   * Determine trend direction
   */
  private getTrendDirection(trend: number): 'up' | 'down' | 'neutral' {
    if (trend > 0) return 'up';
    if (trend < 0) return 'down';
    return 'neutral';
  }

  /**
   * Create stat with trend data
   */
  private createStatWithTrend(current: number, previous: number): StatWithTrend {
    const trend = this.calculateTrend(current, previous);
    return {
      value: current,
      trend,
      trendDirection: this.getTrendDirection(trend),
    };
  }

  /**
   * Get dashboard statistics with trends
   */
  async getDashboardStats(): Promise<DashboardStatsResponse> {
    const [todayStats, yesterdayStats] = await Promise.all([
      dashboardRepository.getTodayStats(),
      dashboardRepository.getYesterdayStats(),
    ]);

    return {
      totalEquipment: this.createStatWithTrend(
        todayStats.totalEquipment,
        yesterdayStats.totalEquipment
      ),
      activeRequests: this.createStatWithTrend(
        todayStats.activeRequests,
        yesterdayStats.activeRequests
      ),
      completedToday: this.createStatWithTrend(
        todayStats.completedToday,
        yesterdayStats.completedToday
      ),
      overdue: this.createStatWithTrend(
        todayStats.overdue,
        yesterdayStats.overdue
      ),
    };
  }

  /**
   * Get recent maintenance requests formatted for client
   */
  async getRecentRequests(limit: number = 5): Promise<MaintenanceRequestDTO[]> {
    const requests = await dashboardRepository.getRecentRequests(limit);

    return requests.map((req) => ({
      id: req.id,
      requestNumber: req.request_number,
      subject: req.subject,
      description: req.description,
      equipmentId: req.equipment_id,
      equipmentName: req.equipment_name,
      equipmentCode: req.equipment_code,
      stage: req.stage,
      priority: req.priority,
      requestType: req.request_type,
      scheduledDate: req.scheduled_date ? req.scheduled_date.toISOString().split('T')[0] : null,
      deadline: req.deadline ? req.deadline.toISOString().split('T')[0] : null,
      startedAt: req.started_at ? req.started_at.toISOString() : null,
      completedAt: req.completed_at ? req.completed_at.toISOString() : null,
      durationHours: req.duration_hours,
      assignedTechnicianId: req.assigned_technician_id,
      technicianName: req.technician_name,
      requestedById: req.requested_by_id,
      requesterName: req.requester_name,
      createdAt: req.created_at.toISOString(),
      updatedAt: req.updated_at.toISOString(),
    }));
  }

  /**
   * Get upcoming scheduled maintenance formatted for client
   */
  async getUpcomingMaintenance(limit: number = 5): Promise<UpcomingMaintenanceDTO[]> {
    const maintenance = await dashboardRepository.getUpcomingMaintenance(limit);

    return maintenance.map((m) => ({
      id: m.id,
      requestNumber: m.request_number,
      subject: m.subject,
      equipmentId: m.equipment_id,
      equipmentName: m.equipment_name,
      equipmentCode: m.equipment_code,
      scheduledDate: m.scheduled_date.toISOString().split('T')[0],
      scheduledTime: m.scheduled_time,
      requestType: m.request_type,
      assignedTechnicianId: m.assigned_technician_id,
      technicianName: m.technician_name,
    }));
  }
}

export default new DashboardService();
