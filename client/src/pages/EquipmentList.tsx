import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { FiPlus, FiSearch, FiFilter, FiEdit, FiTrash2 } from 'react-icons/fi';

export default function EquipmentList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock data
  const equipment = [
    {
      id: 1,
      name: 'CNC Machine #5',
      serialNumber: 'CNC-2024-005',
      category: 'CNC Machines',
      status: 'operational',
      department: 'Production',
      assignedTo: 'John Doe',
      lastMaintenance: '2024-12-15',
      openRequests: 2,
    },
    {
      id: 2,
      name: 'Forklift #12',
      serialNumber: 'FLT-2023-012',
      category: 'Vehicles',
      status: 'operational',
      department: 'Warehouse',
      assignedTo: 'Jane Smith',
      lastMaintenance: '2024-12-20',
      openRequests: 1,
    },
    {
      id: 3,
      name: 'Air Compressor',
      serialNumber: 'CMP-2022-008',
      category: 'HVAC Equipment',
      status: 'maintenance',
      department: 'Facilities',
      assignedTo: 'Mike Johnson',
      lastMaintenance: '2024-11-30',
      openRequests: 3,
    },
    {
      id: 4,
      name: 'Lathe Machine #3',
      serialNumber: 'LTH-2024-003',
      category: 'CNC Machines',
      status: 'operational',
      department: 'Production',
      assignedTo: 'Sarah Wilson',
      lastMaintenance: '2024-12-10',
      openRequests: 0,
    },
    {
      id: 5,
      name: 'Dell Workstation',
      serialNumber: 'WKS-2024-042',
      category: 'Computers',
      status: 'operational',
      department: 'IT',
      assignedTo: 'Tom Brown',
      lastMaintenance: '2024-12-01',
      openRequests: 0,
    },
    {
      id: 6,
      name: 'Generator #1',
      serialNumber: 'GEN-2021-001',
      category: 'Power Systems',
      status: 'operational',
      department: 'Facilities',
      assignedTo: 'Unassigned',
      lastMaintenance: '2024-12-22',
      openRequests: 0,
    },
  ];

  const categories = ['all', 'CNC Machines', 'Vehicles', 'HVAC Equipment', 'Computers', 'Power Systems'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'success';
      case 'maintenance': return 'warning';
      case 'down': return 'danger';
      default: return 'default';
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment</h1>
          <p className="text-gray-600 mt-1">Manage your equipment inventory</p>
        </div>
        <Button variant="primary" icon={<FiPlus />}>
          Add Equipment
        </Button>
      </div>

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
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.serialNumber}</p>
                </div>
                <Badge variant={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-gray-900">{item.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium text-gray-900">{item.department}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Assigned To:</span>
                  <span className="font-medium text-gray-900">{item.assignedTo}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Service:</span>
                  <span className="font-medium text-gray-900">{item.lastMaintenance}</span>
                </div>
              </div>

              {/* Smart Button */}
              <button
                onClick={() => navigate(`/equipment/${item.id}`)}
                className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  item.openRequests > 0
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {item.openRequests > 0 ? (
                  <span className="flex items-center justify-center">
                    🔧 {item.openRequests} Open Request{item.openRequests > 1 ? 's' : ''}
                  </span>
                ) : (
                  <span>View Details</span>
                )}
              </button>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                <button className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                  <FiEdit className="inline mr-1" /> Edit
                </button>
                <button className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                  <FiTrash2 className="inline mr-1" /> Delete
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEquipment.length === 0 && (
        <Card>
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No equipment found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <Button variant="primary" icon={<FiPlus />}>
              Add New Equipment
            </Button>
          </div>
        </Card>
      )}
    </Layout>
  );
}
