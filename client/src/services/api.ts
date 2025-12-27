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

export default api;
