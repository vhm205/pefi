export interface Budget {
  id: string;
  name: string;
  category: string;
  fund: string;
  amount: number;
  spent: number;
  startDate: string;
  endDate: string;
  status: string;
  note: string;
}

export interface MetricCard {
  title: string;
  value: string;
  change: {
    value: number;
    type: "increase" | "decrease";
  };
  icon: React.ReactNode;
}
