export interface Equipment {
  id: number;
  name: string;
  equipment_code: string;
  category: 'machinery' | 'vehicle' | 'tool' | 'electronic' | 'other';
  model?: string;
  manufacturer?: string;
  serial_number?: string;
  purchase_date?: string;
  warranty_expiry?: string;
  location?: string;
  status: 'operational' | 'maintenance' | 'breakdown' | 'retired';
  assigned_team_id?: number;
  description?: string;
  specifications?: Record<string, any>;
  image_url?: string;
  last_maintenance_date?: string;
  next_maintenance_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEquipmentDto {
  name: string;
  equipment_code: string;
  category: Equipment['category'];
  model?: string;
  manufacturer?: string;
  serial_number?: string;
  purchase_date?: string;
  warranty_expiry?: string;
  location?: string;
  status?: Equipment['status'];
  assigned_team_id?: number;
  description?: string;
  specifications?: Record<string, any>;
  image_url?: string;
}

export interface UpdateEquipmentDto extends Partial<CreateEquipmentDto> {}
