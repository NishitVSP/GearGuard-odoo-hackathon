import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import AddEquipmentForm, { EquipmentFormData } from '../components/equipment/AddEquipmentForm';
import DeleteConfirmDialog from '../components/equipment/DeleteConfirmDialog';
import { FiPlus, FiSearch, FiFilter, FiEdit, FiTrash2 } from 'react-icons/fi';
import { 
  getEquipment, 
  createEquipment, 
  updateEquipment, 
  deleteEquipment,
  getEquipmentCategories,
  Equipment,
  CreateEquipmentDto 
} from '../services/api';

export default function EquipmentList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<any>(null);
  const [deletingEquipment, setDeletingEquipment] = useState<Equipment | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [categories, setCategories] = useState<Array<{id: number; name: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load equipment data
  useEffect(() => {
    loadEquipment();
  }, [searchTerm, filterCategory]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const response = await getEquipment({
        search: searchTerm,
        category: filterCategory === 'all' ? '' : filterCategory,
        limit: 100,
      });
      setEquipment(response.items);
      setError(null);
    } catch (err) {
      console.error('Error loading equipment:', err);
      setError('Failed to load equipment');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await getEquipmentCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleAddEquipment = async (data: EquipmentFormData) => {
    try {
      const category = categories.find(c => c.name === data.equipmentCategory);
      if (!category) {
        alert('Please select a valid category');
        return;
      }

      const equipmentData: CreateEquipmentDto = {
        name: data.name,
        equipment_code: `EQ-${Date.now()}`,
        category_id: category.id,
        assigned_team_id: 1, // Default team
        location: data.usedInLocation,
        status: 'operational',
        manufacturer: data.company || undefined,
        model: data.technician || undefined,
        serial_number: data.employee || undefined,
        purchase_date: data.assignedDate || undefined,
        warranty_expiry_date: data.scrapDate || undefined,
      };
      
      await createEquipment(equipmentData);
      setIsModalOpen(false);
      loadEquipment();
    } catch (err) {
      console.error('Error creating equipment:', err);
      alert('Failed to create equipment');
    }
  };

  const handleEditEquipment = async (data: EquipmentFormData) => {
    try {
      if (!editingEquipment) return;

      const category = categories.find(c => c.name === data.equipmentCategory);
      
      const equipmentData: Partial<CreateEquipmentDto> = {
        name: data.name,
        location: data.usedInLocation,
        manufacturer: data.company,
        model: data.technician,
        serial_number: data.employee,
        purchase_date: data.assignedDate || undefined,
        warranty_expiry_date: data.scrapDate || undefined,
        ...(category && { category_id: category.id }),
      };
      
      await updateEquipment(editingEquipment.id, equipmentData);
      setEditingEquipment(null);
      loadEquipment();
    } catch (err) {
      console.error('Error updating equipment:', err);
      alert('Failed to update equipment');
    }
  };

  const handleDeleteEquipment = async () => {
    try {
      if (!deletingEquipment) return;
      
      await deleteEquipment(deletingEquipment.id);
      setDeletingEquipment(null);
      loadEquipment();
    } catch (err) {
      console.error('Error deleting equipment:', err);
      alert('Failed to delete equipment');
    }
  };

  const openEditModal = (item: Equipment) => {
    const equipmentData: EquipmentFormData = {
      name: item.name,
      equipmentCategory: item.category_name || '',
      company: item.manufacturer || '',
      usedBy: 'Employee',
      maintenanceTeam: item.team_name || '',
      assignedDate: item.purchase_date ? item.purchase_date.split('T')[0] : '',
      technician: item.model || '',
      employee: item.serial_number || '',
      scrapDate: item.warranty_expiry_date ? item.warranty_expiry_date.split('T')[0] : '',
      usedInLocation: item.location || '',
      workCenter: item.department_name || '',
    };
    setEditingEquipment({ ...item, formData: equipmentData });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'success';
      case 'under_maintenance': return 'warning';
      case 'broken': return 'danger';
      case 'scrapped': return 'default';
      default: return 'default';
    }
  };

  const filteredEquipment = equipment;

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment</h1>
          <p className="text-gray-600 mt-1">Manage your equipment inventory</p>
        </div>
        <Button variant="primary" icon={<FiPlus />} onClick={() => setIsModalOpen(true)}>
          Add Equipment
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading equipment...</p>
        </div>
      )}

      {/* Equipment Grid */}
      {!loading && filteredEquipment.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.equipment_code}</p>
                  </div>
                  <Badge variant={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium text-gray-900">{item.category_name}</span>
                  </div>
                  {item.team_name && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Team:</span>
                      <span className="font-medium text-gray-900">{item.team_name}</span>
                    </div>
                  )}
                  {item.location && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium text-gray-900">{item.location}</span>
                    </div>
                  )}
                  {item.purchase_date && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Purchased:</span>
                      <span className="font-medium text-gray-900">{new Date(item.purchase_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Smart Button */}
                <button
                  onClick={() => navigate(`/equipment/${item.id}`)}
                  className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    (item.open_requests || 0) > 0
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {(item.open_requests || 0) > 0 ? (
                    <span className="flex items-center justify-center">
                      🔧 {item.open_requests} Open Request{(item.open_requests || 0) > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span>View Details</span>
                  )}
                </button>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(item);
                    }}
                    className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <FiEdit className="inline mr-1" /> Edit
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingEquipment(item);
                    }}
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

      {/* Empty State */}
      {!loading && filteredEquipment.length === 0 && (
        <Card>
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No equipment found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Get started by adding your first equipment'}
            </p>
            <Button variant="primary" icon={<FiPlus />} onClick={() => setIsModalOpen(true)}>
              Add New Equipment
            </Button>
          </div>
        </Card>
      )}

      {/* Add Equipment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Equipment"
        size="xl"
      >
        <AddEquipmentForm
          onSubmit={handleAddEquipment}
          onCancel={() => setIsModalOpen(false)}
          categories={categories}
        />
      </Modal>

      {/* Edit Equipment Modal */}
      <Modal
        isOpen={!!editingEquipment}
        onClose={() => setEditingEquipment(null)}
        title="Edit Equipment"
        size="xl"
      >
        {editingEquipment && (
          <AddEquipmentForm
            equipment={editingEquipment.formData}
            mode="edit"
            onSubmit={handleEditEquipment}
            onCancel={() => setEditingEquipment(null)}
            categories={categories}
          />
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deletingEquipment}
        onClose={() => setDeletingEquipment(null)}
        onConfirm={handleDeleteEquipment}
        equipmentName={deletingEquipment?.name || ''}
      />
    </Layout>
  );
}
