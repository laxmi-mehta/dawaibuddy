import type { Medicine, PaginatedResponse } from "@/types";
import apiClient from "@/lib/axios";

// Placeholder — no business logic implemented
export const medicinesService = {
  list: (): Promise<PaginatedResponse<Medicine>> =>
    apiClient.get("/medicines/").then((r) => r.data),

  get: (_id: string): Promise<Medicine> =>
    apiClient.get(`/medicines/${_id}/`).then((r) => r.data),
};
