import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog';
import { FolderOpen, Plus, MoreHorizontal, Edit, Trash2, Calendar, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | string;
  createdAt: string;
}

const api = {
  getProjects: async (): Promise<Project[]> => {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },
  createProject: async (data: Omit<Project, 'id' | 'createdAt'>): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
  },
  updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update project');
    return response.json();
  },
  deleteProject: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete project');
  }
};

const CreateProjectDialog = ({ open, onOpenChange, onSubmit }: { open: boolean, onOpenChange: (open: boolean) => void, onSubmit: (data: Omit<Project, 'id' | 'createdAt'>) => Promise<void> }) => {
  const [formData, setFormData] = useState({ name: '', description: '', status: 'ACTIVE' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ name: '', description: '', status: 'ACTIVE' });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>Add a new project to your tenant</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Label>Project Name</Label>
          <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Website Redesign" />
          <Label>Description</Label>
          <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Redesign the company website..." />
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading || !formData.name.trim()}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditProjectDialog = ({ project, open, onOpenChange, onSubmit }: { project: Project, open: boolean, onOpenChange: (open: boolean) => void, onSubmit: (data: Partial<Project>) => Promise<void> }) => {
  const [formData, setFormData] = useState({ name: project.name, description: project.description || '', status: project.status });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;
    setLoading(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update project details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Label>Project Name</Label>
          <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <Label>Description</Label>
          <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={value => setFormData({...formData, status: value})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading || !formData.name.trim()}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : 'Update Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const ProjectsPage = ({ userRole = 'ADMIN' }: { userRole?: 'ADMIN' | 'USER' }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreateProject = async (data: Omit<Project, 'id' | 'createdAt'>) => {
    await api.createProject(data);
    fetchProjects();
  };

  const handleUpdateProject = async (data: Partial<Project>) => {
    if (!editProject) return;
    await api.updateProject(editProject.id, data);
    fetchProjects();
  };

  const handleDeleteProject = async (id: string) => {
    await api.deleteProject(id);
    fetchProjects();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-6 w-6 animate-spin" />
      <span className="ml-2">Loading projects...</span>
    </div>
  );

  if (error) return (
    <div className="text-center p-8 text-red-600">
      <p>{error}</p>
      <Button onClick={fetchProjects} className="mt-4">Try Again</Button>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your tenant's projects</p>
        </div>
        <Button onClick={() => setCreateProjectOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map(project => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 flex justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base">{project.name}</CardTitle>
                <Badge className={getStatusColor(project.status)} variant="secondary">{project.status}</Badge>
              </div>
              {userRole === 'ADMIN' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditProject(project)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-red-600" onSelect={e => e.preventDefault()}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. Delete "{project.name}"?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProject(project.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">{project.description || 'No description provided'}</p>
            </CardContent>
            <CardFooter className="pt-3 border-t flex items-center text-xs text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" /> Created {new Date(project.createdAt).toLocaleDateString()}
            </CardFooter>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first project</p>
          <Button onClick={() => setCreateProjectOpen(true)}><Plus className="mr-2 h-4 w-4" /> Create Project</Button>
        </div>
      )}

      <CreateProjectDialog open={createProjectOpen} onOpenChange={setCreateProjectOpen} onSubmit={handleCreateProject} />
      {editProject && <EditProjectDialog project={editProject} open={!!editProject} onOpenChange={() => setEditProject(null)} onSubmit={handleUpdateProject} />}
    </div>
  );
};
