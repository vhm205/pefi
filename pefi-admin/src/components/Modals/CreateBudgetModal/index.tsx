import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { Budget } from "../../../types/dashboard";

export interface CreateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (budget: Budget) => void;
}

const categoryOptions = [
  { value: "housing", label: "Housing" },
  { value: "transportation", label: "Transportation" },
  { value: "food", label: "Food" },
  { value: "utilities", label: "Utilities" },
  { value: "healthcare", label: "Healthcare" },
  { value: "entertainment", label: "Entertainment" },
  { value: "other", label: "Other" },
];

const fundOptions = [
  { value: "everyday", label: "Everyday" },
  { value: "emergency", label: "Emergency" },
  { value: "investment", label: "Investment" },
  { value: "saving", label: "Saving" },
];

export default function CreateBudgetModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateBudgetModalProps) {
  const [formData, setFormData] = useState<Budget>({
    id: crypto.randomUUID(),
    name: "",
    amount: 0,
    spent: 0,
    category: "",
    fund: "everyday",
    startDate: "",
    endDate: "",
    status: "Active",
    note: "",
  });
  const [displayAmount, setDisplayAmount] = useState("");
  const [localCategoryOptions, setLocalCategoryOptions] =
    useState(categoryOptions);
  const [localFundOptions, setLocalFundOptions] = useState(fundOptions);
  const [newCategory, setNewCategory] = useState("");
  const [newFund, setNewFund] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingFund, setIsAddingFund] = useState(false);

  const formatMoney = (value: string): string => {
    const cleanValue = value.replace(/[^\d.]/g, "");
    const parts = cleanValue.split(".");
    const integerPart = parts[0];
    const decimalPart = parts[1] || "";
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (parts.length > 1) {
      return `${formattedInteger}.${decimalPart.slice(0, 2)}`;
    }
    return formattedInteger;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/[^\d.]/g, "");

    if (numericValue === "" || /^\d*\.?\d{0,2}$/.test(numericValue)) {
      setFormData({ ...formData, amount: parseFloat(numericValue) || 0 });
      setDisplayAmount(formatMoney(numericValue));
    }
  };

  const handleCreateCategory = () => {
    if (newCategory.trim()) {
      const value = newCategory.toLowerCase();
      const label = newCategory.charAt(0).toUpperCase() + newCategory.slice(1);
      const newOption = { value, label };
      setLocalCategoryOptions([...localCategoryOptions, newOption]);
      setFormData({ ...formData, category: value });
      setNewCategory("");
      setIsAddingCategory(false);
    }
  };

  const handleCreateFund = () => {
    if (newFund.trim()) {
      const value = newFund.toLowerCase();
      const label = newFund.charAt(0).toUpperCase() + newFund.slice(1);
      const newOption = { value, label };
      setLocalFundOptions([...localFundOptions, newOption]);
      setFormData({ ...formData, fund: value });
      setNewFund("");
      setIsAddingFund(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      id: crypto.randomUUID(),
      name: "",
      amount: 0,
      spent: 0,
      category: "",
      fund: "everyday",
      startDate: "",
      endDate: "",
      status: "Active",
      note: "",
    });
    setDisplayAmount("");
    onClose();
  };

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-xl">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </form>

        <h3 className="text-lg font-bold mb-6">Create Budget</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
                placeholder="Enter budget name"
                required
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Amount</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="text"
                  value={displayAmount}
                  onChange={handleAmountChange}
                  className="input input-bordered w-full pl-7"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Category</span>
              </label>
              {isAddingCategory ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="input input-bordered flex-1"
                    placeholder="New category name"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="btn btn-primary"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="select select-bordered flex-1"
                    required
                  >
                    <option value="">Select category</option>
                    {localCategoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(true)}
                    className="btn btn-ghost btn-square"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Fund</span>
              </label>
              {isAddingFund ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFund}
                    onChange={(e) => setNewFund(e.target.value)}
                    className="input input-bordered flex-1"
                    placeholder="New fund name"
                  />
                  <button
                    type="button"
                    onClick={handleCreateFund}
                    className="btn btn-primary"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingFund(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={formData.fund}
                    onChange={(e) =>
                      setFormData({ ...formData, fund: e.target.value })
                    }
                    className="select select-bordered flex-1"
                    required
                  >
                    <option value="">Select fund</option>
                    {localFundOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsAddingFund(true)}
                    className="btn btn-ghost btn-square"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Start Date</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">End Date</span>
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Status</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="select select-bordered w-full"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Note</span>
            </label>
            <textarea
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              className="textarea textarea-bordered w-full"
              rows={3}
              placeholder="Add a note..."
            />
          </div>

          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create
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
