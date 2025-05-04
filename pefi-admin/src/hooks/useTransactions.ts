import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "../services/transaction";
import type { CreateTransactionDTO } from "../types/transaction";

export const useTransactions = (page: number = 1, pageSize: number = 10) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const {
    data: paginatedTransactions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transactions", page, pageSize],
    queryFn: () => transactionService.getAll(page, pageSize),
    meta: {
      onError: (err: Error) => setError(err.message),
    }
  });

  // Pre-fetch next page
  useEffect(() => {
    if ((paginatedTransactions?.pagination?.totalPages ?? 0) > page) {
      const nextPage = page + 1;
      queryClient.prefetchQuery({
        queryKey: ["transactions", nextPage, pageSize],
        queryFn: () => transactionService.getAll(nextPage, pageSize),
      });
    }
  }, [page, pageSize, paginatedTransactions?.pagination?.totalPages, queryClient]);

  const createMutation = useMutation({
    mutationFn: transactionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setError(null);
    },
    onError: (err: Error) => setError(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateTransactionDTO>;
    }) => transactionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setError(null);
    },
    onError: (err: Error) => setError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: transactionService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setError(null);
    },
    onError: (err: Error) => setError(err.message),
  });

  return {
    transactions: paginatedTransactions?.data ?? [],
    pagination: paginatedTransactions?.pagination,
    isLoading,
    isError,
    error,
    clearError,
    createTransaction: createMutation.mutate,
    updateTransaction: updateMutation.mutate,
    deleteTransaction: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
