import { useState, useEffect } from 'react';
import Button from '../common/Button';
import { FiX } from 'react-icons/fi';
import { getEquipment, getTechnicians } from '../../services/api';
import toast from 'react-hot-toast';

interface RequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RequestFormData) => void;
}

export interface RequestFormData {
  subject: string;
  maintenanceFor: 'equipment' | 'workcenter';
  equipmentId?: string;
  workCenterId?: string;
  category: string;
  requestDate: string;
  maintenanceType: 'corrective' | 'preventive';
  team: string;
  technician: string;
  scheduledDate?: string;
  scheduledTime?: string;
  duration: string;
  priority: 'low' | 'medium' | 'high';
  company: string;
  notes: string;
  instructions: string;
}

export default function RequestForm({ isOpen, onClose, onSubmit }: RequestFormProps) {
  const [formData, setFormData] = useState<RequestFormData>({
    subject: '',
    maintenanceFor: 'equipment',
    equipmentId: '',
    workCenterId: '',
    category: '',
    requestDate: new Date().toISOString().split('T')[0],
    maintenanceType: 'corrective',
    team: '',
    technician: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: '0.00',
    priority: 'medium',
    company: '',
    notes: '',
    instructions: '',
  });

  const [equipment, setEquipment] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch data from API
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [equipmentData, techniciansData] = await Promise.all([
        getEquipment({ limit: 100 }),
        getTechnicians(),
      ]);
      
      setEquipment(equipmentData.items || []);
      setTechnicians(techniciansData || []);
    } catch (error) {
      console.error('Failed to fetch form data:', error);
      toast.error('Failed to load form data');
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill when equipment is selected
  useEffect(() => {
    if (formData.maintenanceFor === 'equipment' && formData.equipmentId) {
      const selected = equipment.find(e => e.id.toString() === formData.equipmentId);
      if (selected) {
        setFormData(prev => ({
          ...prev,
          category: selected.category_name || '',
          team: selected.team_name || '',
        }));
      }
    }
  }, [formData.equipmentId, formData.maintenanceFor, equipment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">New Maintenance Request</h2>
            <p className="text-sm text-gray-600 mt-1">Create a new maintenance activity</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Loading form data...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject? <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Test activity"
                />
              </div>

              {/* Created By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Created By
                </label>
                <input
                  type="text"
                  value="Mitchell Admin"
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              {/* Maintenance For */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maintenance For <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="maintenanceFor"
                      value="equipment"
                      checked={formData.maintenanceFor === 'equipment'}
                      onChange={() => setFormData({ ...formData, maintenanceFor: 'equipment', equipmentId: '', workCenterId: '' })}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Equipment</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="maintenanceFor"
                      value="workcenter"
                      checked={formData.maintenanceFor === 'workcenter'}
                      onChange={() => setFormData({ ...formData, maintenanceFor: 'workcenter', equipmentId: '', workCenterId: '' })}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Work Center</span>
                  </label>
                </div>

                {formData.maintenanceFor === 'equipment' ? (
                  <select
                    required
                    value={formData.equipmentId}
                    onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Equipment</option>
                    {equipment.map((eq) => (
                      <option key={eq.id} value={eq.id}>
                        {eq.name} - {eq.equipment_code}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-sm text-gray-500 italic">Work Center selection coming soon</div>
                )}
              </div>

              {/* Category (Auto-filled) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  placeholder="Auto-filled from equipment"
                />
              </div>

              {/* Request Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Date?
                </label>
                <input
                  type="date"
                  value={formData.requestDate}
                  onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Maintenance Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maintenance Type <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="maintenanceType"
                      value="corrective"
                      checked={formData.maintenanceType === 'corrective'}
                      onChange={() => setFormData({ ...formData, maintenanceType: 'corrective' })}
                      className="mr-2"
                    />
                    <span className="text-gray-700">● Corrective</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="maintenanceType"
                      value="preventive"
                      checked={formData.maintenanceType === 'preventive'}
                      onChange={() => setFormData({ ...formData, maintenanceType: 'preventive' })}
                      className="mr-2"
                    />
                    <span className="text-gray-700">○ Preventive</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Team (Auto-filled) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team
                </label>
                <input
                  type="text"
                  value={formData.team}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  placeholder="Auto-filled from equipment"
                />
              </div>

              {/* Technician */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technician
                </label>
                <select
                  value={formData.technician}
                  onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Technician</option>
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name} {tech.team_name ? `(${tech.team_name})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scheduled Date (for Preventive) */}
              {formData.maintenanceType === 'preventive' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled Date?
                    </label>
                    <input
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled Time
                    </label>
                    <input
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: p as any })}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                        formData.priority === p
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className={`w-6 h-6 mx-auto ${
                        formData.priority === p ? 'bg-blue-500' : 'bg-gray-300'
                      } rounded transform rotate-45`}></div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="My Company (San Francisco)"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium"
              >
                Notes
              </button>
              <button
                type="button"
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                Instructions
              </button>
            </div>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add notes here..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Request
            </Button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
