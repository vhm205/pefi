import { useState } from "react";
import { Search } from "lucide-react";
import BudgetsTable from "./components/BudgetsTable";
import BudgetModal from "./components/BudgetModal";
import DateRangePicker from "../transactions/components/DateRangePicker";
import type { Budget } from "../../types/dashboard";

export default function BudgetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - replace with actual data fetching
  const budgets = [
    {
      id: "1",
      name: "Monthly Housing",
      category: "Housing",
      fund: "Checking",
      amount: 2000,
      spent: 1800,
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      status: "Active",
      note: "Rent and utilities budget",
    },
    // ... more budgets
  ];

  const filteredBudgets = budgets.filter((budget) => {
    const matchesSearch =
      budget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      budget.id.includes(searchTerm) ||
      budget.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate =
      !dateRange.from ||
      !dateRange.to ||
      (budget.startDate >= dateRange.from && budget.endDate <= dateRange.to);

    return matchesSearch && matchesDate;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredBudgets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBudgets = filteredBudgets.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleBudgetClick = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsModalOpen(true);
  };

  const handleBudgetUpdate = (updatedBudget: Budget) => {
    // Handle budget update logic here
    console.log("Updated budget:", updatedBudget);
    setIsModalOpen(false);
  };

  const handleDeleteBudget = (budget: Budget) => {
    // Add your delete logic here
    console.log("Delete budget:", budget);
    // You might want to show a confirmation dialog before deleting
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search budgets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <DateRangePicker
          from={dateRange.from}
          to={dateRange.to}
          onChange={setDateRange}
        />
      </div>

      <BudgetsTable
        budgets={paginatedBudgets}
        onBudgetClick={handleBudgetClick}
        onDeleteClick={handleDeleteBudget}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <BudgetModal
        isOpen={isModalOpen}
        budget={selectedBudget}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleBudgetUpdate}
      />
    </div>
  );
}