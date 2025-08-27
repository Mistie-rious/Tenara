import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/api/services/auth";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import type { LoginData } from "@/lib/api/services/auth";

export const useLogin = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useUserStore((state) => state.setUser);
const {token} = useAuthStore()
  return useMutation({
    mutationFn: async (data: LoginData) => {
      const res = await login(data);

      if (res.access_token) {
        setToken(res.access_token);
        console.log(token)

        // Remove sensitive fields like password
        const { password, ...safeUser } = res.user;
        setUser(safeUser);
      }

      console.log(res)
      return res;
     
    },
  });
};
