import { useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  Target,
  FileText,
  Currency,
} from "lucide-react";

import MetricCard from "./components/MetricCard";
import SpendingChart from "./components/SpendingChart";
import TransactionsTable from "./components/TransactionTable";
import BudgetItem from "./components/BudgetItem";
import { PageLoading } from "../../components/PageLoading";
import { useTransactions } from "../../hooks/useTransactions";

import CreateBudgetModal from "../../components/Modals/CreateBudgetModal";
import CreateTransactionModal from "../../components/Modals/CreateTransactionModal";

import type {
  MetricCard as MetricCardType,
  Budget as BudgetItemType,
} from "../../types/dashboard";

const metrics = [
  {
    title: "Total Balance",
    value: "$12,500",
    change: { value: 2.5, type: "increase" },
    icon: <Wallet className="h-5 w-5 text-blue-600" />,
  },
  {
    title: "Monthly Income",
    value: "$5,200",
    change: { value: 3.2, type: "increase" },
    icon: <TrendingUp className="h-5 w-5 text-green-600" />,
  },
  {
    title: "Monthly Expenses",
    value: "$3,800",
    change: { value: 1.4, type: "decrease" },
    icon: <TrendingDown className="h-5 w-5 text-red-600" />,
  },
  {
    title: "Total Savings",
    value: "$8,700",
    change: { value: 5.1, type: "increase" },
    icon: <PiggyBank className="h-5 w-5 text-purple-600" />,
  },
] as MetricCardType[];

export default function Page() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateBudgetModalOpen, setIsCreateBudgetModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Showing fewer items on dashboard for recent transactions

  const { transactions, pagination, isLoading, error } = useTransactions(
    currentPage,
    itemsPerPage
  );

  const handleCreateBudget = (budget: BudgetItemType) => {
    // Handle the new budget here
    console.log("New budget:", budget);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <PageLoading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart />
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Monthly Budget Overview
          </h2>
          <div className="space-y-4">
            <BudgetItem category="Housing" spent={1800} total={2000} />
            <BudgetItem category="Food" spent={450} total={500} />
            <BudgetItem category="Transport" spent={200} total={300} />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading transactions...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-600">
          Error loading transactions: {error}
        </div>
      ) : (
        <TransactionsTable
          transactions={transactions}
          currentPage={currentPage}
          totalPages={pagination?.totalPages || 1}
          onPageChange={handlePageChange}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Transaction</span>
        </button>
        <button
          onClick={() => setIsCreateBudgetModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Currency className="h-5 w-5" />
          <span>Create Budget</span>
        </button>
        <button className="flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
          <Target className="h-5 w-5" />
          <span>Set New Goal</span>
        </button>
        <button className="flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
          <FileText className="h-5 w-5" />
          <span>Generate Report</span>
        </button>
      </div>

      <CreateTransactionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <CreateBudgetModal
        isOpen={isCreateBudgetModalOpen}
        onClose={() => setIsCreateBudgetModalOpen(false)}
        onSubmit={handleCreateBudget}
      />
    </div>
  );
}
