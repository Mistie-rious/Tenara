import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  FolderOpen, 
  Users, 
  Activity, 
  BarChart3,
  Loader2,
  Settings,
  Bell,
  Search,
  ChevronRight,
  TrendingUp,
  Clock,
  Shield,
  Calendar,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/lib/api/services/project';
import { getUsers } from '@/lib/api/services/users';
import { useUserStore } from '@/store/userStore';
// Mock data and interfaces
interface Project {
  id: string;
  name: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | string;
  createdAt: string;
  progress?: number;
  dueDate?: string;
}

interface User {
  id: string;
  username: string;
  role: 'ADMIN' | 'USER' | string;
  isActive: boolean;
  lastLogin?: string;
  avatar?: string;
}

const DashboardPage = () => {
  // Mock current user
  const currentUser = {
    id: '1',
    username: 'John Doe',
    role: 'ADMIN',
    email: 'john@acme.com',
    tenant: 'Acme Corporation'
  };

 

  const {data : projectsData, isLoading: projectsLoading, error: projectsError} = useQuery({queryKey: ['projects'], queryFn: getProjects})
  const {data : usersData, isLoading: usersLoading, error: usersError} = useQuery({queryKey: ['users'], queryFn: getUsers})
  const {user} = useUserStore()
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const stats = {
    totalProjects: projectsData?.length || 0,
    activeProjects: projectsData?.filter(p => p.status === 'ACTIVE').length || 0,
    completedProjects: projectsData?.filter(p => p.status === 'COMPLETED').length || 0,
    totalUsers: usersData?.length || 0,
    activeUsers: usersData?.filter(u => u.isActive).length || 0,
  };

  const navigate = useNavigate()

  const navigateToProjects = () => {
    // Navigation logic here
    navigate('/projects');
  };

  const navigateToUsers = () => {
    // Navigation logic here
    navigate('/users');
  };

  return (
    <div className="min-h-screen w-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {/* Left side - Welcome and user info */}
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-blue-600 text-white text-lg">
                {user?.username?.[0] ?? ' '}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className=" text-xl font-bold text-gray-900 dark:text-gray-100">
                  Welcome back, {user?.username} 👋
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.username} • {user?.email}
                </p>
              </div>
            </div>

            {/* Right side - Organization and role */}
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{user?.tenant?.name}</p>
              <Badge variant={currentUser.role === 'ADMIN' ? 'default' : 'secondary'} className="text-xs mt-1">
                {user?.role === 'ADMIN' ? (
                  <>
                    <Shield className="w-3 h-3 mr-1" />
                    Administrator
                  </>
                ) : (
                  <>
                    <Users className="w-3 h-3 mr-1" />
                    Team Member
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={navigateToProjects}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Total Projects
              </CardTitle>
              <FolderOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.totalProjects}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                
                All ptojects
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={navigateToProjects}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Active Projects
              </CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.activeProjects}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                
                All projects
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={navigateToProjects}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Completed
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.completedProjects}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
               
                Completed
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={navigateToUsers}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Team Members
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.activeUsers}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stats.totalUsers} total members
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center text-lg">
                <FolderOpen className="mr-2 h-5 w-5" />
                Recent Projects
              </CardTitle>
              <Button variant="outline" size="sm" onClick={navigateToProjects}>
                View All <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectsData && projectsData.length > 0 ? (
                projectsData.slice(0, 4).map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{project.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getStatusColor(project.status)} variant="secondary">
                            {project.status}
                          </Badge>
                      \
                        </div>
                      </div>
                    </div>
                   \
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No projects yet 📋</p>
                  <p className="text-xs text-gray-400 mt-1">Create your first project to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center text-lg">
                <Users className="mr-2 h-5 w-5" />
                Team Activity
              </CardTitle>
              <Button variant="outline" size="sm" onClick={navigateToUsers}>
                Manage <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {usersData && usersData.length > 0 ? (
                usersData.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                        {user.username?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {user.username}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {user.role === 'ADMIN' ? 'Admin' : 'Member'}
                        </Badge>
                        <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {user.isActive ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : 'Never'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No team members yet 🤝</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;