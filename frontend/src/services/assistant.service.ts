import type { Conversation, PaginatedResponse } from "@/types";
import apiClient from "@/lib/axios";

// Placeholder — no business logic implemented
export const assistantService = {
  listConversations: (): Promise<PaginatedResponse<Conversation>> =>
    apiClient.get("/assistant/conversations/").then((r) => r.data),

  getConversation: (_id: string): Promise<Conversation> =>
    apiClient.get(`/assistant/conversations/${_id}/`).then((r) => r.data),

  createConversation: (_title?: string): Promise<Conversation> =>
    apiClient.post("/assistant/conversations/", { title: _title }).then((r) => r.data),

  deleteConversation: (_id: string): Promise<void> =>
    apiClient.delete(`/assistant/conversations/${_id}/`).then((r) => r.data),
};
