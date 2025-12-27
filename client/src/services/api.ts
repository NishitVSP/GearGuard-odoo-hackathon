import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// Authentication API
// ============================================

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role?: 'user' | 'technician' | 'manager' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

/**
 * Register a new user
 */
export const signup = async (data: SignupRequest): Promise<AuthResponse> => {
  const response = await api.post('/auth/signup', data);
  if (response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
  return response.data.data;
};

/**
 * Login user
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', data);
  if (response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
  return response.data.data;
};

/**
 * Logout user
 */
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): AuthResponse['user'] | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// ============================================
// Dashboard API
// ============================================

export interface StatWithTrend {
  value: number;
  trend: number;
  trendDirection: 'up' | 'down' | 'neutral';
}

export interface DashboardStatsResponse {
  totalEquipment: StatWithTrend;
  activeRequests: StatWithTrend;
  completedToday: StatWithTrend;  
  overdue: StatWithTrend;
}

export interface MaintenanceRequestDTO {
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

export interface UpcomingMaintenanceDTO {
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

/**
 * Get dashboard statistics with trends
 */
export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const response = await api.get('/dashboard/stats');
  return response.data.data;
};

/**
 * Get recent maintenance requests
 */
export const getRecentRequests = async (limit: number = 5): Promise<MaintenanceRequestDTO[]> => {
  const response = await api.get('/dashboard/recent-requests', {
    params: { limit },
  });
  return response.data.data;
};

/**
 * Get upcoming scheduled maintenance
 */
export const getUpcomingMaintenance = async (limit: number = 5): Promise<UpcomingMaintenanceDTO[]> => {
  const response = await api.get('/dashboard/upcoming-maintenance', {
    params: { limit },
  });
  return response.data.data;
};

// ============================================
// Equipment API
// ============================================

export interface Equipment {
  id: number;
  name: string;
  equipment_code: string;
  category_id: number;
  category_name?: string;
  model?: string;
  manufacturer?: string;
  serial_number?: string;
  purchase_date?: string;
  warranty_expiry_date?: string;
  location?: string;
  status: 'operational' | 'under_maintenance' | 'broken' | 'scrapped';
  assigned_team_id?: number;
  department_id?: number;
  description?: string;
  specifications?: Record<string, any>;
  image_url?: string;
  created_at: string;
  updated_at: string;
  team_name?: string;
  department_name?: string;
  open_requests?: number;
  maintenance_requests?: any[];
}

export interface CreateEquipmentDto {
  name: string;
  equipment_code: string;
  category_id: number;
  model?: string;
  manufacturer?: string;
  serial_number?: string;
  purchase_date?: string;
  warranty_expiry_date?: string;
  location?: string;
  status?: Equipment['status'];
  assigned_team_id: number;
  description?: string;
  specifications?: Record<string, any>;
  image_url?: string;
}

export interface EquipmentFilters {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface EquipmentListResponse {
  items: Equipment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get all equipment with filters
 */
export const getEquipment = async (filters?: EquipmentFilters): Promise<EquipmentListResponse> => {
  const response = await api.get('/equipment', { params: filters });
  return response.data.data;
};

/**
 * Get equipment by ID
 */
export const getEquipmentById = async (id: number): Promise<Equipment> => {
  const response = await api.get(`/equipment/${id}`);
  return response.data.data;
};

/**
 * Create new equipment
 */
export const createEquipment = async (data: CreateEquipmentDto): Promise<Equipment> => {
  const response = await api.post('/equipment', data);
  return response.data.data;
};

/**
 * Update equipment
 */
export const updateEquipment = async (id: number, data: Partial<CreateEquipmentDto>): Promise<Equipment> => {
  const response = await api.put(`/equipment/${id}`, data);
  return response.data.data;
};

/**
 * Delete equipment
 */
export const deleteEquipment = async (id: number): Promise<void> => {
  await api.delete(`/equipment/${id}`);
};

/**
 * Get equipment categories
 */
export const getEquipmentCategories = async (): Promise<Array<{id: number; name: string}>> => {
  const response = await api.get('/equipment/meta/categories');
  return response.data.data;
};

export default api;
