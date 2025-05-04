import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { MetricCard as MetricCardType } from "../../../types/dashboard";

export default function MetricCard({
  title,
  value,
  change,
  icon,
}: MetricCardType) {
  const isPositive = change.type === "increase";

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-sm">{title}</span>
        <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-semibold">{value}</h3>
        <div
          className={`flex items-center mt-2 ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          <span className="text-sm ml-1">
            {Math.abs(change.value)}% this month
          </span>
        </div>
      </div>
    </div>
  );
}
