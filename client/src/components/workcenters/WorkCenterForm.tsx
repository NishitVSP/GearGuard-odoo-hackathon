import { useState, FormEvent } from 'react';
import Button from '../common/Button';
import { FiCheck, FiX } from 'react-icons/fi';

interface WorkCenterFormProps {
  onSubmit: (data: WorkCenterFormData) => void;
  onCancel: () => void;
  workCenter?: WorkCenterFormData;
  mode?: 'add' | 'edit';
  categories: string[];
  teams: string[];
}

export interface WorkCenterFormData {
  name: string;
  code: string;
  category: string;
  location: string;
  department: string;
  assignedTeam: string;
}

export default function WorkCenterForm({ 
  onSubmit, 
  onCancel, 
  workCenter, 
  mode = 'add',
  categories,
  teams 
}: WorkCenterFormProps) {
  const [formData, setFormData] = useState<WorkCenterFormData>(
    workCenter || {
      name: '',
      code: '',
      category: '',
      location: '',
      department: '',
      assignedTeam: '',
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof WorkCenterFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof WorkCenterFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof WorkCenterFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Work center name is required';
    }
    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    if (!formData.assignedTeam) {
      newErrors.assignedTeam = 'Assigned team is required';
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
      {/* Grid for Name and Code */}
      <div className="grid grid-cols-2 gap-4">
        <div>
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
            placeholder="Production Floor A"
          />
          {errors.name && <p className={errorClasses}>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="code" className={labelClasses}>
            Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className={inputClasses}
            placeholder="WC-PROD-A"
          />
          {errors.code && <p className={errorClasses}>{errors.code}</p>}
        </div>
      </div>

      {/* Grid for Category and Department */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className={labelClasses}>
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className={errorClasses}>{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="department" className={labelClasses}>
            Department <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Production"
          />
          {errors.department && <p className={errorClasses}>{errors.department}</p>}
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className={labelClasses}>
          Location <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={inputClasses}
          placeholder="Building 1, Floor 1"
        />
        {errors.location && <p className={errorClasses}>{errors.location}</p>}
      </div>

      {/* Assigned Team */}
      <div>
        <label htmlFor="assignedTeam" className={labelClasses}>
          Assigned Team <span className="text-red-500">*</span>
        </label>
        <select
          id="assignedTeam"
          name="assignedTeam"
          value={formData.assignedTeam}
          onChange={handleChange}
          className={inputClasses}
        >
          <option value="">Select Team</option>
          {teams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
        {errors.assignedTeam && <p className={errorClasses}>{errors.assignedTeam}</p>}
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
          {mode === 'edit' ? 'Update Work Center' : 'Add Work Center'}
        </Button>
      </div>
    </form>
  );
}
