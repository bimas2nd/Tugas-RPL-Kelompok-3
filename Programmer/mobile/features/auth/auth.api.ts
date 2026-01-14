import api from "@/lib/api";

export const authApi = {
  login: (email: string, password: string) => api.post("/login", { email, password }),

  me: () => api.get("/me"),

  logout: () => api.delete("/logout"),

  refreshToken: () => api.get("/token"),
};
