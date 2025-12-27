import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import { 
  getEquipmentById, 
  updateEquipment, 
  deleteEquipment,
  getEquipmentCategories,
  Equipment 
} from '../services/api';

export default function EquipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateRequestModalOpen, setIsCreateRequestModalOpen] = useState(false);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [categories, setCategories] = useState<Array<{id: number; name: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadEquipment();
    }
  }, [id]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await getEquipmentCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const data = await getEquipmentById(parseInt(id!, 10));
      setEquipment(data);
      setError(null);
    } catch (err) {
      console.error('Error loading equipment:', err);
      setError('Failed to load equipment details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEquipment = async (data: EquipmentFormData) => {
    try {
      if (!equipment) return;

      const category = categories.find(c => c.name === data.equipmentCategory);

      await updateEquipment(equipment.id, {
        name: data.name,
        location: data.usedInLocation,
        manufacturer: data.company,
        model: data.technician,
        serial_number: data.employee,
        purchase_date: data.assignedDate || undefined,
        warranty_expiry_date: data.scrapDate || undefined,
        ...(category && { category_id: category.id }),
      });
      
      setIsEditModalOpen(false);
      loadEquipment();
    } catch (err) {
      console.error('Error updating equipment:', err);
      alert('Failed to update equipment');
    }
  };

  const handleDeleteEquipment = async () => {
    try {
      if (!equipment) return;
      
      await deleteEquipment(equipment.id);
      setIsDeleteDialogOpen(false);
      navigate('/equipment');
    } catch (err) {
      console.error('Error deleting equipment:', err);
      alert('Failed to delete equipment');
    }
  };

  const handleCreateRequest = (data: any) => {
    console.log('Creating maintenance request:', data);
    // TODO: Send request to backend API
    setIsCreateRequestModalOpen(false);
    loadEquipment(); // Reload to show new request
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading equipment details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !equipment) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Equipment Not Found</h3>
          <p className="text-gray-600 mb-6">{error || 'The requested equipment could not be found'}</p>
          <Button variant="primary" onClick={() => navigate('/equipment')}>
            Back to Equipment List
          </Button>
        </div>
      </Layout>
    );
  }

  const equipmentFormData: EquipmentFormData = {
    name: equipment.name,
    equipmentCategory: equipment.category_name || '',
    company: equipment.manufacturer || '',
    usedBy: 'Employee',
    maintenanceTeam: equipment.team_name || '',
    assignedDate: equipment.purchase_date ? equipment.purchase_date.split('T')[0] : '',
    technician: equipment.model || '',
    employee: equipment.serial_number || '',
    scrapDate: equipment.warranty_expiry_date ? equipment.warranty_expiry_date.split('T')[0] : '',
    usedInLocation: equipment.location || '',
    workCenter: equipment.department_name || '',
  };

  const activeRequests = (equipment.maintenance_requests || []).filter(
    (req: any) => ['new', 'in_progress', 'assigned'].includes(req.status)
  );

  const maintenanceHistory = (equipment.maintenance_requests || []).filter(
    (req: any) => req.status === 'completed'
  ).slice(0, 10);

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
      case 'assigned': return 'primary';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
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
            <p className="text-gray-600 mt-1">{equipment.equipment_code}</p>
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
                  <p className="mt-1 text-gray-900 font-medium">{equipment.category_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    Department
                  </label>
                  <p className="mt-1 text-gray-900 font-medium">{equipment.department_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    Team
                  </label>
                  <p className="mt-1 text-gray-900 font-medium">{equipment.team_name || 'Unassigned'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Serial Number</label>
                  <p className="mt-1 text-gray-900 font-medium">{equipment.serial_number || 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Model</label>
                  <p className="mt-1 text-gray-900 font-medium">{equipment.model || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiMapPin className="w-4 h-4" />
                    Location
                  </label>
                  <p className="mt-1 text-gray-900 font-medium">{equipment.location || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    Purchase Date
                  </label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {equipment.purchase_date ? new Date(equipment.purchase_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Warranty Expiry</label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {equipment.warranty_expiry ? new Date(equipment.warranty_expiry).toLocaleDateString() : 'N/A'}
                  </p>
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
                          <span className="font-semibold text-gray-900">{request.request_number}</span>
                          <Badge variant={getRequestStatusColor(request.status)} size="sm">
                            {request.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant={getPriorityColor(request.priority)} size="sm">
                            {request.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-900 font-medium mb-1">{request.subject}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Type: {request.request_type}</span>
                          <span>•</span>
                          <span>Technician: {request.technician_name || 'Unassigned'}</span>
                          <span>•</span>
                          <span>Created: {new Date(request.created_at).toLocaleDateString()}</span>
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
                      {new Date(record.completed_at || record.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(record.completed_at || record.created_at).getFullYear()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-900">{record.request_number}</span>
                      <Badge variant={record.request_type === 'preventive' ? 'primary' : 'warning'} size="sm">
                        {record.request_type.toUpperCase()}
                      </Badge>
                      <Badge variant="success" size="sm">
                        COMPLETED
                      </Badge>
                    </div>
                    <p className="text-gray-900 mb-1">{record.subject}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Technician: {record.technician_name || 'N/A'}</span>
                      <span>•</span>
                      <span>Duration: {record.duration_hours ? `${record.duration_hours}h` : 'N/A'}</span>
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
                <div className="text-lg font-bold text-blue-600 mb-1">
                  Not scheduled
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
                <span className="text-sm font-medium text-gray-900">
                  {equipment.purchase_date ? new Date(equipment.purchase_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Warranty Expires</span>
                <span className="text-sm font-medium text-gray-900">
                  {equipment.warranty_expiry_date ? new Date(equipment.warranty_expiry_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Last Service</span>
                <span className="text-sm font-medium text-gray-900">N/A</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Next Service</span>
                <span className="text-sm font-medium text-blue-600">Not scheduled</span>
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
          categories={categories}
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
