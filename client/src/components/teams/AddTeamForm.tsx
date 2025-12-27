import { useState, FormEvent } from 'react';
import Button from '../common/Button';
import { FiCheck, FiX } from 'react-icons/fi';

interface AddTeamFormProps {
  onSubmit: (data: TeamFormData) => void;
  onCancel: () => void;
  team?: TeamFormData;
  mode?: 'add' | 'edit';
}

export interface TeamFormData {
  name: string;
  specialization: string;
}

export default function AddTeamForm({ onSubmit, onCancel, team, mode = 'add' }: AddTeamFormProps) {
  const [formData, setFormData] = useState<TeamFormData>(
    team || {
      name: '',
      specialization: '',
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof TeamFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof TeamFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TeamFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    }
    if (!formData.specialization.trim()) {
      newErrors.specialization = 'Specialization is required';
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
      {/* Team Name */}
      <div>
        <label htmlFor="name" className={labelClasses}>
          Team Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={inputClasses}
          placeholder="e.g., Mechanics Team"
        />
        {errors.name && <p className={errorClasses}>{errors.name}</p>}
      </div>

      {/* Specialization */}
      <div>
        <label htmlFor="specialization" className={labelClasses}>
          Specialization <span className="text-red-500">*</span>
        </label>
        <textarea
          id="specialization"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          rows={3}
          className={inputClasses}
          placeholder="e.g., CNC Machines & Heavy Equipment"
        />
        {errors.specialization && <p className={errorClasses}>{errors.specialization}</p>}
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
          {mode === 'edit' ? 'Update Team' : 'Add Team'}
        </Button>
      </div>
    </form>
  );
}
