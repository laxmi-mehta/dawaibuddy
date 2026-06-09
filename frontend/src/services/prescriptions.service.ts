import type { PaginatedResponse, Prescription } from "@/types";
import apiClient from "@/lib/axios";

// Placeholder — no business logic implemented
export const prescriptionsService = {
  list: (): Promise<PaginatedResponse<Prescription>> =>
    apiClient.get("/prescriptions/").then((r) => r.data),

  get: (_id: string): Promise<Prescription> =>
    apiClient.get(`/prescriptions/${_id}/`).then((r) => r.data),

  create: (_data: Partial<Prescription>): Promise<Prescription> =>
    apiClient.post("/prescriptions/", _data).then((r) => r.data),

  update: (_id: string, _data: Partial<Prescription>): Promise<Prescription> =>
    apiClient.patch(`/prescriptions/${_id}/`, _data).then((r) => r.data),

  remove: (_id: string): Promise<void> =>
    apiClient.delete(`/prescriptions/${_id}/`).then((r) => r.data),
};
