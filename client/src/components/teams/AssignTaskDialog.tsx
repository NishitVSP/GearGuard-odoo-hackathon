import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

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

  // Mock data - in real app, fetch from API
  const availableRequests: MaintenanceRequest[] = [
    {
      id: 'REQ-2025-005',
      equipment: 'Air Compressor',
      type: 'corrective',
      priority: 'high',
      status: 'new',
      createdDate: '2024-12-27',
    },
    {
      id: 'REQ-2025-004',
      equipment: 'Lathe Machine #3',
      type: 'preventive',
      priority: 'medium',
      status: 'pending',
      createdDate: '2024-12-26',
    },
    {
      id: 'REQ-2025-002',
      equipment: 'Dell Workstation',
      type: 'corrective',
      priority: 'low',
      status: 'new',
      createdDate: '2024-12-25',
    },
  ];

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
          {availableRequests.length > 0 ? (
            availableRequests.map((request) => (
              <div
                key={request.id}
                onClick={() => setSelectedRequestId(request.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedRequestId === request.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{request.id}</span>
                      <Badge variant={getTypeColor(request.type)} size="sm">
                        {request.type.toUpperCase()}
                      </Badge>
                      <Badge variant={getPriorityColor(request.priority)} size="sm">
                        {request.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-gray-700 font-medium">{request.equipment}</p>
                    <p className="text-sm text-gray-500 mt-1">Created: {request.createdDate}</p>
                  </div>
                  {selectedRequestId === request.id && (
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
