import { useState } from 'react';
import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import RequestForm, { RequestFormData } from '../components/maintenance-request/RequestForm';
import { FiPlus, FiClock, FiUser, FiMoreVertical } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Request {
  id: string;
  subject: string;
  equipment: string;
  stage: 'new' | 'in_progress' | 'repaired' | 'scrap';
  technician: string;
  priority: 'low' | 'medium' | 'high';
  createdDate: string;
  deadline?: string;
  avatar?: string;
}

export default function KanbanBoard() {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [draggedRequest, setDraggedRequest] = useState<string | null>(null);
  
  // Mock data
  const [requests, setRequests] = useState<Request[]>([
    {
      id: 'REQ-2025-001',
      subject: 'CNC Machine calibration needed',
      equipment: 'CNC Machine #5',
      stage: 'new',
      technician: 'Unassigned',
      priority: 'high',
      createdDate: '2024-12-26',
      deadline: '2024-12-28',
    },
    {
      id: 'REQ-2025-002',
      subject: 'Forklift battery replacement',
      equipment: 'Forklift #12',
      stage: 'new',
      technician: 'Unassigned',
      priority: 'medium',
      createdDate: '2024-12-25',
    },
    {
      id: 'REQ-2025-003',
      subject: 'Air compressor maintenance',
      equipment: 'Air Compressor',
      stage: 'in_progress',
      technician: 'Mike Johnson',
      priority: 'high',
      createdDate: '2024-12-24',
      deadline: '2024-12-27',
      avatar: 'MJ',
    },
    {
      id: 'REQ-2025-004',
      subject: 'Conveyor belt inspection',
      equipment: 'Conveyor Belt A',
      stage: 'in_progress',
      technician: 'Sarah Wilson',
      priority: 'low',
      createdDate: '2024-12-23',
      avatar: 'SW',
    },
    {
      id: 'REQ-2024-156',
      subject: 'Generator routine checkup',
      equipment: 'Generator #1',
      stage: 'repaired',
      technician: 'John Doe',
      priority: 'medium',
      createdDate: '2024-12-20',
      avatar: 'JD',
    },
    {
      id: 'REQ-2024-145',
      subject: 'HVAC system filter change',
      equipment: 'HVAC Unit #2',
      stage: 'repaired',
      technician: 'Tom Brown',
      priority: 'low',
      createdDate: '2024-12-18',
      avatar: 'TB',
    },
    {
      id: 'REQ-2024-089',
      subject: 'Old lathe machine - beyond repair',
      equipment: 'Lathe Machine #1',
      stage: 'scrap',
      technician: 'Mike Johnson',
      priority: 'high',
      createdDate: '2024-12-15',
      avatar: 'MJ',
    },
  ]);

  const stages = [
    { id: 'new', name: 'New', color: 'bg-blue-50 border-blue-200', count: 0 },
    { id: 'in_progress', name: 'In Progress', color: 'bg-yellow-50 border-yellow-200', count: 0 },
    { id: 'repaired', name: 'Repaired', color: 'bg-green-50 border-green-200', count: 0 },
    { id: 'scrap', name: 'Scrap', color: 'bg-red-50 border-red-200', count: 0 },
  ];

  // Count requests per stage
  const getRequestsByStage = (stage: string) => {
    return requests.filter(req => req.stage === stage);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const isOverdue = (deadline?: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
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

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, requestId: string) => {
    setDraggedRequest(requestId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStage: 'new' | 'in_progress' | 'repaired' | 'scrap') => {
    e.preventDefault();
    
    if (!draggedRequest) return;

    setRequests(prev => 
      prev.map(req => 
        req.id === draggedRequest 
          ? { ...req, stage: targetStage }
          : req
      )
    );

    toast.success(`Request moved to ${targetStage.replace('_', ' ').toUpperCase()}`);
    setDraggedRequest(null);
  };

  const handleCreateRequest = (data: RequestFormData) => {
    const newRequest: Request = {
      id: `REQ-2025-${String(requests.length + 1).padStart(3, '0')}`,
      subject: data.subject,
      equipment: data.maintenanceFor === 'equipment' 
        ? `Equipment #${data.equipmentId}` 
        : `Work Center #${data.workCenterId}`,
      stage: 'new',
      technician: data.technician || 'Unassigned',
      priority: data.priority,
      createdDate: new Date().toISOString().split('T')[0],
      deadline: data.scheduledDate,
      avatar: data.technician ? data.technician.split(' ').map(n => n[0]).join('') : undefined,
    };

    setRequests(prev => [newRequest, ...prev]);
    toast.success('Request created successfully!');
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Kanban</h1>
          <p className="text-gray-600 mt-1">Drag and drop to update request status</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            Filters
          </Button>
          <Button 
            variant="primary" 
            icon={<FiPlus />}
            onClick={() => setShowRequestForm(true)}
          >
            New Request
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stages.map((stage) => {
          const stageRequests = getRequestsByStage(stage.id);
          
          return (
            <div key={stage.id} className="flex flex-col">
              {/* Column Header */}
              <div className={`p-4 rounded-t-xl border-2 ${stage.color}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                  <span className="px-2 py-1 bg-white rounded-full text-sm font-medium text-gray-700">
                    {stageRequests.length}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div 
                className={`flex-1 p-4 border-2 border-t-0 ${stage.color} rounded-b-xl min-h-[600px] space-y-3`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id as any)}
              >
                {stageRequests.map((request) => (
                  <Card 
                    key={request.id} 
                    className="hover:shadow-lg transition-all cursor-move"
                  >
                    <div 
                      className="p-4"
                      draggable
                      onDragStart={(e) => handleDragStart(e, request.id)}
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-semibold text-gray-500">{request.id}</span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <FiMoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Subject */}
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {request.subject}
                      </h4>

                      {/* Equipment */}
                      <p className="text-sm text-gray-600 mb-3">
                        📦 {request.equipment}
                      </p>

                      {/* Priority Badge */}
                      <div className="mb-3">
                        <Badge variant={getPriorityColor(request.priority)} size="sm">
                          {request.priority.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Deadline (if exists and overdue) */}
                      {isOverdue(request.deadline) && (
                        <div className="mb-3 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          Overdue: {request.deadline}
                        </div>
                      )}

                      {/* Technician */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          {request.avatar ? (
                            <div className={`w-8 h-8 rounded-full ${getAvatarColor(request.avatar)} flex items-center justify-center text-white text-xs font-semibold`}>
                              {request.avatar}
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <FiUser className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <span className="text-sm text-gray-700">{request.technician}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Empty State */}
                {stageRequests.length === 0 && (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-400 text-sm">Drop requests here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{getRequestsByStage('new').length}</div>
            <div className="text-sm text-gray-600 mt-1">New Requests</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{getRequestsByStage('in_progress').length}</div>
            <div className="text-sm text-gray-600 mt-1">In Progress</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{getRequestsByStage('repaired').length}</div>
            <div className="text-sm text-gray-600 mt-1">Completed</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{getRequestsByStage('scrap').length}</div>
            <div className="text-sm text-gray-600 mt-1">Scrapped</div>
          </div>
        </Card>
      </div>

      {/* Request Form Modal */}
      <RequestForm 
        isOpen={showRequestForm}
        onClose={() => setShowRequestForm(false)}
        onSubmit={handleCreateRequest}
      />
    </Layout>
  );
}
