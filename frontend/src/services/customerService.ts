import axios, { AxiosError } from "axios";
import type { Customer, CustomerResponse, ValidationErrorResponse } from "../types/Customer";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

export const parseApiError = (err: unknown): Record<string, string> => {
  const axiosErr = err as AxiosError<ValidationErrorResponse>;
  if (axiosErr.response?.status === 400 && axiosErr.response.data?.errors) {
    return axiosErr.response.data.errors;
  }
  return {
    general: axiosErr.response?.data?.message ?? "An unexpected error occurred",
  };
};

export const customerService = {
  getAll: () =>
    api.get<Customer[]>("/customer"),

  create: (customer: Omit<Customer, "id">) =>
    api.post<CustomerResponse>("/customer", customer),

  getById: (id: string) =>
    api.get<Customer>(`/customer/${id}`),

  update: (id: string, data: Partial<Customer>) =>
    api.patch<CustomerResponse>(`/customer/${id}`, data),

  delete: (id: string) =>
    api.delete(`/customer/${id}`),
};

export default api;
