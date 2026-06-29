import type { PaginatedResponse, Reminder } from "@/types";
import apiClient from "@/lib/axios";

// Placeholder — no business logic implemented
export const remindersService = {
  list: (): Promise<PaginatedResponse<Reminder>> =>
    apiClient.get("/reminders/").then((r) => r.data),

  get: (_id: string): Promise<Reminder> => apiClient.get(`/reminders/${_id}/`).then((r) => r.data),

  create: (_data: Partial<Reminder>): Promise<Reminder> =>
    apiClient.post("/reminders/", _data).then((r) => r.data),

  update: (_id: string, _data: Partial<Reminder>): Promise<Reminder> =>
    apiClient.patch(`/reminders/${_id}/`, _data).then((r) => r.data),

  remove: (_id: string): Promise<void> =>
    apiClient.delete(`/reminders/${_id}/`).then((r) => r.data),
};
