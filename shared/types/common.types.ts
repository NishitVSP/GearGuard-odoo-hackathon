export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

export type ApiStatus = 'success' | 'error';

export interface ApiResponse<T = any> {
  status: ApiStatus;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
