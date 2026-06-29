import axios from "axios";

import { useAuthStore } from "@/store/auth.store";

const apiClient = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Attach JWT access token (from the auth store) to every request
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, attempt a token refresh then retry the request once
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };
    const store = useAuthStore.getState();

    if (error.response?.status === 401 && !originalRequest._retry && store.refreshToken) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post("/api/v1/auth/token/refresh/", {
          refresh: store.refreshToken,
        });
        store.setTokens(data.access, store.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return apiClient(originalRequest);
      } catch {
        store.logout();
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
