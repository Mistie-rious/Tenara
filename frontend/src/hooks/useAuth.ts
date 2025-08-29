import { useMutation } from "@tanstack/react-query";
import { login, createTenant } from "@/lib/api/services/auth";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { queryClient } from "@/lib/queryClient";
export const useAuth = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const navigate = useNavigate();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await login(data);
      if (res.access_token) {
        setToken(res.access_token);
        const { password, ...safeUser } = res.user;
        setUser(safeUser);
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("Login successful!");
      navigate("/dashboard");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Login failed");
    },
  });


  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; username: string; email: string; password: string }) => {
      return createTenant(data);
    },
    onSuccess: () => {
      toast.success("Tenant created successfully!");
      navigate("/login");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Tenant creation failed");
    },
  });

  // Logout function
  const logout = () => {
    clearAuth();
    clearUser();
    queryClient.clear()
   
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return {
    loginMutation,
    registerMutation,
    logout,
  };
};
