import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { createUser } from '@/lib/api/services/users';
import { toast } from 'sonner';
import { useUserStore } from '@/store/userStore';

export const useUserMutations = () => {

  const {user} = useUserStore();
  const createMutation = useMutation({
    mutationFn: (data: { username: string; email: string; password: string }) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['users', user?.tenant.id]});
      toast.success('User created successfully!');
    },
    onError: () => {
      toast.error('Failed to create user');
    },
  });

  return {
    createMutation,
  };
};
