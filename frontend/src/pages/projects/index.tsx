import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { FolderOpen, Plus, Loader2 } from 'lucide-react';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '../../lib/api/hooks/useProject';
import { CreateProjectDialog } from './components/CreateProjectDialog';
import { EditProjectDialog } from './components/EditProjectDialog';
import { ProjectCard } from './components/ProjectCard';
import { useAuthStore } from '../../stores/authStore';

export const ProjectsPage = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  const { data: projects = [], isLoading, isError, refetch } = useProjects();
  const { mutateAsync: createProject } = useCreateProject();
  const { mutateAsync: updateProject } = useUpdateProject();
  const { mutateAsync: deleteProject } = useDeleteProject();

  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  const handleCreate = async (data: { name: string; description: string; status: string }) => {
    await createProject(data);
  };

  const handleUpdate = async (data: { name: string; description: string; status: string }) => {
    if (!editProject) return;
    await updateProject({ id: editProject.id, data });
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-6 w-6 animate-spin" />
      <span className="ml-2">Loading projects...</span>
    </div>
  );

  if (isError) return (
    <div className="text-center p-8 text-red-600">
      <p>Failed to load projects</p>
      <Button onClick={() => refetch()} className="mt-4">Try Again</Button>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your tenant's projects</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            isAdmin={isAdmin}
            onEdit={setEditProject}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first project</p>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Project
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} onSubmit={handleCreate} />
      {editProject && (
        <EditProjectDialog
          project={editProject}
          open={!!editProject}
          onOpenChange={() => setEditProject(null)}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
};
