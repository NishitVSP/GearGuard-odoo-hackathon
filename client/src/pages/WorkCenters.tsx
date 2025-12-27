import { useState } from 'react';
import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiMapPin } from 'react-icons/fi';

interface WorkCenter {
  id: number;
  name: string;
  code: string;
  category: string;
  location: string;
  department: string;
  assignedTeam: string;
  status: 'active' | 'inactive' | 'maintenance';
  capacity: number;
  utilization: number;
  openRequests: number;
}

export default function WorkCenters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWorkCenter, setNewWorkCenter] = useState({
    name: '',
    code: '',
    category: '',
    location: '',
    department: '',
    assignedTeam: '',
  });

  // Mock data
  const workCenters: WorkCenter[] = [
    {
      id: 1,
      name: 'Production Floor A',
      code: 'WC-PROD-A',
      category: 'Manufacturing',
      location: 'Building 1, Floor 1',
      department: 'Production',
      assignedTeam: 'Mechanics Team',
      status: 'active',
      capacity: 100,
      utilization: 85,
      openRequests: 2,
    },
    {
      id: 2,
      name: 'Assembly Line 1',
      code: 'WC-ASM-01',
      category: 'Assembly',
      location: 'Building 1, Floor 2',
      department: 'Production',
      assignedTeam: 'Mechanics Team',
      status: 'active',
      capacity: 80,
      utilization: 92,
      openRequests: 1,
    },
    {
      id: 3,
      name: 'Warehouse Zone B',
      code: 'WC-WH-B',
      category: 'Logistics',
      location: 'Building 2, Ground Floor',
      department: 'Warehouse',
      assignedTeam: 'Facilities Team',
      status: 'active',
      capacity: 150,
      utilization: 65,
      openRequests: 0,
    },
    {
      id: 4,
      name: 'Quality Control Lab',
      code: 'WC-QC-LAB',
      category: 'QC',
      location: 'Building 1, Floor 3',
      department: 'Quality',
      assignedTeam: 'IT Support Team',
      status: 'active',
      capacity: 50,
      utilization: 78,
      openRequests: 3,
    },
    {
      id: 5,
      name: 'Packaging Station',
      code: 'WC-PKG-01',
      category: 'Packaging',
      location: 'Building 1, Floor 1',
      department: 'Production',
      assignedTeam: 'Mechanics Team',
      status: 'maintenance',
      capacity: 60,
      utilization: 0,
      openRequests: 1,
    },
    {
      id: 6,
      name: 'Testing Area',
      code: 'WC-TEST-01',
      category: 'Testing',
      location: 'Building 1, Floor 3',
      department: 'Quality',
      assignedTeam: 'Electricians Team',
      status: 'active',
      capacity: 40,
      utilization: 55,
      openRequests: 0,
    },
  ];

  const categories = ['Manufacturing', 'Assembly', 'Logistics', 'QC', 'Packaging', 'Testing'];
  const teams = ['Mechanics Team', 'Electricians Team', 'IT Support Team', 'Facilities Team', 'HVAC Team'];

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
    wc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddWorkCenter = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call
    console.log('Adding work center:', newWorkCenter);
    setShowAddForm(false);
    setNewWorkCenter({
      name: '',
      code: '',
      category: '',
      location: '',
      department: '',
      assignedTeam: '',
    });
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
                  <span className="font-medium text-gray-900">{wc.department}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <FiMapPin className="w-3 h-3" />
                    Location:
                  </span>
                  <span className="font-medium text-gray-900 text-right">{wc.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Team:</span>
                  <span className="font-medium text-gray-900">{wc.assignedTeam}</span>
                </div>
              </div>

              {/* Utilization Bar */}
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
                  wc.openRequests > 0
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {wc.openRequests > 0 ? (
                  <span className="flex items-center justify-center">
                    🔧 {wc.openRequests} Open Request{wc.openRequests > 1 ? 's' : ''}
                  </span>
                ) : (
                  <span>No Maintenance Needed</span>
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

      {/* Add Work Center Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add Work Center</h2>
            </div>
            <form onSubmit={handleAddWorkCenter} className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newWorkCenter.name}
                    onChange={(e) => setNewWorkCenter({ ...newWorkCenter, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Production Floor A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newWorkCenter.code}
                    onChange={(e) => setNewWorkCenter({ ...newWorkCenter, code: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="WC-PROD-A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={newWorkCenter.category}
                    onChange={(e) => setNewWorkCenter({ ...newWorkCenter, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newWorkCenter.department}
                    onChange={(e) => setNewWorkCenter({ ...newWorkCenter, department: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Production"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newWorkCenter.location}
                    onChange={(e) => setNewWorkCenter({ ...newWorkCenter, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Building 1, Floor 1"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Team <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={newWorkCenter.assignedTeam}
                    onChange={(e) => setNewWorkCenter({ ...newWorkCenter, assignedTeam: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Team</option>
                    {teams.map(team => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="secondary" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Add Work Center
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
