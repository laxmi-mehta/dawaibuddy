import type { PaginatedResponse, Reminder, ReminderTodayResponse } from "@/types";
import apiClient from "@/lib/axios";

export const remindersService = {
  list: (): Promise<PaginatedResponse<Reminder>> =>
    apiClient.get("/reminders/").then((r) => r.data),

  today: (): Promise<ReminderTodayResponse> =>
    apiClient.get("/reminders/today/").then((r) => r.data),

  get: (id: string): Promise<Reminder> => apiClient.get(`/reminders/${id}/`).then((r) => r.data),

  create: (data: Partial<Reminder>): Promise<Reminder> =>
    apiClient.post("/reminders/", data).then((r) => r.data),

  update: (id: string, data: Partial<Reminder>): Promise<Reminder> =>
    apiClient.patch(`/reminders/${id}/`, data).then((r) => r.data),

  remove: (id: string): Promise<void> => apiClient.delete(`/reminders/${id}/`).then((r) => r.data),

  markTaken: (id: string, taken = true): Promise<Reminder> =>
    apiClient.post(`/reminders/${id}/mark-taken/`, { taken }).then((r) => r.data),
};
