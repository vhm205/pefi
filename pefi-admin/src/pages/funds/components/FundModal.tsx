import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Fund, CreateFundDTO } from '../../../services/fund';

interface FundModalProps {
  isOpen: boolean;
  fund: Fund | null;
  onClose: () => void;
  onSubmit: (data: CreateFundDTO) => Promise<void>;
}

export default function FundModal({ isOpen, fund, onClose, onSubmit }: FundModalProps) {
  const [formData, setFormData] = useState<CreateFundDTO>({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (fund) {
      setFormData({
        name: fund.name,
        description: fund.description || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
      });
    }
  }, [fund]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box max-w-lg">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </form>

        <h3 className="font-bold text-lg mb-4">
          {fund ? 'Edit Fund' : 'Create New Fund'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Name</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input input-bordered w-full"
              required
              placeholder="Enter fund name"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="textarea textarea-bordered w-full"
              placeholder="Enter fund description"
              rows={3}
            />
          </div>

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {fund ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}