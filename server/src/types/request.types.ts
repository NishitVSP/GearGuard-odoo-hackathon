// src/types/request.types.ts

export interface MaintenanceRequest {
    id: number;
    request_number: string;
    subject: string;
    description: string | null;
    request_type: 'corrective' | 'preventive';
    equipment_id: number;
    equipment_category_id: number | null;
    maintenance_team_id: number | null;
    assigned_technician_id: number | null;
    stage: 'new' | 'in_progress' | 'repaired' | 'scrap';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    scheduled_date: Date | null;
    scheduled_time: string | null;
    deadline: Date | null;
    started_at: Date | null;
    completed_at: Date | null;
    duration_hours: number | null;
    requested_by_id: number;
    technician_notes: string | null;
    scrap_reason: string | null;
    created_at: Date;
    updated_at: Date;

    // Joined data
    equipment_name?: string;
    equipment_code?: string;
    technician_name?: string;
    team_name?: string;
}

export interface CreateRequestRequest {
    subject: string;
    description?: string;
    request_type: 'corrective' | 'preventive';
    equipment_id: number;
    assigned_technician_id?: number;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    scheduled_date?: string;
    scheduled_time?: string;
    deadline?: string;
}

export interface UpdateRequestRequest {
    subject?: string;
    description?: string;
    assigned_technician_id?: number;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    scheduled_date?: string;
    scheduled_time?: string;
    deadline?: string;
    technician_notes?: string;
    scrap_reason?: string;
}
