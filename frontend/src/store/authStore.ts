import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => {
        set({ token });
        // Store token separately in localStorage
        localStorage.setItem("access_token", token);
      },
      clearAuth: () => {
        set({ token: null });
        localStorage.removeItem("access_token");
      },
    }),
    {
      name: "auth-storage", // this is still the persisted state object
    }
  )
);
