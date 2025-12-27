import { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import RequestForm, { RequestFormData } from '../components/maintenance-request/RequestForm';
import { FiPlus, FiClock, FiUser, FiMoreVertical } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getKanbanRequests, updateRequestStage, KanbanRequest, createRequest } from '../services/api';

interface Request {
  id: number;
  requestNumber: string;
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
  const [draggedRequest, setDraggedRequest] = useState<number | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch requests from API
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getKanbanRequests();
      
      // Transform API data to local format
      const allRequests: Request[] = [
        ...data.new.map(transformRequest),
        ...data.in_progress.map(transformRequest),
        ...data.repaired.map(transformRequest),
        ...data.scrap.map(transformRequest),
      ];
      
      setRequests(allRequests);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const transformRequest = (req: KanbanRequest): Request => ({
    id: req.id,
    requestNumber: req.request_number,
    subject: req.subject,
    equipment: req.equipment_name,
    stage: req.stage,
    technician: req.technician_name || 'Unassigned',
    priority: req.priority,
    createdDate: new Date(req.created_at).toISOString().split('T')[0],
    deadline: req.deadline || undefined,
    avatar: req.technician_name ? req.technician_name.split(' ').map(n => n[0]).join('') : undefined,
  });

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
  const handleDragStart = (e: React.DragEvent, requestId: number) => {
    setDraggedRequest(requestId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetStage: 'new' | 'in_progress' | 'repaired' | 'scrap') => {
    e.preventDefault();
    
    if (!draggedRequest) return;

    try {
      // Update on backend
      await updateRequestStage(draggedRequest, { stage: targetStage });
      
      // Update local state
      setRequests(prev => 
        prev.map(req => 
          req.id === draggedRequest 
            ? { ...req, stage: targetStage }
            : req
        )
      );

      toast.success(`Request moved to ${targetStage.replace('_', ' ').toUpperCase()}`);
    } catch (error) {
      console.error('Failed to update request stage:', error);
      toast.error('Failed to update request stage');
    } finally {
      setDraggedRequest(null);
    }
  };

  const handleCreateRequest = async (data: RequestFormData) => {
    try {
      const requestData = {
        subject: data.subject,
        description: data.notes || data.instructions,
        request_type: data.maintenanceType,
        equipment_id: data.equipmentId ? parseInt(data.equipmentId) : 0,
        assigned_technician_id: data.technician ? parseInt(data.technician) : undefined,
        priority: data.priority,
        scheduled_date: data.scheduledDate || undefined,
        scheduled_time: data.scheduledTime || undefined,
        deadline: data.scheduledDate || undefined,
      };

      await createRequest(requestData);
      toast.success('Request created successfully!');
      setShowRequestForm(false);
      
      // Refresh the list
      fetchRequests();
    } catch (error) {
      console.error('Failed to create request:', error);
      toast.error('Failed to create request');
    }
  };

  return (
    <Layout>
      {/* Header with gradient */}
      <div className="mb-8 fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Maintenance Kanban
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Drag and drop to update request status
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="hover:scale-105">
              Filters
            </Button>
            <Button 
              variant="gradient" 
              icon={<FiPlus />}
              onClick={() => setShowRequestForm(true)}
              className="hover:scale-105"
            >
              New Request
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State with animation */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading requests...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 slide-in-bottom">
            {stages.map((stage, index) => {
              const stageRequests = getRequestsByStage(stage.id);
              
              return (
                <div 
                  key={stage.id} 
                  className="flex flex-col"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Column Header with gradient */}
                  <div className={`p-4 rounded-t-xl border-2 ${stage.color} backdrop-blur-sm bg-white/50`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-current"></span>
                        {stage.name}
                      </h3>
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-bold shadow-md">
                        {stageRequests.length}
                      </span>
                    </div>
                  </div>

                  {/* Cards Container */}
                  <div 
                    className={`flex-1 p-4 border-2 border-t-0 ${stage.color} rounded-b-xl min-h-[600px] space-y-3 transition-all duration-300`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage.id as any)}
                  >
                    {stageRequests.map((request, reqIndex) => (
                      <Card 
                        key={request.id} 
                        hover={true}
                        className={`cursor-move transform transition-all duration-200 ${
                          draggedRequest === request.id ? 'opacity-50 scale-95' : 'hover:scale-102'
                        }`}
                        style={{ animationDelay: `${(index * 0.1) + (reqIndex * 0.05)}s` }}
                      >
                        <div 
                          className="p-4"
                          draggable
                          onDragStart={(e) => handleDragStart(e, request.id)}
                        >
                          {/* Card Header */}
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {request.requestNumber}
                            </span>
                            <button className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded transition-colors">
                              <FiMoreVertical className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Subject */}
                          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {request.subject}
                          </h4>

                          {/* Equipment with icon */}
                          <p className="text-sm text-gray-600 mb-3 flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                            <span className="text-lg">📦</span>
                            <span className="font-medium">{request.equipment}</span>
                          </p>

                          {/* Priority Badge with animation */}
                          <div className="mb-3">
                            <Badge variant={getPriorityColor(request.priority)} size="sm" className="animate-pulse">
                              {request.priority.toUpperCase()}
                            </Badge>
                          </div>

                          {/* Deadline (if exists and overdue) with pulse */}
                          {isOverdue(request.deadline) && (
                            <div className="mb-3 px-3 py-2 bg-gradient-to-r from-red-100 to-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold flex items-center gap-2 animate-pulse">
                              <FiClock className="w-4 h-4" />
                              Overdue: {request.deadline}
                            </div>
                          )}

                          {/* Technician with improved avatar */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              {request.avatar ? (
                                <div className={`w-9 h-9 rounded-full ${getAvatarColor(request.avatar)} flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white`}>
                                  {request.avatar}
                                </div>
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-md">
                                  <FiUser className="w-5 h-5 text-gray-500" />
                                </div>
                              )}
                              <span className="text-sm font-medium text-gray-700">{request.technician}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}

                    {/* Empty State with improved design */}
                    {stageRequests.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 transition-all hover:border-blue-400 hover:bg-blue-50/30">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                          <FiPlus className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-gray-400 text-sm font-medium">Drop requests here</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Stats with gradients */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 slide-in-bottom">
            <Card hover={true} className="overflow-hidden">
              <div className="p-5 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
                <div className="relative">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">{getRequestsByStage('new').length}</div>
                  <div className="text-sm text-gray-600 mt-1 font-medium">New Requests</div>
                </div>
              </div>
            </Card>
            <Card hover={true} className="overflow-hidden">
              <div className="p-5 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent"></div>
                <div className="relative">
                  <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">{getRequestsByStage('in_progress').length}</div>
                  <div className="text-sm text-gray-600 mt-1 font-medium">In Progress</div>
                </div>
              </div>
            </Card>
            <Card hover={true} className="overflow-hidden">
              <div className="p-5 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent"></div>
                <div className="relative">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">{getRequestsByStage('repaired').length}</div>
                  <div className="text-sm text-gray-600 mt-1 font-medium">Completed</div>
                </div>
              </div>
            </Card>
            <Card hover={true} className="overflow-hidden">
              <div className="p-5 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent"></div>
                <div className="relative">
                  <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">{getRequestsByStage('scrap').length}</div>
                  <div className="text-sm text-gray-600 mt-1 font-medium">Scrapped</div>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Request Form Modal */}
      <RequestForm 
        isOpen={showRequestForm}
        onClose={() => setShowRequestForm(false)}
        onSubmit={handleCreateRequest}
      />
    </Layout>
  );
}
