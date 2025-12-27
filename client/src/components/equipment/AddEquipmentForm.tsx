import { useState, FormEvent } from 'react';
import Button from '../common/Button';
import { FiCheck, FiX } from 'react-icons/fi';

interface AddEquipmentFormProps {
  onSubmit: (data: EquipmentFormData) => void;
  onCancel: () => void;
}

export interface EquipmentFormData {
  name: string;
  equipmentCategory: string;
  company: string;
  usedBy: string;
  maintenanceTeam: string;
  assignedDate: string;
  technician: string;
  employee: string;
  scrapDate: string;
  usedInLocation: string;
  workCenter: string;
}

export default function AddEquipmentForm({ onSubmit, onCancel }: AddEquipmentFormProps) {
  const [formData, setFormData] = useState<EquipmentFormData>({
    name: '',
    equipmentCategory: '',
    company: '',
    usedBy: 'Employee',
    maintenanceTeam: '',
    assignedDate: '',
    technician: '',
    employee: '',
    scrapDate: '',
    usedInLocation: '',
    workCenter: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EquipmentFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof EquipmentFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EquipmentFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.equipmentCategory) {
      newErrors.equipmentCategory = 'Equipment Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const errorClasses = "text-red-500 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="md:col-span-2">
          <label htmlFor="name" className={labelClasses}>
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Samsung Monitor 15"
          />
          {errors.name && <p className={errorClasses}>{errors.name}</p>}
        </div>

        {/* Equipment Category */}
        <div>
          <label htmlFor="equipmentCategory" className={labelClasses}>
            Equipment Category <span className="text-red-500">*</span>
          </label>
          <select
            id="equipmentCategory"
            name="equipmentCategory"
            value={formData.equipmentCategory}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="">Monitors</option>
            <option value="CNC Machines">CNC Machines</option>
            <option value="Vehicles">Vehicles</option>
            <option value="HVAC Equipment">HVAC Equipment</option>
            <option value="Computers">Computers</option>
            <option value="Power Systems">Power Systems</option>
            <option value="Tools">Tools</option>
            <option value="Other">Other</option>
          </select>
          {errors.equipmentCategory && <p className={errorClasses}>{errors.equipmentCategory}</p>}
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company" className={labelClasses}>
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={inputClasses}
            placeholder="My Company (San Francisco)"
          />
        </div>

        {/* Used By */}
        <div>
          <label htmlFor="usedBy" className={labelClasses}>
            Used By
          </label>
          <select
            id="usedBy"
            name="usedBy"
            value={formData.usedBy}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="Employee">Employee</option>
            <option value="Department">Department</option>
            <option value="External">External</option>
          </select>
        </div>

        {/* Maintenance Team */}
        <div>
          <label htmlFor="maintenanceTeam" className={labelClasses}>
            Maintenance Team
          </label>
          <input
            type="text"
            id="maintenanceTeam"
            name="maintenanceTeam"
            value={formData.maintenanceTeam}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Internal Maintenance"
          />
        </div>

        {/* Assigned Date */}
        <div>
          <label htmlFor="assignedDate" className={labelClasses}>
            Assigned Date
          </label>
          <input
            type="date"
            id="assignedDate"
            name="assignedDate"
            value={formData.assignedDate}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Technician */}
        <div>
          <label htmlFor="technician" className={labelClasses}>
            Technician
          </label>
          <input
            type="text"
            id="technician"
            name="technician"
            value={formData.technician}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Mitchell Admin"
          />
        </div>

        {/* Employee */}
        <div>
          <label htmlFor="employee" className={labelClasses}>
            Employee
          </label>
          <input
            type="text"
            id="employee"
            name="employee"
            value={formData.employee}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Abigail Peterson"
          />
        </div>

        {/* Scrap Date */}
        <div>
          <label htmlFor="scrapDate" className={labelClasses}>
            Scrap Date
          </label>
          <input
            type="date"
            id="scrapDate"
            name="scrapDate"
            value={formData.scrapDate}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Used in location */}
        <div>
          <label htmlFor="usedInLocation" className={labelClasses}>
            Used in location
          </label>
          <input
            type="text"
            id="usedInLocation"
            name="usedInLocation"
            value={formData.usedInLocation}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Work Center */}
        <div>
          <label htmlFor="workCenter" className={labelClasses}>
            Work Center
          </label>
          <input
            type="text"
            id="workCenter"
            name="workCenter"
            value={formData.workCenter}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          icon={<FiX />}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          icon={<FiCheck />}
        >
          Add Equipment
        </Button>
      </div>
    </form>
  );
}
