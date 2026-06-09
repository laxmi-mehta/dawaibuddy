import type { TokenPair, User } from "@/types";
import apiClient from "@/lib/axios";

// Placeholder — no business logic implemented
export const authService = {
  login: (_email: string, _password: string): Promise<TokenPair> =>
    apiClient.post("/auth/token/", { email: _email, password: _password }).then((r) => r.data),

  refresh: (_refresh: string): Promise<{ access: string }> =>
    apiClient.post("/auth/token/refresh/", { refresh: _refresh }).then((r) => r.data),

  logout: (_refresh: string): Promise<void> =>
    apiClient.post("/auth/token/blacklist/", { refresh: _refresh }).then((r) => r.data),

  getMe: (): Promise<User> => apiClient.get("/users/me/").then((r) => r.data),
};
