import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { FiUser, FiCalendar, FiCheckCircle, FiClock } from 'react-icons/fi';

interface ViewProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: {
    id: number;
    name: string;
    role: string;
    avatar: string;
    status: 'available' | 'busy' | 'offline';
    activeRequests: number;
  } | null;
}

export default function ViewProfileModal({ isOpen, onClose, member }: ViewProfileModalProps) {
  if (!member) return null;

  // Mock data for member's assigned tasks and stats
  const assignedTasks = [
    {
      id: 'REQ-2025-003',
      equipment: 'CNC Machine #5',
      type: 'corrective',
      priority: 'high',
      status: 'in_progress',
      assignedDate: '2024-12-26',
    },
    {
      id: 'REQ-2024-156',
      equipment: 'Forklift #12',
      type: 'preventive',
      priority: 'medium',
      status: 'in_progress',
      assignedDate: '2024-12-25',
    },
  ];

  const stats = {
    totalCompleted: 42,
    avgCompletionTime: '3.5 hours',
    joinedDate: '2023-06-15',
    completedThisMonth: 8,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'busy': return 'warning';
      case 'offline': return 'default';
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

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Member Profile" size="lg">
      <div className="space-y-6">
        {/* Member Header */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className={`w-20 h-20 rounded-full ${getAvatarColor(member.avatar)} flex items-center justify-center text-white text-2xl font-semibold`}>
            {member.avatar}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900">{member.name}</h3>
            <p className="text-gray-600 mt-1">{member.role}</p>
            <div className="mt-2">
              <Badge variant={getStatusColor(member.status)}>
                {member.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <FiCheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Total Completed</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{stats.totalCompleted}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <FiCheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">This Month</span>
            </div>
            <div className="text-2xl font-bold text-green-700">{stats.completedThisMonth}</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 text-yellow-600 mb-2">
              <FiClock className="w-5 h-5" />
              <span className="text-sm font-medium">Avg. Time</span>
            </div>
            <div className="text-lg font-bold text-yellow-700">{stats.avgCompletionTime}</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <FiCalendar className="w-5 h-5" />
              <span className="text-sm font-medium">Joined</span>
            </div>
            <div className="text-sm font-bold text-purple-700">{stats.joinedDate}</div>
          </div>
        </div>

        {/* Current Assignments */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FiUser className="w-5 h-5" />
            Current Assignments ({member.activeRequests})
          </h4>
          <div className="space-y-3">
            {assignedTasks.slice(0, member.activeRequests).map((task) => (
              <div
                key={task.id}
                className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{task.id}</span>
                  <Badge variant={getPriorityColor(task.priority)} size="sm">
                    {task.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-gray-700 mb-1">{task.equipment}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiCalendar className="w-4 h-4" />
                  <span>Assigned: {task.assignedDate}</span>
                </div>
              </div>
            ))}
            {member.activeRequests === 0 && (
              <p className="text-center text-gray-500 py-4">No active assignments</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
