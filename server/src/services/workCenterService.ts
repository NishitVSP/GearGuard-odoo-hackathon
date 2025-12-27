import workCenterRepository, {
  CreateWorkCenterData,
  UpdateWorkCenterData,
  WorkCenterRow,
} from '../repositories/workCenterRepository';

export interface WorkCenterDTO {
  id: number;
  name: string;
  code: string;
  category: string;
  location: string | null;
  departmentId: number | null;
  departmentName: string | null;
  assignedTeamId: number | null;
  assignedTeamName: string | null;
  status: 'active' | 'inactive' | 'maintenance';
  capacity: number;
  utilization?: number;
  openRequests?: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkCenterDTO {
  name: string;
  code: string;
  category: string;
  location?: string;
  departmentId?: number;
  assignedTeamId?: number;
  status?: 'active' | 'inactive' | 'maintenance';
  capacity?: number;
  description?: string;
}

export interface UpdateWorkCenterDTO {
  name?: string;
  code?: string;
  category?: string;
  location?: string;
  departmentId?: number;
  assignedTeamId?: number;
  status?: 'active' | 'inactive' | 'maintenance';
  capacity?: number;
  description?: string;
}

export class WorkCenterService {
  /**
   * Convert database row to DTO
   */
  private toDTO(row: WorkCenterRow, utilization?: number, openRequests?: number): WorkCenterDTO {
    return {
      id: row.id,
      name: row.name,
      code: row.code,
      category: row.category,
      location: row.location,
      departmentId: row.department_id,
      departmentName: row.department_name,
      assignedTeamId: row.assigned_team_id,
      assignedTeamName: row.assigned_team_name,
      status: row.status,
      capacity: row.capacity,
      utilization,
      openRequests,
      description: row.description,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  }

  /**
   * Get all work centers
   */
  async getAllWorkCenters(includeUtilization = false): Promise<WorkCenterDTO[]> {
    const rows = await workCenterRepository.getAllWorkCenters();

    if (!includeUtilization) {
      return rows.map((row) => this.toDTO(row));
    }

    // Get utilization for each work center
    const workCenters = await Promise.all(
      rows.map(async (row) => {
        const utilization = await workCenterRepository.getWorkCenterUtilization(row.id);
        return this.toDTO(row, utilization);
      })
    );

    return workCenters;
  }

  /**
   * Get a single work center by ID
   */
  async getWorkCenterById(id: number): Promise<WorkCenterDTO | null> {
    const row = await workCenterRepository.getWorkCenterById(id);
    if (!row) return null;

    const utilization = await workCenterRepository.getWorkCenterUtilization(id);
    return this.toDTO(row, utilization);
  }

  /**
   * Create a new work center
   */
  async createWorkCenter(data: CreateWorkCenterDTO): Promise<WorkCenterDTO> {
    // Check if code already exists
    const codeExists = await workCenterRepository.isCodeExists(data.code);
    if (codeExists) {
      throw new Error(`Work center with code '${data.code}' already exists`);
    }

    // Map DTO to repository data
    const createData: CreateWorkCenterData = {
      name: data.name,
      code: data.code,
      category: data.category,
      location: data.location,
      department_id: data.departmentId,
      assigned_team_id: data.assignedTeamId,
      status: data.status,
      capacity: data.capacity,
      description: data.description,
    };

    const id = await workCenterRepository.createWorkCenter(createData);
    const workCenter = await this.getWorkCenterById(id);

    if (!workCenter) {
      throw new Error('Failed to retrieve created work center');
    }

    return workCenter;
  }

  /**
   * Update a work center
   */
  async updateWorkCenter(id: number, data: UpdateWorkCenterDTO): Promise<WorkCenterDTO> {
    // Check if work center exists
    const existing = await workCenterRepository.getWorkCenterById(id);
    if (!existing) {
      throw new Error('Work center not found');
    }

    // Check if code is being changed and if new code already exists
    if (data.code && data.code !== existing.code) {
      const codeExists = await workCenterRepository.isCodeExists(data.code, id);
      if (codeExists) {
        throw new Error(`Work center with code '${data.code}' already exists`);
      }
    }

    // Map DTO to repository data
    const updateData: UpdateWorkCenterData = {
      name: data.name,
      code: data.code,
      category: data.category,
      location: data.location,
      department_id: data.departmentId,
      assigned_team_id: data.assignedTeamId,
      status: data.status,
      capacity: data.capacity,
      description: data.description,
    };

    const success = await workCenterRepository.updateWorkCenter(id, updateData);
    if (!success) {
      throw new Error('Failed to update work center');
    }

    const workCenter = await this.getWorkCenterById(id);
    if (!workCenter) {
      throw new Error('Failed to retrieve updated work center');
    }

    return workCenter;
  }

  /**
   * Delete a work center
   */
  async deleteWorkCenter(id: number): Promise<void> {
    const existing = await workCenterRepository.getWorkCenterById(id);
    if (!existing) {
      throw new Error('Work center not found');
    }

    const success = await workCenterRepository.deleteWorkCenter(id);
    if (!success) {
      throw new Error('Failed to delete work center');
    }
  }
}

export default new WorkCenterService();
