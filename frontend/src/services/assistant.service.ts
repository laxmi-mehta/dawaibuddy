import type { Conversation, Message, PaginatedResponse } from "@/types";
import apiClient from "@/lib/axios";

export interface AskResponse {
  conversation_id: string;
  reply: Message;
}

export const assistantService = {
  listConversations: (): Promise<PaginatedResponse<Conversation>> =>
    apiClient.get("/assistant/conversations/").then((r) => r.data),

  getConversation: (id: string): Promise<Conversation> =>
    apiClient.get(`/assistant/conversations/${id}/`).then((r) => r.data),

  createConversation: (title?: string): Promise<Conversation> =>
    apiClient.post("/assistant/conversations/", { title }).then((r) => r.data),

  deleteConversation: (id: string): Promise<void> =>
    apiClient.delete(`/assistant/conversations/${id}/`).then((r) => r.data),

  ask: (message: string, conversationId?: string): Promise<AskResponse> =>
    apiClient
      .post("/assistant/ask/", { message, conversation_id: conversationId })
      .then((r) => r.data),
};
