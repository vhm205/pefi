import { useState } from "react";
import { Search } from "lucide-react";
import TransactionsTable from "./components/TransactionsTable";
import TransactionModal from "./components/TransactionModal";
import DateRangePicker from "./components/DateRangePicker";
import type { Transaction } from "../../types/transaction";
import { useTransactions } from "../../hooks/useTransactions";
import { PageLoading } from "../../components/PageLoading";

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    transactions,
    pagination,
    isLoading,
    error,
  } = useTransactions(currentPage, itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <PageLoading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.id.includes(searchTerm);

    const matchesDate =
      !dateRange.from ||
      !dateRange.to ||
      (transaction.date >= dateRange.from && transaction.date <= dateRange.to);

    return matchesSearch && matchesDate;
  });

  // Use server-side pagination data instead of client-side calculations
  const totalPages = pagination?.totalPages || 1;

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    // Add your delete logic here
    console.log("Delete transaction:", transaction);
    // You might want to show a confirmation dialog before deleting
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-grow">
          <div className="relative flex-1" style={{ maxWidth: '600px', minWidth: '300px' }}>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <DateRangePicker
          from={dateRange.from}
          to={dateRange.to}
          onChange={setDateRange}
        />
      </div>

      <TransactionsTable
        transactions={filteredTransactions}
        onTransactionClick={handleTransactionClick}
        onDeleteClick={handleDeleteTransaction}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {selectedTransaction && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          transaction={selectedTransaction}
        />
      )}

      {/* Remove duplicate pagination controls since they're now in TransactionsTable */}
    </div>
  );
}
