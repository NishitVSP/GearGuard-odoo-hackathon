import Modal from '../common/Modal';
import Button from '../common/Button';
import { FiAlertTriangle, FiTrash2, FiX } from 'react-icons/fi';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  equipmentName: string;
}

export default function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  equipmentName,
}: DeleteConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete" size="sm">
      <div className="space-y-4">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <FiAlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Warning Message */}
        <div className="text-center space-y-2">
          <p className="text-gray-700">
            Are you sure you want to delete this equipment?
          </p>
          <p className="font-semibold text-gray-900">"{equipmentName}"</p>
          <p className="text-sm text-red-600">
            This action cannot be undone.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
            icon={<FiX />}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            className="flex-1"
            icon={<FiTrash2 />}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
