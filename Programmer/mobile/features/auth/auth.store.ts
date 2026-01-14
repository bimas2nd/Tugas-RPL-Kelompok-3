import { create } from "zustand";

/* =======================
   TYPES
======================= */

export type UserRole = "WARGA" | "ADMIN" | "RW";

export type User = {
  id: string;
  email: string;
  role: UserRole;
};

export type Profile = {
  id: string;
  nama: string;
  alamat?: string;
  wilayah?: string;
  saldo?: number;
  url?: string;
};

type AuthState = {
  // status
  isAuthenticated: boolean;
  hydrated: boolean;

  // data
  user: User | null;
  profile: Profile | null;
  profileComplete: boolean;

  // actions
  setAuth: (params: { user: User; profile: Profile | null; profileComplete: boolean }) => void;

  reset: () => void;
  setHydrated: () => void;
};

/* =======================
   STORE
======================= */

export const useAuthStore = create<AuthState>((set) => ({
  // initial state
  isAuthenticated: false,
  hydrated: false,

  user: null,
  profile: null,
  profileComplete: false,

  /* ===== ACTIONS ===== */

  setAuth: ({ user, profile, profileComplete }) =>
    set({
      user,
      profile,
      profileComplete,
      isAuthenticated: true,
      hydrated: true,
    }),

  reset: () =>
    set({
      isAuthenticated: false,
      user: null,
      profile: null,
      profileComplete: false,
      hydrated: true,
    }),

  setHydrated: () => set({ hydrated: true }),
}));
