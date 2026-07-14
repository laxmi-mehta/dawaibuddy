import type { PaginatedResponse, Prescription, PrescriptionOcrDraft } from "@/types";
import apiClient from "@/lib/axios";

export const prescriptionsService = {
  list: (): Promise<PaginatedResponse<Prescription>> =>
    apiClient.get("/prescriptions/").then((r) => r.data),

  get: (id: string): Promise<Prescription> =>
    apiClient.get(`/prescriptions/${id}/`).then((r) => r.data),

  create: (data: Partial<Prescription>): Promise<Prescription> =>
    apiClient.post("/prescriptions/", data).then((r) => r.data),

  update: (id: string, data: Partial<Prescription>): Promise<Prescription> =>
    apiClient.patch(`/prescriptions/${id}/`, data).then((r) => r.data),

  remove: (id: string): Promise<void> =>
    apiClient.delete(`/prescriptions/${id}/`).then((r) => r.data),

  ocr: (file: File): Promise<PrescriptionOcrDraft> => {
    const form = new FormData();
    form.append("image", file);
    return apiClient
      .post("/prescriptions/ocr/", form, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data);
  },
};
