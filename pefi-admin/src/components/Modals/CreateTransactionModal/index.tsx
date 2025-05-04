import React, { useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import { useTransactions } from "../../../hooks/useTransactions";
import { useCategories } from "../../../hooks/useCategories";
import { useFunds } from "../../../hooks/useFunds";
import { useMethods } from "../../../hooks/useMethods";
import { formatMoney } from "../../../utils/money";
import type { CreateTransactionDTO } from "../../../types/transaction";
import { useNotification } from "../../../hooks/useNotification";

interface TransactionFormData {
  type: "income" | "expense" | "transfer";
  date: string;
  amount: string;
  category: string;
  method: string;
  note: string;
  description: string;
  fund: string;
  toFund?: string; // Add this for transfer
}

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFormData: TransactionFormData = {
  type: "expense",
  date: new Date().toISOString().split("T")[0],
  amount: "",
  category: "Cá nhân",
  method: "Chuyển khoản",
  note: "",
  description: "",
  fund: "Cá nhân",
  toFund: "Cá nhân",
};

export const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const notify = useNotification();
  const [formData, setFormData] =
    useState<TransactionFormData>(initialFormData);
  const [displayAmount, setDisplayAmount] = useState("");

  const { categories, isLoading: isCategoriesLoading } = useCategories(
    formData.type === "transfer" ? undefined : formData.type
  );
  const { funds, isLoading: isFundsLoading } = useFunds();
  const { methods, isLoading: isMethodsLoading } = useMethods();
  const { createTransaction, isCreating, error } = useTransactions();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const defaultCategory = formData.type === "income" ? "Lương" : "Cá nhân";
      setFormData({
        ...initialFormData,
        category: categories.length > 0 ? categories[0].value : defaultCategory,
        method: methods.length > 0 ? methods[0].value : "Chuyển khoản",
        fund: funds.length > 0 ? funds[0].value : "Cá nhân",
      });
      setDisplayAmount("");
    }
  }, [isOpen]);

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      // Remove any non-numeric characters and existing separators
      const numericValue = rawValue.replace(/[^\d]/g, "");

      setFormData((prev) => ({ ...prev, amount: numericValue }));
      setDisplayAmount(formatMoney(numericValue));
    },
    []
  );

  const handleTypeChange = useCallback(
    (newType: TransactionFormData["type"]) => {
      const defaultCategory = newType === "income" ? "Lương" : "Cá nhân";
      setFormData((prev) => ({
        ...prev,
        type: newType,
        category: categories.length > 0 ? categories[0].value : defaultCategory,
        method:
          newType === "transfer"
            ? ""
            : methods.length > 0
            ? methods[0].value
            : "Chuyển khoản",
        fund: "Cá nhân",
        toFund: newType === "transfer" ? "Cá nhân" : undefined,
      }));
    },
    [categories, methods]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const transactionData: CreateTransactionDTO = {
      ...formData,
      amount: parseInt(formData.amount) || 0,
    };

    try {
      await new Promise<void>((resolve, reject) => {
        return createTransaction(transactionData, {
          onSuccess: () => {
            notify.success("Transaction created successfully", {
              position: "top-center",
            });
            setFormData(initialFormData);
            setDisplayAmount("");
            onClose();

            resolve();
          },
          onError: reject,
        });
      });
    } catch (err) {
      notify.error(error || "Failed to create transaction", {
        position: "top-center",
      });
      console.error("Failed to create transaction:", err);
    }
  };

  if (isCategoriesLoading || isFundsLoading || isMethodsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box max-w-xl">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => {
                if (!error) {
                  onClose();
                }
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </form>

          <h3 className="text-lg font-bold mb-6">Create Transaction</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Transaction Type Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Transaction Type</span>
              </label>
              <div className="join block mt-2">
                {["income", "expense", "transfer"].map((type) => (
                  <input
                    key={type}
                    type="radio"
                    name="type"
                    className="join-item btn"
                    checked={formData.type === type}
                    onChange={() =>
                      handleTypeChange(type as TransactionFormData["type"])
                    }
                    aria-label={type.charAt(0).toUpperCase() + type.slice(1)}
                  />
                ))}
              </div>
            </div>

            {/* Date and Amount Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Date</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Amount</span>
                </label>
                <input
                  type="text"
                  value={displayAmount}
                  onChange={handleAmountChange}
                  className="input input-bordered w-full"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Description</span>
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="input input-bordered w-full"
                placeholder="Enter transaction description"
                required
              />
            </div>

            {/* Category Selection */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Category</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="select select-bordered w-full"
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Method Selection */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Payment Method</span>
              </label>
              <select
                value={formData.method}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, method: e.target.value }))
                }
                className="select select-bordered w-full"
                required
              >
                <option value="">Select payment method</option>
                {methods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Fund Selection */}
            {formData.type === "transfer" ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">From Fund</span>
                  </label>
                  <select
                    value={formData.fund}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, fund: e.target.value }))
                    }
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Select fund</option>
                    {funds.map((fund) => (
                      <option key={fund.value} value={fund.value}>
                        {fund.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">To Fund</span>
                  </label>
                  <select
                    value={formData.toFund}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        toFund: e.target.value,
                      }))
                    }
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Select fund</option>
                    {funds.map((fund) => (
                      <option key={fund.value} value={fund.value}>
                        {fund.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Fund</span>
                </label>
                <select
                  value={formData.fund}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fund: e.target.value }))
                  }
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select fund</option>
                  {funds.map((fund) => (
                    <option key={fund.value} value={fund.value}>
                      {fund.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Note Field */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Note</span>
              </label>
              <textarea
                value={formData.note}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, note: e.target.value }))
                }
                className="textarea textarea-bordered w-full"
                rows={3}
                placeholder="Add a note..."
              />
            </div>

            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Transaction"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  if (!error) {
                    onClose();
                  }
                }}
                disabled={isCreating}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button
            onClick={(e) => {
              if (error) {
                e.preventDefault();
              } else {
                onClose();
              }
            }}
          >
            close
          </button>
        </form>
      </dialog>
    </>
  );
};

export default CreateTransactionModal;
