import { useState, FormEvent } from 'react';
import Button from '../common/Button';
import { FiCheck, FiX } from 'react-icons/fi';

interface AddMemberFormProps {
  onSubmit: (data: MemberFormData) => void;
  onCancel: () => void;
  teamId: number;
}

export interface MemberFormData {
  name: string;
  role: string;
  status: 'available' | 'busy' | 'offline';
}

export default function AddMemberForm({ onSubmit, onCancel }: AddMemberFormProps) {
  const [formData, setFormData] = useState<MemberFormData>({
    name: '',
    role: '',
    status: 'available',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MemberFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof MemberFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MemberFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Member name is required';
    }
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
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
      {/* Member Name */}
      <div>
        <label htmlFor="name" className={labelClasses}>
          Member Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={inputClasses}
          placeholder="e.g., John Doe"
        />
        {errors.name && <p className={errorClasses}>{errors.name}</p>}
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className={labelClasses}>
          Role/Position <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className={inputClasses}
          placeholder="e.g., Senior Mechanic"
        />
        {errors.role && <p className={errorClasses}>{errors.role}</p>}
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className={labelClasses}>
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className={inputClasses}
        >
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="offline">Offline</option>
        </select>
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
          Add Member
        </Button>
      </div>
    </form>
  );
}
