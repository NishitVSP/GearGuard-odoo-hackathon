import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { 
  FiPackage, 
  FiClipboard, 
  FiCheckCircle, 
  FiAlertCircle,
  FiTrendingUp,
  FiUsers
} from 'react-icons/fi';

export default function Dashboard() {
  // Mock data
  const stats = [
    {
      name: 'Total Equipment',
      value: '142',
      change: '+12%',
      trend: 'up',
      icon: FiPackage,
      color: 'blue',
    },
    {
      name: 'Active Requests',
      value: '28',
      change: '-5%',
      trend: 'down',
      icon: FiClipboard,
      color: 'yellow',
    },
    {
      name: 'Completed Today',
      value: '15',
      change: '+20%',
      trend: 'up',
      icon: FiCheckCircle,
      color: 'green',
    },
    {
      name: 'Overdue',
      value: '3',
      change: '-2',
      trend: 'down',
      icon: FiAlertCircle,
      color: 'red',
    },
  ];

  const recentRequests = [
    { id: 'REQ-2025-001', equipment: 'CNC Machine #5', status: 'in_progress', technician: 'John Doe', priority: 'high' },
    { id: 'REQ-2025-002', equipment: 'Forklift #12', status: 'new', technician: 'Unassigned', priority: 'medium' },
    { id: 'REQ-2025-003', equipment: 'Conveyor Belt A', status: 'repaired', technician: 'Jane Smith', priority: 'low' },
    { id: 'REQ-2025-004', equipment: 'Air Compressor', status: 'in_progress', technician: 'Mike Johnson', priority: 'high' },
    { id: 'REQ-2025-005', equipment: 'Lathe Machine #3', status: 'new', technician: 'Unassigned', priority: 'medium' },
  ];

  const upcomingMaintenance = [
    { date: 'Dec 28', equipment: 'Generator #1', type: 'Preventive', time: '09:00 AM' },
    { date: 'Dec 29', equipment: 'HVAC System', type: 'Preventive', time: '02:00 PM' },
    { date: 'Dec 30', equipment: 'Fire Suppression', type: 'Preventive', time: '10:30 AM' },
  ];

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
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colors = {
            blue: 'bg-blue-100 text-blue-600',
            yellow: 'bg-yellow-100 text-yellow-600',
            green: 'bg-green-100 text-green-600',
            red: 'bg-red-100 text-red-600',
          };
          
          return (
            <Card key={stat.name}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colors[stat.color as keyof typeof colors]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.name}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card title="Recent Maintenance Requests">
            <div className="overflow-x-auto">
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
                        {request.id}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {request.equipment}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <Badge variant={getStatusColor(request.status)}>
                          {request.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {request.technician}
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
            </div>
          </Card>
        </div>

        {/* Upcoming Maintenance - Takes 1 column */}
        <div>
          <Card title="Upcoming Maintenance">
            <div className="space-y-4">
              {upcomingMaintenance.map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 w-12 text-center">
                    <div className="text-sm font-semibold text-blue-600">{item.date.split(' ')[0]}</div>
                    <div className="text-xs text-gray-500">{item.date.split(' ')[1]}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.equipment}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.type} • {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions" className="mt-6">
            <div className="space-y-2">
              <button className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all">
                + Create New Request
              </button>
              <button className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all">
                + Add Equipment
              </button>
              <button className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all">
                <FiUsers className="inline mr-2" />
                Manage Teams
              </button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
