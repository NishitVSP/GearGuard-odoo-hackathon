export * from './equipment.types';
export * from './team.types';
export * from './request.types';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'technician' | 'operator';
  avatar?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
