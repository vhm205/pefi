import { Transaction } from "../../../types/transaction";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { formatVND } from "../../../utils/money";

// Add type mapping for transaction types
const transactionTypeStyles = {
  income: {
    bg: "bg-green-100",
    text: "text-green-800",
  },
  expense: {
    bg: "bg-red-100",
    text: "text-red-800",
  },
  transfer: {
    bg: "bg-blue-100",
    text: "text-blue-800",
  },
};

const transactionTypeLabels = {
  income: "Thu nhập",
  expense: "Chi tiêu",
  transfer: "Chuyển khoản",
};

interface TransactionsTableProps {
  transactions: Transaction[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function TransactionsTable({
  transactions,
  currentPage,
  totalPages,
  onPageChange,
}: TransactionsTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-gray-200 last:border-0 hover:bg-gray-50"
              >
                <td className="px-6 py-4 text-sm">
                  {new Date(transaction.date).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 text-sm">{transaction.description}</td>
                <td className="px-6 py-4 text-sm">{transaction.category}</td>
                <td className="px-6 py-4">
                  <span
                    className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${transactionTypeStyles[transaction.type].bg}
                      ${transactionTypeStyles[transaction.type].text}
                    `}
                  >
                    {transactionTypeLabels[transaction.type]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={
                      transaction.type === "income"
                        ? "text-green-600"
                        : transaction.type === "expense"
                        ? "text-red-600"
                        : "text-blue-600"
                    }
                  >
                    {formatVND(transaction.amount)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
