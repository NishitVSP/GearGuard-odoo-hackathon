// src/types/equipment.types.ts

export interface Equipment {
  id: number;
  equipment_code: string;
  name: string;
  category_id: number;
  department_id: number | null;
  assigned_to_user_id: number | null;
  assigned_team_id: number;
  assigned_technician_id: number | null;
  serial_number: string | null;
  manufacturer: string | null;
  model: string | null;
  purchase_date: Date | null;
  warranty_expiry_date: Date | null;
  location: string | null;
  status: 'operational' | 'under_maintenance' | 'broken' | 'scrapped';
  description: string | null;
  specifications: any;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;

  // Joined data
  category_name?: string;
  department_name?: string;
  team_name?: string;
  technician_name?: string;
  assigned_to_name?: string;
  open_requests?: number;
  last_maintenance?: Date;
}

export interface CreateEquipmentRequest {
  name: string;
  category_id: number;
  department_id?: number;
  assigned_team_id: number;
  assigned_technician_id?: number;
  assigned_to_user_id?: number;
  serial_number?: string;
  manufacturer?: string;
  model?: string;
  purchase_date?: string;
  warranty_expiry_date?: string;
  location?: string;
  description?: string;
}

export interface UpdateEquipmentRequest {
  name?: string;
  category_id?: number;
  department_id?: number;
  assigned_team_id?: number;
  assigned_technician_id?: number;
  assigned_to_user_id?: number;
  serial_number?: string;
  manufacturer?: string;
  model?: string;
  purchase_date?: string;
  warranty_expiry_date?: string;
  location?: string;
  status?: 'operational' | 'under_maintenance' | 'broken' | 'scrapped';
  description?: string;
}
