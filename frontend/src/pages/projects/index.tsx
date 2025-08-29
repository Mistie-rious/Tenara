import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { FolderOpen, Loader2, Plus } from 'lucide-react';
import { CreateProjectDialog } from './components/CreateProjectDialog';
import { EditProjectDialog } from './components/EditProjectDialog';
import { AssignMembersDialog } from './components/AssignMembersDialog';
import { ProjectCard } from './components/ProjectCard';
import type { Project } from '../../lib/types';
import {  getProjects } from '@/lib/api/services/project';
import { useUserStore } from '@/store/userStore';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '@/lib/api/services/users';
export type UpdateProjectPayload = {
  id: string;
  data: Partial<Project>;
};
import { useProjectMutations } from '@/hooks/useProject';
const ProjectsPage = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [assignProjectState, setAssignProjectState] = useState<Project | null>(null);

    const { user } = useUserStore();

  const { data: projectsData = [], isLoading: projectsLoading,  } = useQuery({
    queryKey: ['projects', user?.tenant.id], 
    queryFn: getProjects
  });


  const { data: usersData = [],  } = useQuery({
    queryKey: ['users', user?.tenant.id], 
    queryFn: getUsers
  });


  const isAdmin = user?.role === 'ADMIN';
  const navigate = useNavigate();
  const { 
    createMutation, 
    updateMutation, 
    deleteMutation, 
    assignMutation, 
    unassignMutation 
  } = useProjectMutations();

  const handleCreate = (data: any) => createMutation.mutate(data);
  const handleUpdate = (payload: UpdateProjectPayload) => updateMutation.mutate(payload);
  const handleDelete = (id: string) => deleteMutation.mutate(id);
  const handleAssignSubmit = (projectId: string, userIds: string[]) => assignMutation.mutate({ projectId, userIds });
  const handleUnassign = (projectId: string, userId: string) => unassignMutation.mutate({ projectId, userId });
  const handleAssignClick = (project: Project) => { setAssignProjectState(project); };
  return (
    <div className="min-h-screen min-w-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            
            <div className="min-w-0">
              <div className='flex space-x-2'>
                <div
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center w-fit text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
                  Projects
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Manage your tenant's projects
              </p>
            </div>
            {isAdmin && (
              <Button 
                onClick={() => setCreateOpen(true)}
                className="w-full sm:w-auto flex-shrink-0"
                size="default"
              >
                <Plus className="mr-2 h-4 w-4" /> 
                <span className="sm:inline">New Project</span>
              </Button>
            )}
          </div>
        </div>
  
        {/* Projects Grid */}
        {projectsLoading ? (
          <div className="flex justify-center items-center py-12 sm:py-16 lg:py-20">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500 dark:text-gray-400" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading projects...</span>
          </div>
        ) : projectsData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {projectsData.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isAdmin={isAdmin}
                onEdit={setEditProject}
                onDelete={handleDelete}
                onAssign={handleAssignClick}
                onUnassign={handleUnassign}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 px-4 text-center">
            <FolderOpen className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
              No projects yet
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
              Get started by creating your first project
            </p>
            {isAdmin && (
              <Button onClick={() => setCreateOpen(true)} size="default">
                <Plus className="mr-2 h-4 w-4" /> Create Project
              </Button>
            )}
          </div>
        )}

        {/* Dialogs */}
        <CreateProjectDialog 
          open={createOpen} 
          onOpenChange={setCreateOpen} 
          onSubmit={handleCreate} 
        />
        
        {editProject && (
          <EditProjectDialog
            project={editProject}
            open={!!editProject}
            onOpenChange={() => setEditProject(null)}
            onSubmit={handleUpdate}
          />
        )}

        {assignProjectState && (
          <AssignMembersDialog
            open={!!assignProjectState}
            onOpenChange={() => setAssignProjectState(null)}
            project={assignProjectState}
            users={usersData}
            onSubmit={handleAssignSubmit}
            loading={assignMutation.isPending}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;