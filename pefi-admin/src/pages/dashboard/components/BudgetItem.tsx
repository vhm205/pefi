export default function BudgetItem({ category, spent, total }: { category: string; spent: number; total: number }) {
  const percentage = (spent / total) * 100;
  const getColor = () => {
    if (percentage > 90) return "bg-red-500";
    if (percentage > 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{category}</span>
        <span className="font-medium">
          ${spent}/${total}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${getColor()}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
