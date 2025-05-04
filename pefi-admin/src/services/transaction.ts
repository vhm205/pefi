import { api } from "./api";
import type { Transaction, CreateTransactionDTO } from "../types/transaction";

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

const TRANSACTIONS_ENDPOINT = "/api/transactions";

export const transactionService = {
  getAll: (page: number = 1, pageSize: number = 10) =>
    api.get<PaginatedResponse<Transaction>>(
      `${TRANSACTIONS_ENDPOINT}?page=${page}&pageSize=${pageSize}`
    ),

  getById: (id: string) =>
    api.get<Transaction>(`${TRANSACTIONS_ENDPOINT}/${id}`),

  create: (data: CreateTransactionDTO) =>
    api.post<Transaction>(TRANSACTIONS_ENDPOINT, data),

  update: (id: string, data: Partial<CreateTransactionDTO>) =>
    api.put<Transaction>(`${TRANSACTIONS_ENDPOINT}/${id}`, data),

  delete: (id: string) => api.delete<void>(`${TRANSACTIONS_ENDPOINT}/${id}`),
};
