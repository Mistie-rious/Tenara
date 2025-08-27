// src/lib/stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LoginData, CreateTenantData } from "../lib/api/services/auth";
import { login, createTenant } from "../lib/api/services/auth";
import type { User } from "../lib/types/project";

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  loginUser: (data: LoginData) => Promise<User>;
  createTenantUser: (data: CreateTenantData) => Promise<User>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ token: null, user: null }),

      loginUser: async (data) => {
        const res = await login(data);
        if (res.access_token) {
          set({ token: res.access_token, user: res.user });
        }
        return res.user;
      },

      createTenantUser: async (data) => {
        const res = await createTenant(data);
        if (res.access_token) {
          set({ token: res.access_token, user: res.user });
        }
        return res.user;
      },
    }),
    { name: "auth-storage" }
  )
);
