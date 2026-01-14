import { authApi } from "./auth.api";
import { tokenStorage } from "@/lib/token";
import { useAuthStore } from "./auth.store";

export const authService = {
  // 🔐 LOGIN
  async login(email: string, password: string) {
    const res = await authApi.login(email, password);

    if (res.data?.accessToken) {
      await tokenStorage.set(res.data.accessToken);
    }

    await this.fetchMe();
  },

  // 👤 GET /me
  async fetchMe() {
    const res = await authApi.me();

    useAuthStore.getState().setAuth({
      user: res.data.user,
      profile: res.data.profile ?? null,
      profileComplete: res.data.profileComplete,
    });
  },

  // 🚪 LOGOUT
  async logout() {
    try {
      await authApi.logout();
    } finally {
      await tokenStorage.clear();
      useAuthStore.getState().reset();
    }
  },
};
