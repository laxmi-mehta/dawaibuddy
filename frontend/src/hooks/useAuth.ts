import { useAuthStore } from "@/store/auth.store";

// Thin wrapper — add logic here when auth feature is implemented
export function useAuth() {
  return useAuthStore();
}
