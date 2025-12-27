import { useState, useEffect, FormEvent } from 'react';
import Button from '../common/Button';
import { FiCheck, FiX } from 'react-icons/fi';
import * as api from '../../services/api';

interface AddMemberFormProps {
  onSubmit: (data: MemberFormData) => void;
  onCancel: () => void;
  teamId: number;
}

export interface MemberFormData {
  userId: string;
  role: string;
}

interface AvailableUser {
  id: number;
  email: string;
  name?: string;
}

export default function AddMemberForm({ onSubmit, onCancel, teamId }: AddMemberFormProps) {
  const [formData, setFormData] = useState<MemberFormData>({
    userId: '',
    role: '',
  });
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState<Partial<Record<keyof MemberFormData, string>>>({});

  useEffect(() => {
    loadAvailableUsers();
  }, [teamId]);

  const loadAvailableUsers = async () => {
    try {
      setLoading(true);
      const users = await api.getAvailableUsers(teamId);
      setAvailableUsers(users);
    } catch (error) {
      console.error('Failed to load available users:', error);
      alert('Failed to load available users');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof MemberFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MemberFormData, string>> = {};

    if (!formData.userId) {
      newErrors.userId = 'Please select a user';
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

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Loading available users...</p>
      </div>
    );
  }

  if (availableUsers.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 mb-4">No available users to add to this team.</p>
        <Button variant="secondary" onClick={onCancel}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* User Selection */}
      <div>
        <label htmlFor="userId" className={labelClasses}>
          Select User <span className="text-red-500">*</span>
        </label>
        <select
          id="userId"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          className={inputClasses}
        >
          <option value="">Choose a user...</option>
          {availableUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || user.email}
            </option>
          ))}
        </select>
        {errors.userId && <p className={errorClasses}>{errors.userId}</p>}
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
          placeholder="e.g., Senior Mechanic, Lead Technician"
        />
        {errors.role && <p className={errorClasses}>{errors.role}</p>}
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
