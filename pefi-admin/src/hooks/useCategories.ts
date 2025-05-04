import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../services/category";
import { useNotification } from "./useNotification";

export interface Category {
  name: string;
  type: "income" | "expense";
  description?: string;
}

export interface CreateCategoryDTO {
  name: string;
  type: "income" | "expense";
  description?: string;
}

export interface CategoryOption {
  value: string;
  label: string;
  type: "income" | "expense";
}

export const useCategories = (type?: "income" | "expense") => {
  const queryClient = useQueryClient();
  const notify = useNotification();

  const {
    data: categoriesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(1, 100),
    select: (data) => {
      const categories = data.data.map((category): CategoryOption => ({
        value: category.name,
        label: category.name,
        type: category.type,
      }));

      if (type) {
        return categories.filter((category) => category.type === type);
      }

      return categories;
    },
  });

  const createMutation = useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      notify.success("Category created successfully");
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ name, data }: { name: string; data: Partial<CreateCategoryDTO> }) =>
      categoryService.update(name, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      notify.success("Category updated successfully");
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      notify.success("Category deleted successfully");
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  return {
    categories: categoriesData || [],
    isLoading,
    error,
    createCategory: createMutation.mutate,
    updateCategory: updateMutation.mutate,
    deleteCategory: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};