import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { createProject, updateProject, deleteProject, assignProject as assignProjectAPI, unassignProject as unassignProjectAPI } from '@/lib/api/services/project';
import { toast } from 'sonner';
import type { Project } from '@/lib/types';

export type UpdateProjectPayload = {
  id: string;
  data: Partial<Project>;
};

export const useProjectMutations = () => {
  
  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to create project');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: UpdateProjectPayload) => updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update project');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to delete project');
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({ projectId, userIds }: { projectId: string; userIds: string[] }) => assignProjectAPI(projectId, userIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Users assigned successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to assign users');
    },
  });

  const unassignMutation = useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) => unassignProjectAPI({ id: projectId, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('User unassigned successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to unassign user');
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    assignMutation,
    unassignMutation,
  };
};
