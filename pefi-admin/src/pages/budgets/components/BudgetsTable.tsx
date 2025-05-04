import { Budget } from "../../../types/dashboard";
import {
  Pencil,
  Trash2,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

interface BudgetsTableProps {
  budgets: Budget[];
  onBudgetClick: (budget: Budget) => void;
  onDeleteClick: (budget: Budget) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function BudgetsTable({
  budgets,
  onBudgetClick,
  onDeleteClick,
  currentPage,
  totalPages,
  onPageChange,
}: BudgetsTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Spent</th>
              <th className="px-6 py-3">Progress</th>
              <th className="px-6 py-3">Period</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((budget) => (
              <tr
                key={budget.id}
                className="border-b border-gray-200 last:border-0 hover:bg-gray-50"
              >
                <td className="px-6 py-4 text-sm font-medium">{budget.name}</td>
                <td className="px-6 py-4 text-sm">{budget.category}</td>
                <td className="px-6 py-4 text-sm font-medium">
                  ${budget.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  ${budget.spent.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        budget.spent / budget.amount > 0.9
                          ? "bg-red-600"
                          : budget.spent / budget.amount > 0.7
                          ? "bg-yellow-400"
                          : "bg-green-600"
                      }`}
                      style={{
                        width: `${Math.min(
                          (budget.spent / budget.amount) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {budget.startDate} - {budget.endDate}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      budget.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {budget.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBudgetClick(budget);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-blue-600 hover:text-blue-700"
                      title="Edit budget"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(budget);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-red-600 hover:text-red-700"
                      title="Delete budget"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
          >
            <ChevronsLeft className="h-4 w-4" />
            First
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
          >
            Last
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
