import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects, createProject, updateProject, deleteProject } from "../services/project";
import type { Project } from "../../types/project";


export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
};


export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Project, "id" | "createdAt">) => createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['projects']});
    },
  });
};


export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['projects']});
    },
  });
};


export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['projects']});
    },
  });
};
