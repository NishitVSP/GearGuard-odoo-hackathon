import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import RequestForm from '../components/maintenance-request/RequestForm';
import { 
  FiPackage, 
  FiClipboard, 
  FiCheckCircle, 
  FiAlertCircle,
  FiUsers
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface DashboardStats {
  totalEquipment: { value: number; trend: number; trendDirection: string };
  activeRequests: { value: number; trend: number; trendDirection: string };
  completedToday: { value: number; trend: number; trendDirection: string };
  overdue: { value: number; trend: number; trendDirection: string };
}

interface CriticalEquipment {
  id: number;
  equipmentCode: string;
  name: string;
  healthPercentage: number;
  status: string;
}

interface TechnicianLoad {
  technicianId: number;
  technicianName: string;
  activeRequests: number;
  totalCapacity: number;
  utilizationPercentage: number;
}

interface OpenRequestsSummary {
  pending: number;
  overdue: number;
  total: number;
}

interface RecentRequest {
  id: number;
  requestNumber: string;
  equipmentName: string;
  stage: string;
  technicianName: string | null;
  priority: string;
}

interface UpcomingMaintenance {
  id: number;
  equipmentName: string;
  scheduledDate: string;
  scheduledTime: string | null;
  requestType: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [criticalEquipment, setCriticalEquipment] = useState<CriticalEquipment[]>([]);
  const [technicianLoad, setTechnicianLoad] = useState<TechnicianLoad[]>([]);
  const [openRequests, setOpenRequests] = useState<OpenRequestsSummary | null>(null);
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [upcomingMaintenance, setUpcomingMaintenance] = useState<UpcomingMaintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [
        statsRes,
        criticalRes,
        technicianRes,
        openRequestsRes,
        recentRes,
        upcomingRes
      ] = await Promise.all([
        axios.get(`${API_URL}/dashboard/stats`, config),
        axios.get(`${API_URL}/dashboard/critical-equipment`, config),
        axios.get(`${API_URL}/dashboard/technician-load`, config),
        axios.get(`${API_URL}/dashboard/open-requests`, config),
        axios.get(`${API_URL}/dashboard/recent-requests?limit=5`, config),
        axios.get(`${API_URL}/dashboard/upcoming-maintenance?limit=3`, config),
      ]);

      setStats(statsRes.data.data);
      setCriticalEquipment(criticalRes.data.data);
      setTechnicianLoad(technicianRes.data.data);
      setOpenRequests(openRequestsRes.data.data);
      setRecentRequests(recentRes.data.data);
      setUpcomingMaintenance(upcomingRes.data.data);
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'primary';
      case 'in_progress': return 'warning';
      case 'repaired': return 'success';
      case 'scrap': return 'danger';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'urgent': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  // Get highest utilized technician
  const highestUtilizedTech = technicianLoad.length > 0
    ? technicianLoad.reduce((prev, current) => 
        prev.utilizationPercentage > current.utilizationPercentage ? prev : current
      )
    : null;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header with gradient */}
      <div className="mb-8 fade-in">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Top Alert Cards - Enhanced with gradients and animations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 slide-in-bottom">
        {/* Critical Equipment */}
        <Card hover={true} className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-200/30 rounded-full -mr-16 -mt-16"></div>
          <div className="p-6 relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
                <FiAlertCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-red-800 font-bold text-lg">Critical Equipment</h3>
            </div>
            <div className="text-4xl font-black text-red-600 mb-1">
              {criticalEquipment.length} <span className="text-lg font-semibold">Units</span>
            </div>
            <p className="text-sm text-red-700 font-medium">(Health &lt; 30%)</p>
            {criticalEquipment.length > 0 && (
              <div className="mt-4 p-2 bg-white/60 rounded-lg text-xs text-red-600 font-medium">
                ⚠️ Most critical: {criticalEquipment[0].name} ({criticalEquipment[0].healthPercentage}%)
              </div>
            )}
          </div>
        </Card>

        {/* Technician Load */}
        <Card hover={true} className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full -mr-16 -mt-16"></div>
          <div className="p-6 relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <FiUsers className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-blue-800 font-bold text-lg">Technician Load</h3>
            </div>
            {highestUtilizedTech ? (
              <>
                <div className="text-4xl font-black text-blue-600 mb-1">
                  {highestUtilizedTech.utilizationPercentage}% <span className="text-lg font-semibold">Utilized</span>
                </div>
                <p className="text-sm text-blue-700 font-medium">(Assign Carefully)</p>
                <div className="mt-4 p-2 bg-white/60 rounded-lg text-xs text-blue-600 font-medium">
                  👤 {highestUtilizedTech.technicianName}: {highestUtilizedTech.activeRequests}/{highestUtilizedTech.totalCapacity} requests
                </div>
              </>
            ) : (
              <>
                <div className="text-3xl font-bold text-blue-600 mb-1">0% Utilized</div>
                <p className="text-sm text-blue-700">No technicians assigned</p>
              </>
            )}
          </div>
        </Card>

        {/* Open Requests */}
        <Card hover={true} className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full -mr-16 -mt-16"></div>
          <div className="p-6 relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <FiClipboard className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-green-800 font-bold text-lg">Open Requests</h3>
            </div>
            {openRequests && (
              <>
                <div className="text-4xl font-black text-green-600 mb-1">
                  {openRequests.pending} <span className="text-lg font-semibold">Pending</span>
                </div>
                <p className="text-sm text-red-600 font-semibold">⏰ {openRequests.overdue} Overdue</p>
                <div className="mt-4 p-2 bg-white/60 rounded-lg text-xs text-green-600 font-medium">
                  📋 Total open: {openRequests.total}
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Stats Grid - Enhanced */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 slide-in-bottom">
          <Card hover={true} className="overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                    <FiPackage className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-bold px-2 py-1 rounded-full ${stats.totalEquipment.trendDirection === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {stats.totalEquipment.trend > 0 ? '↑' : '↓'} {Math.abs(stats.totalEquipment.trend)}%
                  </span>
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-1">{stats.totalEquipment.value}</h3>
              <p className="text-sm text-gray-500 font-medium">Total Equipment</p>
            </div>
            </div>
          </Card>

          <Card hover={true} className="overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-lg">
                    <FiClipboard className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-bold px-2 py-1 rounded-full ${stats.activeRequests.trendDirection === 'down' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {stats.activeRequests.trend > 0 ? '↑' : '↓'} {Math.abs(stats.activeRequests.trend)}%
                  </span>
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-1">{stats.activeRequests.value}</h3>
                <p className="text-sm text-gray-500 font-medium">Active Requests</p>
              </div>
            </div>
          </Card>

          <Card hover={true} className="overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                    <FiCheckCircle className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-bold px-2 py-1 rounded-full ${stats.completedToday.trendDirection === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {stats.completedToday.trend > 0 ? '↑' : '↓'} {Math.abs(stats.completedToday.trend)}%
                  </span>
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-1">{stats.completedToday.value}</h3>
                <p className="text-sm text-gray-500 font-medium">Completed Today</p>
              </div>
            </div>
          </Card>

          <Card hover={true} className="overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg">
                    <FiAlertCircle className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-bold px-2 py-1 rounded-full ${stats.overdue.trendDirection === 'down' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {stats.overdue.trend > 0 ? '↑' : '↓'} {Math.abs(stats.overdue.trend)}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-1">{stats.overdue.value}</h3>
                <p className="text-sm text-gray-500 font-medium">Overdue</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card title="Recent Maintenance Requests">
            <div className="overflow-x-auto">
              {recentRequests.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No maintenance requests yet
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Request ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Equipment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Technician
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Priority
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {request.requestNumber}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {request.equipmentName}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <Badge variant={getStatusColor(request.stage)}>
                            {request.stage.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {request.technicianName || 'Unassigned'}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <Badge variant={getPriorityColor(request.priority)}>
                            {request.priority.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>

        {/* Upcoming Maintenance - Takes 1 column */}
        <div>
          <Card title="Upcoming Maintenance">
            <div className="space-y-4">
              {upcomingMaintenance.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No upcoming maintenance scheduled
                </div>
              ) : (
                upcomingMaintenance.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 w-12 text-center">
                      <div className="text-sm font-semibold text-blue-600">
                        {formatDate(item.scheduledDate).split(' ')[1]}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(item.scheduledDate).split(' ')[0]}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.equipmentName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.requestType} • {item.scheduledTime || 'TBD'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions" className="mt-6">
            <div className="space-y-2">
              <button 
                onClick={() => setShowRequestForm(true)}
                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
              >
                + Create New Request
              </button>
              <button 
                onClick={() => navigate('/equipment')}
                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
              >
                + Add Equipment
              </button>
              <button 
                onClick={() => navigate('/teams')}
                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
              >
                <FiUsers className="inline mr-2" />
                Manage Teams
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <RequestForm
          isOpen={showRequestForm}
          onClose={() => setShowRequestForm(false)}
          onSubmit={() => {
            setShowRequestForm(false);
            fetchDashboardData(); // Refresh data
            toast.success('Request created successfully!');
          }}
        />
      )}
    </Layout>
  );
}
