import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Category, CreateCategoryDTO } from "../../../services/category";

interface CategoryModalProps {
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
  onSubmit: (data: CreateCategoryDTO) => void;
}

export default function CategoryModal({
  isOpen,
  category,
  onClose,
  onSubmit,
}: CategoryModalProps) {
  const [formData, setFormData] = useState<CreateCategoryDTO>({
    name: "",
    type: "expense",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        type: category.type,
      });
    } else {
      setFormData({
        name: "",
        type: "expense",
      });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-sm">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </form>

        <h3 className="text-lg font-bold mb-6">
          {category ? "Edit Category" : "Create Category"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Name</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="input input-bordered w-full"
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Type</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "income" | "expense",
                })
              }
              className="select select-bordered w-full"
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {category ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
