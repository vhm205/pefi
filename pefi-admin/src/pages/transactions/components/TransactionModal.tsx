import React, { useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import { useTransactions } from "../../../hooks/useTransactions";
import { useCategories } from "../../../hooks/useCategories";
import { useFunds } from "../../../hooks/useFunds";
import { useMethods } from "../../../hooks/useMethods";
import { formatMoney, parseMoney } from "../../../utils/money";
import type { Transaction } from "../../../types/transaction";
import { useNotification } from "../../../hooks/useNotification";

interface TransactionModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
}

interface TransactionFormData {
  type: "income" | "expense" | "transfer";
  date: string;
  amount: string;
  category: string;
  method: string;
  note: string;
  description: string;
  fund: string;
  toFund?: string;
}

export default function TransactionModal({
  isOpen,
  transaction,
  onClose,
}: TransactionModalProps) {
  const notify = useNotification();
  const [formData, setFormData] = useState<TransactionFormData | null>(null);
  const [displayAmount, setDisplayAmount] = useState("");

  const { categories, isLoading: isCategoriesLoading } = useCategories(
    formData?.type === "transfer" ? undefined : formData?.type
  );
  const { funds, isLoading: isFundsLoading } = useFunds();
  const { methods, isLoading: isMethodsLoading } = useMethods();
  const { updateTransaction, isUpdating, error } = useTransactions();

  // Initialize form data when transaction changes
  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        date: transaction.date,
        amount: Math.abs(transaction.amount).toString(),
        category: transaction.category,
        method: transaction.method,
        note: transaction.note || "",
        description: transaction.description || "",
        fund: transaction.fund || "Cá nhân",
        toFund: transaction.type === "transfer" ? transaction.toFund : undefined,
      });
      setDisplayAmount(formatMoney(Math.abs(transaction.amount).toString()));
    }
  }, [transaction]);

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const numericValue = parseMoney(rawValue);

      if (!formData) return;

      setFormData((prev) =>
        prev ? { ...prev, amount: numericValue } : null
      );
      setDisplayAmount(formatMoney(numericValue));
    },
    [formData]
  );

  const handleTypeChange = useCallback(
    (newType: TransactionFormData["type"]) => {
      if (!formData) return;

      const defaultCategory = newType === "income" ? "Lương" : "Cá nhân";
      setFormData((prev) => {
        if (!prev) return null;
        return {
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
        };
      });
    },
    [categories, methods]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !transaction) return;

    const transactionData = {
      ...formData,
      amount: parseInt(formData.amount), // Always send positive number
    };

    try {
      await new Promise<void>((resolve, reject) => {
        return updateTransaction(
          { id: transaction.id, data: transactionData },
          {
            onSuccess: () => {
              notify.success("Transaction updated successfully", {
                position: "top-center",
              });
              onClose();
              resolve();
            },
            onError: reject,
          }
        );
      });
    } catch (err) {
      notify.error(error || "Failed to update transaction", {
        position: "top-center",
      });
      console.error("Failed to update transaction:", err);
    }
  };

  if (isCategoriesLoading || isFundsLoading || isMethodsLoading || !formData) {
    return <div>Loading...</div>;
  }

  return (
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

        <h3 className="text-lg font-bold mb-6">Edit Transaction</h3>

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

          {/* Date and Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Date</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) =>
                    prev ? { ...prev, date: e.target.value } : null
                  )
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
                placeholder="Enter amount"
                required
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Category</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) =>
                  prev ? { ...prev, category: e.target.value } : null
                )
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

          {/* Method Selection - Only show when not transfer */}
          {formData.type !== "transfer" && (
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Method</span>
              </label>
              <select
                value={formData.method}
                onChange={(e) =>
                  setFormData((prev) =>
                    prev ? { ...prev, method: e.target.value } : null
                  )
                }
                className="select select-bordered w-full"
                required
              >
                <option value="">Select method</option>
                {methods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>
          )}

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
                    setFormData((prev) =>
                      prev ? { ...prev, fund: e.target.value } : null
                    )
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
                    setFormData((prev) =>
                      prev ? { ...prev, toFund: e.target.value } : null
                    )
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
                  setFormData((prev) =>
                    prev ? { ...prev, fund: e.target.value } : null
                  )
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
                setFormData((prev) =>
                  prev ? { ...prev, note: e.target.value } : null
                )
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
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Transaction"}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                if (!error) {
                  onClose();
                }
              }}
              disabled={isUpdating}
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
  );
}
