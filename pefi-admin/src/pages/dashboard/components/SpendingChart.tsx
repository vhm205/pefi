import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", income: 4800, expenses: 3900 },
  { month: "Feb", income: 4900, expenses: 3800 },
  { month: "Mar", income: 4700, expenses: 4000 },
  { month: "Apr", income: 5000, expenses: 3900 },
  { month: "May", income: 4800, expenses: 4100 },
  { month: "Jun", income: 5200, expenses: 4000 },
];

export default function SpendingChart() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-6">Spending Analytics</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Bar dataKey="income" fill="#4ade80" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
