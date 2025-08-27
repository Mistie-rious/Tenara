import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { FolderOpen, Plus } from 'lucide-react';
import { CreateProjectDialog } from './components/CreateProjectDialog';
import { EditProjectDialog } from './components/EditProjectDialog';
import { ProjectCard } from './components/ProjectCard';
import type { Project } from '../../lib/types/project';
import { deleteProject, getProjects, updateProject } from '@/lib/api/services/project';
import { getUsers } from '@/lib/api/services/users';
import { useUserStore } from '@/store/userStore';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { createProject } from '@/lib/api/services/project';
import { getProjectById } from '@/lib/api/services/project';

export type UpdateProjectPayload = {
  id: string;
  data: Partial<Project>;
};

const ProjectsPage = () => {
  // Demo user (admin)
 

  // Demo project data
  
  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const {data : projectsData = [], isLoading: projectsLoading, error: projectsError} = useQuery({queryKey: ['projects'], queryFn: getProjects})

 
  const {user} = useUserStore()
  const isAdmin = user?.role === 'ADMIN';

  const queryClient = useQueryClient();

  const createMutation = useMutation({mutationFn: createProject, 
    onSuccess: () => {
      console.log('sucess!')
      queryClient.invalidateQueries({queryKey: ['projects']})
  }})




  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: UpdateProjectPayload) => {
      return updateProject(id, data);
    },
    onSuccess: () => {
      console.log('success!');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
  const deleteMutation = useMutation({mutationFn: deleteProject, 
    onSuccess: () => {
      console.log('sucess!')
      queryClient.invalidateQueries({queryKey: ['projects']})
  }})
 
  const handleCreate = (data: any) => {
   createMutation.mutate(data)
  
  };

  const handleUpdate = (payload: UpdateProjectPayload) => {
   updateMutation.mutate( payload)
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
                Projects
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Manage your tenant's projects
              </p>
            </div>
            {isAdmin && (
              <Button 
                onClick={() => setCreateOpen(true)}
                className="w-full sm:w-auto"
                size="default"
              >
                <Plus className="mr-2 h-4 w-4" /> 
                <span className="sm:inline">New Project</span>
              </Button>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {projectsData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {projectsData?.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isAdmin={isAdmin}
                onEdit={setEditProject}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20">
            <div className="text-center max-w-md mx-auto px-4">
              <FolderOpen className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                No projects yet
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                Get started by creating your first project
              </p>
              {isAdmin && (
                <Button 
                  onClick={() => setCreateOpen(true)}
                  size="default"
                >
                  <Plus className="mr-2 h-4 w-4" /> Create Project
                </Button>
              )}
            </div>
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
      </div>
    </div>
  );
};

export default ProjectsPage;