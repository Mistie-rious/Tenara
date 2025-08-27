import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService,} from "../services/users";
import type { User, CreateUserPayload } from "../../types/project";

export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: usersService.getUsers,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, CreateUserPayload>({
    mutationFn: usersService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useProfile = () => {
  return useQuery<User, Error>({
    queryKey: ["profile"],
    queryFn: usersService.getProfile,
  });
};
