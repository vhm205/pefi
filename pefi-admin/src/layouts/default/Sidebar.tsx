import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Target,
  BarChart3,
  Settings,
  ChevronLeft,
  Wallet,
  ListTree,
} from "lucide-react";
import clsx from "clsx";

import { Link } from "../../components/Link";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Transactions", icon: Receipt, path: "/transactions" },
  { name: "Budgets", icon: PiggyBank, path: "/budgets" },
  { name: "Categories", icon: ListTree, path: "/categories" },
  { name: "Funds", icon: Wallet, path: "/funds" },
  { name: "Goals", icon: Target, path: "/goals" },
  { name: "Reports", icon: BarChart3, path: "/reports" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center flex-1">
          <Wallet className="h-8 w-8 text-blue-600" />
          {isOpen && <span className="ml-3 font-semibold text-xl">PeFi</span>}
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100"
        >
          <ChevronLeft
            className={clsx(
              "h-5 w-5 text-gray-500 transition-transform",
              !isOpen && "rotate-180"
            )}
          />
        </button>
      </div>

      <nav className="mt-6">
        {navigation.map((item) => (
          <Link
            href={item.path}
            key={item.name}
            extraClasses="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 sidebar-link"
          >
            <item.icon className="h-5 w-5" />
            {isOpen && <span className="ml-3">{item.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
