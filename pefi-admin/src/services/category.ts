import { api } from "./api";

export interface Category {
  name: string;
  type: "income" | "expense";
}

export interface CreateCategoryDTO {
  name: string;
  type: "income" | "expense";
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

const CATEGORIES_ENDPOINT = "/api/categories";

export const categoryService = {
  getAll: (page: number = 1, pageSize: number = 10) =>
    api.get<PaginatedResponse<Category>>(
      `${CATEGORIES_ENDPOINT}?page=${page}&pageSize=${pageSize}`
    ),

  create: (data: CreateCategoryDTO) =>
    api.post<Category>(CATEGORIES_ENDPOINT, data),

  update: (name: string, data: Partial<CreateCategoryDTO>) =>
    api.put<Category>(`${CATEGORIES_ENDPOINT}/${name}`, data),

  delete: (name: string) => api.delete<void>(`${CATEGORIES_ENDPOINT}/${name}`),
};
