import type { DashboardStats } from "@/types";
import apiClient from "@/lib/axios";

export const dashboardService = {
  get: (): Promise<DashboardStats> => apiClient.get("/users/me/dashboard/").then((r) => r.data),
};
