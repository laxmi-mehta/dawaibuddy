import type { DrugInteraction, PaginatedResponse } from "@/types";
import apiClient from "@/lib/axios";

// Placeholder — no business logic implemented
export const interactionsService = {
  list: (): Promise<PaginatedResponse<DrugInteraction>> =>
    apiClient.get("/interactions/").then((r) => r.data),

  get: (_id: string): Promise<DrugInteraction> =>
    apiClient.get(`/interactions/${_id}/`).then((r) => r.data),
};
