import type { RegisterPayload, TokenPair, User } from "@/types";
import apiClient from "@/lib/axios";

export const authService = {
  register: (payload: RegisterPayload): Promise<User> =>
    apiClient.post("/auth/register/", payload).then((r) => r.data),

  login: (email: string, password: string): Promise<TokenPair> =>
    apiClient.post("/auth/token/", { email, password }).then((r) => r.data),

  refresh: (refresh: string): Promise<{ access: string }> =>
    apiClient.post("/auth/token/refresh/", { refresh }).then((r) => r.data),

  logout: (refresh: string): Promise<void> =>
    apiClient.post("/auth/token/blacklist/", { refresh }).then((r) => r.data),

  getMe: (): Promise<User> => apiClient.get("/users/me/").then((r) => r.data),
};
