import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import { getKanbanRequests, KanbanRequest } from '../../services/api';
import toast from 'react-hot-toast';

interface AssignTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (requestId: string) => void;
  memberName: string;
  memberId: number;
}

interface MaintenanceRequest {
  id: string;
  equipment: string;
  type: 'preventive' | 'corrective';
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'pending';
  createdDate: string;
}

export default function AssignTaskDialog({
  isOpen,
  onClose,
  onAssign,
  memberName,
}: AssignTaskDialogProps) {
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const [availableRequests, setAvailableRequests] = useState<KanbanRequest[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch unassigned requests from API
  useEffect(() => {
    if (isOpen) {
      fetchAvailableRequests();
    }
  }, [isOpen]);

  const fetchAvailableRequests = async () => {
    try {
      setLoading(true);
      const data = await getKanbanRequests();
      
      // Get new and unassigned requests
      const unassigned = [
        ...data.new.filter(r => !r.technician_name),
        ...data.in_progress.filter(r => !r.technician_name),
      ];
      
      setAvailableRequests(unassigned);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      toast.error('Failed to load available requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = () => {
    if (selectedRequestId) {
      onAssign(selectedRequestId);
      setSelectedRequestId('');
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

  const getTypeColor = (type: string) => {
    return type === 'preventive' ? 'primary' : 'warning';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Assign Task to ${memberName}`} size="lg">
      <div className="space-y-4">
        {/* Info Message */}
        <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <FiAlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <p className="text-sm text-blue-700">
            Select a maintenance request to assign to this team member.
          </p>
        </div>

        {/* Available Requests List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading requests...</div>
          ) : availableRequests.length > 0 ? (
            availableRequests.map((request) => (
              <div
                key={request.id}
                onClick={() => setSelectedRequestId(request.request_number)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedRequestId === request.request_number
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{request.request_number}</span>
                      <Badge variant={getTypeColor(request.request_type)} size="sm">
                        {request.request_type.toUpperCase()}
                      </Badge>
                      <Badge variant={getPriorityColor(request.priority)} size="sm">
                        {request.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-gray-700 font-medium">{request.equipment_name}</p>
                    <p className="text-sm text-gray-600 mt-1">{request.subject}</p>
                    <p className="text-sm text-gray-500 mt-1">Created: {new Date(request.created_at).toLocaleDateString()}</p>
                  </div>
                  {selectedRequestId === request.request_number && (
                    <div className="ml-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                        <FiCheck className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No available requests to assign
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            icon={<FiX />}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleAssign}
            disabled={!selectedRequestId}
            icon={<FiCheck />}
          >
            Assign Task
          </Button>
        </div>
      </div>
    </Modal>
  );
}
