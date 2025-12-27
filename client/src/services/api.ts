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
