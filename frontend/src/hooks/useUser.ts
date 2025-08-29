import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { createUser } from '@/lib/api/services/users';
import { toast } from 'sonner';


export const useUserMutations = () => {

  const createMutation = useMutation({
    mutationFn: (data: { username: string; email: string; password: string }) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['users']});
      toast.success('User created successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to create user');
    },
  });

  return {
    createMutation,
  };
};
