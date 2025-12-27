import { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import WorkCenterForm, { WorkCenterFormData } from '../components/workcenters/WorkCenterForm';
import DeleteConfirmDialog from '../components/equipment/DeleteConfirmDialog';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiMapPin } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

interface WorkCenter {
  id: number;
  name: string;
  code: string;
  category: string;
  location: string | null;
  departmentId: number | null;
  departmentName: string | null;
  assignedTeamId: number | null;
  assignedTeamName: string | null;
  status: 'active' | 'inactive' | 'maintenance';
  capacity: number;
  utilization?: number;
  openRequests?: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Team {
  id: number;
  name: string;
}

export default function WorkCenters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWorkCenter, setSelectedWorkCenter] = useState<WorkCenter | null>(null);
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [workCentersRes, teamsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/work-centers?includeUtilization=true', config),
        axios.get('http://localhost:5000/api/teams', config),
      ]);

      setWorkCenters(workCentersRes.data.data || []);
      setTeams(teamsRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load work centers');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Manufacturing', 'Assembly', 'Logistics', 'QC', 'Packaging', 'Testing', 'Other'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'maintenance': return 'warning';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600';
    if (utilization >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredWorkCenters = workCenters.filter(wc =>
    wc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (wc.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddWorkCenter = async (data: WorkCenterFormData) => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: data.name,
        code: data.code,
        category: data.category,
        location: data.location,
        departmentId: data.department ? parseInt(data.department) : undefined,
        assignedTeamId: data.assignedTeam ? parseInt(data.assignedTeam) : undefined,
        capacity: 100,
        description: '',
      };

      await axios.post('http://localhost:5000/api/work-centers', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Work center created successfully!');
      setShowAddForm(false);
      fetchAllData();
    } catch (error: any) {
      console.error('Failed to create work center:', error);
      toast.error(error.response?.data?.message || 'Failed to create work center');
    }
  };

  const handleEditWorkCenter = async (data: WorkCenterFormData) => {
    if (!selectedWorkCenter) return;

    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: data.name,
        code: data.code,
        category: data.category,
        location: data.location,
        departmentId: data.department ? parseInt(data.department) : undefined,
        assignedTeamId: data.assignedTeam ? parseInt(data.assignedTeam) : undefined,
      };

      await axios.put(
        `http://localhost:5000/api/work-centers/${selectedWorkCenter.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Work center updated successfully!');
      setIsEditModalOpen(false);
      setSelectedWorkCenter(null);
      fetchAllData();
    } catch (error: any) {
      console.error('Failed to update work center:', error);
      toast.error(error.response?.data?.message || 'Failed to update work center');
    }
  };

  const handleDeleteWorkCenter = async () => {
    if (!selectedWorkCenter) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/work-centers/${selectedWorkCenter.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Work center deleted successfully!');
      setIsDeleteDialogOpen(false);
      setSelectedWorkCenter(null);
      fetchAllData();
    } catch (error: any) {
      console.error('Failed to delete work center:', error);
      toast.error(error.response?.data?.message || 'Failed to delete work center');
    }
  };

  const openEditModal = (wc: WorkCenter) => {
    setSelectedWorkCenter(wc);
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (wc: WorkCenter) => {
    setSelectedWorkCenter(wc);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Work Centers</h1>
          <p className="text-gray-600 mt-1">Manage production and operational work centers</p>
        </div>
        <Button variant="primary" icon={<FiPlus />} onClick={() => setShowAddForm(true)}>
          Add Work Center
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 text-lg">Loading work centers...</div>
        </div>
      ) : (
        <>
          {/* Search */}
          <Card className="mb-6">
            <div className="p-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search work centers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </Card>

          {/* Work Centers Grid */}
          {filteredWorkCenters.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500 text-lg">No work centers found</p>
              <p className="text-gray-400 text-sm mt-2">
                {searchTerm ? 'Try adjusting your search criteria' : 'Create your first work center to get started'}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkCenters.map((wc) => (
          <Card key={wc.id} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{wc.name}</h3>
                  <p className="text-sm text-gray-500">{wc.code}</p>
                </div>
                <Badge variant={getStatusColor(wc.status)}>
                  {wc.status.toUpperCase()}
                </Badge>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-gray-900">{wc.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium text-gray-900">{wc.departmentName || 'Not assigned'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <FiMapPin className="w-3 h-3" />
                    Location:
                  </span>
                  <span className="font-medium text-gray-900 text-right">{wc.location || 'Not specified'}</span>
                </div>
                {wc.assignedTeamName && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Team:</span>
                    <span className="font-medium text-gray-900">{wc.assignedTeamName}</span>
                  </div>
                )}
              </div>

              {/* Utilization Bar */}
              {wc.utilization !== undefined && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Utilization</span>
                    <span className={`font-semibold ${getUtilizationColor(wc.utilization)}`}>
                      {wc.utilization}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        wc.utilization >= 90
                          ? 'bg-red-500'
                          : wc.utilization >= 70
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${wc.utilization}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Capacity */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Capacity</span>
                  <span className="text-lg font-bold text-blue-600">{wc.capacity}</span>
                </div>
              </div>

              {/* Smart Button */}
              <button
                className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  (wc.openRequests || 0) > 0
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {(wc.openRequests || 0) > 0 ? (
                  <span className="flex items-center justify-center">
                    🔧 {wc.openRequests} Open Request{(wc.openRequests || 0) > 1 ? 's' : ''}
                  </span>
                ) : (
                  <span>No Maintenance Needed</span>
                )}
              </button>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => openEditModal(wc)}
                  className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <FiEdit className="inline mr-1" /> Edit
                </button>
                <button 
                  onClick={() => openDeleteDialog(wc)}
                  className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <FiTrash2 className="inline mr-1" /> Delete
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
          )}
        </>
      )}

      {/* Add Work Center Modal */}
      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Add Work Center"
        size="lg"
      >
        <WorkCenterForm
          onSubmit={handleAddWorkCenter}
          onCancel={() => setShowAddForm(false)}
          categories={categories}
          teams={teams.map(t => ({ id: t.id.toString(), name: t.name }))}
        />
      </Modal>

      {/* Edit Work Center Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedWorkCenter(null);
        }}
        title="Edit Work Center"
        size="lg"
      >
        {selectedWorkCenter && (
          <WorkCenterForm
            workCenter={{
              name: selectedWorkCenter.name,
              code: selectedWorkCenter.code,
              category: selectedWorkCenter.category,
              location: selectedWorkCenter.location || '',
              department: selectedWorkCenter.departmentId?.toString() || '',
              assignedTeam: selectedWorkCenter.assignedTeamId?.toString() || '',
            }}
            mode="edit"
            onSubmit={handleEditWorkCenter}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedWorkCenter(null);
            }}
            categories={categories}
            teams={teams.map(t => ({ id: t.id.toString(), name: t.name }))}
          />
        )}
      </Modal>

      {/* Delete Work Center Confirmation */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedWorkCenter(null);
        }}
        onConfirm={handleDeleteWorkCenter}
        equipmentName={selectedWorkCenter?.name || ''}
      />
    </Layout>
  );
}
