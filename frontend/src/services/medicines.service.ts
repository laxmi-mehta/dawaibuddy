import type { Medicine, PaginatedResponse } from "@/types";
import apiClient from "@/lib/axios";

export interface MedicineListParams {
  search?: string;
  category?: string;
}

export const medicinesService = {
  list: (params: MedicineListParams = {}): Promise<PaginatedResponse<Medicine>> =>
    apiClient.get("/medicines/", { params }).then((r) => r.data),

  get: (id: string): Promise<Medicine> => apiClient.get(`/medicines/${id}/`).then((r) => r.data),

  categories: (): Promise<string[]> => apiClient.get("/medicines/categories/").then((r) => r.data),

  popular: (): Promise<Medicine[]> => apiClient.get("/medicines/popular/").then((r) => r.data),
};
