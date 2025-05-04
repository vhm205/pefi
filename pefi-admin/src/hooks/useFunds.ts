import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fundService } from "../services/fund";
import { useNotification } from "./useNotification";

export interface Fund {
  name: string;
  description?: string;
}

export interface CreateFundDTO {
  name: string;
  description?: string;
}

export interface FundOption {
  value: string;
  label: string;
}

export const useFunds = () => {
  const queryClient = useQueryClient();
  const notify = useNotification();

  const {
    data: fundsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["funds"],
    queryFn: () => fundService.getAll(1, 100),
    select: (data) =>
      data.data.map((fund): FundOption => ({
        value: fund.name,
        label: fund.name,
      })),
  });

  const createMutation = useMutation({
    mutationFn: fundService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funds"] });
      notify.success("Fund created successfully");
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ name, data }: { name: string; data: Partial<CreateFundDTO> }) =>
      fundService.update(name, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funds"] });
      notify.success("Fund updated successfully");
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: fundService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funds"] });
      notify.success("Fund deleted successfully");
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  return {
    funds: fundsData || [],
    isLoading,
    error,
    createFund: createMutation.mutate,
    updateFund: updateMutation.mutate,
    deleteFund: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};