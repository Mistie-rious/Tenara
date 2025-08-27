import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { 
  FolderOpen, 
  Users, 
  Activity, 
  BarChart3,
  Loader2
} from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

interface Project {
  id: string;
  name: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | string;
  createdAt: string;
}

interface User {
  id: string;
  username: string;
  role: 'ADMIN' | 'USER' | string;
  isActive: boolean;
  lastLogin?: string;
}

const api = {
  getProjects: async (): Promise<Project[]> => {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },

  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users/findAll`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  }
};

// Dashboard Page Component
 const DashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsData, usersData] = await Promise.all([
          api.getProjects(),
          api.getUsers()
        ]);
        setProjects(projectsData);
        setUsers(usersData);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'ACTIVE').length,
    completedProjects: projects.filter(p => p.status === 'COMPLETED').length,
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>Error loading dashboard: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your tenant's activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">All projects in your tenant</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedProjects}</div>
            <p className="text-xs text-muted-foreground">Successfully finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">{stats.totalUsers} total users</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Project Status Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FolderOpen className="mr-2 h-5 w-5" />
              Recent Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{project.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(project.status)} variant="secondary">
                    {project.status}
                  </Badge>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No projects yet. Create your first project to get started!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Team Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Team Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center space-x-4">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {user.username?.substring(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.lastLogin 
                        ? `Last active ${new Date(user.lastLogin).toLocaleDateString()}`
                        : 'Never logged in'}
                    </p>
                  </div>
                  <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </div>
              ))}
              {users.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No team members yet. Invite users to collaborate!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Status Distribution */}
      {projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Project Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">{stats.activeProjects}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">{stats.completedProjects}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-600">
                  {projects.filter(p => p.status === 'ARCHIVED').length}
                </div>
                <div className="text-sm text-muted-foreground">Archived</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};



export default DashboardPage;
