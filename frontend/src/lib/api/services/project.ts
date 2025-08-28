import{ apiClient} from '../apiClient';
import type { Project } from '../../types/project';


export const getProjects = async (): Promise<Project[]> => {
    const { data } = await apiClient.get('/projects');
    return data.data;
  };
  
  export const createProject = async (project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> => {
    const { data } = await apiClient.post('/projects', project);
    return data.data;
  };
  
  export const updateProject = async (id: string, project: Partial<Project>): Promise<Project> => {
    const { data } = await apiClient.patch(`/projects/${id}`, project);
    return data.data;
  };
  
  export const deleteProject = async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  };

  export const getProjectById = async (id: string): Promise<void> => {
    await apiClient.get(`/projects/${id}`);
  };

  export const assignProject = async (projectId: string, userIds: string[]): Promise<void> => {
    await apiClient.post(`/projects/${projectId}/assign-users`, { userIds });
  };
  
  

  export const unassignProject = async ({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<void> => {
    await apiClient.delete(`/projects/${id}/unassign-user/${userId}`);
  };