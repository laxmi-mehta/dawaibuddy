import type { DrugInteraction, InteractionCheckResponse, PaginatedResponse } from "@/types";
import apiClient from "@/lib/axios";

export const interactionsService = {
  list: (): Promise<PaginatedResponse<DrugInteraction>> =>
    apiClient.get("/interactions/").then((r) => r.data),

  get: (id: string): Promise<DrugInteraction> =>
    apiClient.get(`/interactions/${id}/`).then((r) => r.data),

  check: (medicineIds: string[]): Promise<InteractionCheckResponse> =>
    apiClient.post("/interactions/check/", { medicine_ids: medicineIds }).then((r) => r.data),
};
