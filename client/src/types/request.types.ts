export interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  equipment_id: number;
  requested_by: number;
  assigned_to_team?: number;
  assigned_to_user?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'submitted' | 'approved' | 'in_progress' | 'blocked' | 'completed' | 'cancelled';
  request_type: 'corrective' | 'preventive' | 'inspection' | 'upgrade';
  scheduled_date?: string;
  deadline?: string;
  started_at?: string;
  completed_at?: string;
  estimated_hours?: number;
  actual_hours?: number;
  cost?: number;
  notes?: string;
  attachments?: any[];
  created_at: string;
  updated_at: string;
}

export interface CreateRequestDto {
  title: string;
  description: string;
  equipment_id: number;
  priority?: MaintenanceRequest['priority'];
  request_type: MaintenanceRequest['request_type'];
  scheduled_date?: string;
  deadline?: string;
  estimated_hours?: number;
}

export interface UpdateRequestDto extends Partial<CreateRequestDto> {
  assigned_to_team?: number;
  assigned_to_user?: number;
  status?: MaintenanceRequest['status'];
  actual_hours?: number;
  cost?: number;
  notes?: string;
}
