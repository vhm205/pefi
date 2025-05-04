export type TransactionType = "income" | "expense" | "transfer";
export type TransactionStatus = "Completed" | "Pending";

export interface Transaction {
  id: string;
  type: TransactionType;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: TransactionStatus;
  method: string;
  note: string;
  fund?: string;
  toFund?: string;
}

export interface CreateTransactionDTO {
  type: TransactionType;
  date: string;
  amount: number;
  category: string;
  method: string;
  description: string;
  note: string;
  fund: string;
}