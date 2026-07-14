import type { FamilyMember, PaginatedResponse, Profile } from "@/types";
import apiClient from "@/lib/axios";

export const profileService = {
  get: (): Promise<Profile> => apiClient.get("/users/me/profile/").then((r) => r.data),

  update: (data: Partial<Profile>): Promise<Profile> =>
    apiClient.patch("/users/me/profile/", data).then((r) => r.data),

  listFamily: (): Promise<PaginatedResponse<FamilyMember>> =>
    apiClient.get("/users/family/").then((r) => r.data),

  addFamily: (data: Partial<FamilyMember>): Promise<FamilyMember> =>
    apiClient.post("/users/family/", data).then((r) => r.data),

  updateFamily: (id: string, data: Partial<FamilyMember>): Promise<FamilyMember> =>
    apiClient.patch(`/users/family/${id}/`, data).then((r) => r.data),

  removeFamily: (id: string): Promise<void> =>
    apiClient.delete(`/users/family/${id}/`).then((r) => r.data),
};
