import { api } from "./api";

export interface Fund {
  name: string;
  description?: string;
}

export interface CreateFundDTO {
  name: string;
  description?: string;
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

const FUNDS_ENDPOINT = "/api/funds";

export const fundService = {
  getAll: (page: number = 1, pageSize: number = 10) =>
    api.get<PaginatedResponse<Fund>>(
      `${FUNDS_ENDPOINT}?page=${page}&pageSize=${pageSize}`
    ),

  getById: (name: string) => api.get<Fund>(`${FUNDS_ENDPOINT}/${name}`),

  create: (data: CreateFundDTO) => api.post<Fund>(FUNDS_ENDPOINT, data),

  update: (name: string, data: Partial<CreateFundDTO>) =>
    api.put<Fund>(`${FUNDS_ENDPOINT}/${name}`, data),

  delete: (name: string) => api.delete<void>(`${FUNDS_ENDPOINT}/${name}`),
};
