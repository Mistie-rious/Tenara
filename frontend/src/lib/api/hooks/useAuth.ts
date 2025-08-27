// src/lib/hooks/useLogout.ts
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearUser = useUserStore((state) => state.clearUser);
  const navigate = useNavigate();

  return () => {
    clearAuth();
    clearUser();
    navigate("/login");
  };
};
