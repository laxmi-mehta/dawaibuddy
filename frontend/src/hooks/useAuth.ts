import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import type { RegisterPayload } from "@/types";

/** Auth actions + state, backed by the zustand store and the API. */
export function useAuth() {
  const store = useAuthStore();

  async function login(email: string, password: string) {
    const tokens = await authService.login(email, password);
    store.setTokens(tokens.access, tokens.refresh);
    const user = await authService.getMe();
    store.setUser(user);
    return user;
  }

  async function register(payload: RegisterPayload) {
    await authService.register(payload);
    // Auto-login after a successful signup.
    return login(payload.email, payload.password);
  }

  function signOut() {
    if (store.refreshToken) {
      authService.logout(store.refreshToken).catch(() => undefined);
    }
    store.logout();
  }

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    login,
    register,
    signOut,
  };
}
