import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "./contexts/ToastContext";

import LayoutDefault from "./layouts/default";
import Dashboard from "./pages/dashboard";
import TransactionsPage from "./pages/transactions";
import BudgetsPage from "./pages/budgets";
import CategoriesPage from "./pages/categories";
import FundsPage from "./pages/funds";
import { PlaceholderPage } from "./components/PlaceholderPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider defaultPosition="top-right">
        <BrowserRouter>
          <Routes>
            <Route element={<LayoutDefault />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/budgets" element={<BudgetsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/funds" element={<FundsPage />} />
              <Route path="/goals" element={<PlaceholderPage title="Goals" />} />
              <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
              <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
