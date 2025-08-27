import { useMutation } from "@tanstack/react-query";
import { login, createTenant } from "../services/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};

export const useCreateTenant = () => {
  return useMutation({
    mutationFn: createTenant,
  });
};
