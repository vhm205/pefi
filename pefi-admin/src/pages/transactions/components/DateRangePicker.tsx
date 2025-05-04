import { Calendar } from "lucide-react";

interface DateRangePickerProps {
  from: string;
  to: string;
  onChange: (range: { from: string; to: string }) => void;
}

export default function DateRangePicker({
  from,
  to,
  onChange,
}: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-300 p-2">
      <Calendar className="h-5 w-5 text-gray-400" />
      <input
        type="date"
        value={from}
        onChange={(e) => onChange({ from: e.target.value, to })}
        className="border-0 focus:ring-0"
      />
      <span className="text-gray-500">to</span>
      <input
        type="date"
        value={to}
        onChange={(e) => onChange({ from, to: e.target.value })}
        className="border-0 focus:ring-0"
      />
    </div>
  );
}
