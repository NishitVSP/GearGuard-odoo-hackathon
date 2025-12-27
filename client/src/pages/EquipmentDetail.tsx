import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import AddEquipmentForm, { EquipmentFormData } from '../components/equipment/AddEquipmentForm';
import DeleteConfirmDialog from '../components/equipment/DeleteConfirmDialog';
import RequestForm from '../components/maintenance-request/RequestForm';
import { 
  FiArrowLeft, 
  FiEdit, 
  FiTrash2, 
  FiCalendar,
  FiUser,
  FiMapPin,
  FiPackage
} from 'react-icons/fi';

export default function EquipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateRequestModalOpen, setIsCreateRequestModalOpen] = useState(false);

  // Mock data
  const equipment = {
    id: 1,
    name: 'CNC Machine #5',
    serialNumber: 'CNC-2024-005',
    category: 'CNC Machines',
    status: 'operational',
    department: 'Production',
    assignedTo: 'John Doe',
    assignedTeam: 'Mechanics Team',
    assignedTechnician: 'Mike Johnson',
    location: 'Building A, Floor 2, Bay 5',
    purchaseDate: '2024-01-15',
    warrantyExpiry: '2027-01-15',
    lastMaintenance: '2024-12-15',
    nextMaintenance: '2025-01-15',
  };

  // Convert equipment data to form format
  const equipmentFormData: EquipmentFormData = {
    name: equipment.name,
    equipmentCategory: equipment.category,
    company: '',
    usedBy: 'Employee',
    maintenanceTeam: equipment.assignedTeam,
    assignedDate: equipment.purchaseDate,
    technician: equipment.assignedTechnician,
    employee: equipment.assignedTo,
    scrapDate: '',
    usedInLocation: equipment.location,
    workCenter: equipment.department,
  };

  const handleEditEquipment = (data: EquipmentFormData) => {
    console.log('Updated equipment data:', data);
    // TODO: Send updated data to backend API
    setIsEditModalOpen(false);
  };

  const handleDeleteEquipment = () => {
    console.log('Deleting equipment:', id);
    // TODO: Send delete request to backend API
    setIsDeleteDialogOpen(false);
    // Navigate back to equipment list after deletion
    navigate('/equipment');
  };

  const handleCreateRequest = (data: any) => {
    console.log('Creating maintenance request:', data);
    // TODO: Send request to backend API
    setIsCreateRequestModalOpen(false);
  };

  const maintenanceHistory = [
    {
      id: 'REQ-2024-156',
      date: '2024-12-15',
      type: 'preventive',
      status: 'repaired',
      technician: 'Mike Johnson',
      duration: '2.5 hours',
      description: 'Regular preventive maintenance',
    },
    {
      id: 'REQ-2024-142',
      date: '2024-11-20',
      type: 'corrective',
      status: 'repaired',
      technician: 'Sarah Wilson',
      duration: '4 hours',
      description: 'Belt replacement and calibration',
    },
    {
      id: 'REQ-2024-089',
      date: '2024-10-10',
      type: 'preventive',
      status: 'repaired',
      technician: 'Mike Johnson',
      duration: '1.5 hours',
      description: 'Oil change and inspection',
    },
  ];

  const activeRequests = [
    {
      id: 'REQ-2025-003',
      subject: 'Strange noise during operation',
      type: 'corrective',
      status: 'in_progress',
      technician: 'Mike Johnson',
      createdDate: '2024-12-26',
      priority: 'high',
    },
    {
      id: 'REQ-2025-001',
      subject: 'Routine inspection needed',
      type: 'preventive',
      status: 'new',
      technician: 'Unassigned',
      createdDate: '2024-12-24',
      priority: 'medium',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'success';
      case 'maintenance': return 'warning';
      case 'down': return 'danger';
      default: return 'default';
    }
  };

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'primary';
      case 'in_progress': return 'warning';
      case 'repaired': return 'success';
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/equipment')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{equipment.name}</h1>
            <p className="text-gray-600 mt-1">{equipment.serialNumber}</p>
          </div>
          <Badge variant={getStatusColor(equipment.status)} size="md">
            {equipment.status.toUpperCase()}
          </Badge>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon={<FiEdit />} onClick={() => setIsEditModalOpen(true)}>
            Edit
          </Button>
          <Button variant="danger" icon={<FiTrash2 />} onClick={() => setIsDeleteDialogOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Equipment Information */}
          <Card title="Equipment Information">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiPackage className="w-4 h-4" />
                    Category
                  </label>
                  <p className="mt-1 text-gray-900 font-medium">{equipment.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    Department
                  </label>
                  <p className="mt-1 text-gray-900 font-medium">{equipment.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    Assigned To
                  </label>
                  <p className="mt-1 text-gray-900 font-medium">{equipment.assignedTo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Assigned Team</label>
                  <p className="mt-1 text-gray-900 font-medium">{equipment.assignedTeam}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Default Technician</label>
                  <p className="mt-1 text-gray-900 font-medium">{equipment.assignedTechnician}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiMapPin className="w-4 h-4" />
                    Location
                  </label>
                  <p className="mt-1 text-gray-900 font-medium">{equipment.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    Purchase Date
                  </label>
                  <p className="mt-1 text-gray-900 font-medium">{equipment.purchaseDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Warranty Expiry</label>
                  <p className="mt-1 text-gray-900 font-medium">{equipment.warrantyExpiry}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Active Requests - Smart Button Section */}
          <Card 
            title="Active Maintenance Requests"
            actions={
              <Button variant="primary" size="sm" icon={<FiCalendar />} onClick={() => setIsCreateRequestModalOpen(true)}>
                Create Request
              </Button>
            }
          >
            {activeRequests.length > 0 ? (
              <div className="space-y-4">
                {activeRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-900">{request.id}</span>
                          <Badge variant={getRequestStatusColor(request.status)} size="sm">
                            {request.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant={getPriorityColor(request.priority)} size="sm">
                            {request.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-900 font-medium mb-1">{request.subject}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Type: {request.type}</span>
                          <span>•</span>
                          <span>Technician: {request.technician}</span>
                          <span>•</span>
                          <span>Created: {request.createdDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No active maintenance requests</p>
              </div>
            )}
          </Card>

          {/* Maintenance History */}
          <Card title="Maintenance History">
            <div className="space-y-3">
              {maintenanceHistory.map((record) => (
                <div
                  key={record.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-20 text-center">
                    <div className="text-sm font-semibold text-blue-600">
                      {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(record.date).getFullYear()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-900">{record.id}</span>
                      <Badge variant={record.type === 'preventive' ? 'primary' : 'warning'} size="sm">
                        {record.type.toUpperCase()}
                      </Badge>
                      <Badge variant="success" size="sm">
                        {record.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-gray-900 mb-1">{record.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Technician: {record.technician}</span>
                      <span>•</span>
                      <span>Duration: {record.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Quick Stats */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card title="Quick Stats">
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {activeRequests.length}
                </div>
                <p className="text-sm text-red-700 font-medium">Open Requests</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {maintenanceHistory.length}
                </div>
                <p className="text-sm text-green-700 font-medium">Completed Jobs</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {equipment.nextMaintenance}
                </div>
                <p className="text-sm text-blue-700 font-medium">Next Maintenance</p>
              </div>
            </div>
          </Card>

          {/* Warranty Information */}
          <Card title="Warranty & Dates">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Purchase Date</span>
                <span className="text-sm font-medium text-gray-900">{equipment.purchaseDate}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Warranty Expires</span>
                <span className="text-sm font-medium text-gray-900">{equipment.warrantyExpiry}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Last Service</span>
                <span className="text-sm font-medium text-gray-900">{equipment.lastMaintenance}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Next Service</span>
                <span className="text-sm font-medium text-blue-600">{equipment.nextMaintenance}</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="space-y-2">
              <Button variant="primary" size="md" className="w-full" icon={<FiCalendar />}>
                Schedule Maintenance
              </Button>
              <Button variant="secondary" size="md" className="w-full">
                View Full History
              </Button>
              <Button variant="secondary" size="md" className="w-full">
                Download Report
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Equipment Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Equipment"
        size="xl"
      >
        <AddEquipmentForm
          equipment={equipmentFormData}
          mode="edit"
          onSubmit={handleEditEquipment}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteEquipment}
        equipmentName={equipment.name}
      />

      {/* Create Request Modal */}
      <RequestForm
        isOpen={isCreateRequestModalOpen}
        onClose={() => setIsCreateRequestModalOpen(false)}
        onSubmit={handleCreateRequest}
      />
    </Layout>
  );
}
