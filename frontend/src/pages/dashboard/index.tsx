import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  FolderOpen, 
  Users, 
  Activity, 
  BarChart3,
  ChevronRight,

} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/lib/api/services/project';
import { getUsers } from '@/lib/api/services/users';
import { useUserStore } from '@/store/userStore';
import { ProjectCard } from './components/ProjectCard';
import { StatCard } from './components/StatCard';
import { LogoutButton } from './components/Logout';
import { UserCard } from './components/UserCard';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
const DashboardPage = () => {
  
  const {user} = useUserStore()
 

  const {data : projectsData = [], isLoading: projectsLoading} = useQuery({ queryKey: ['projects', user?.tenant.id], queryFn: getProjects})
  const {data : usersData = [], isLoading: usersLoading, } = useQuery({queryKey: ['users', user?.tenant.id], queryFn: getUsers})

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'INACTIVE': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'ONGOING': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const stats = {
    totalProjects: projectsData?.length || 0,
    activeProjects: projectsData?.filter(p => p.status === 'ONGOING').length || 0,
    completedProjects: projectsData?.filter(p => p.status === 'COMPLETED').length || 0,
    totalUsers: usersData?.length || 0,
    activeUsers: usersData?.filter(u => u.isActive).length || 0,
  };

  const navigate = useNavigate()

  const navigateToProjects = () => {
    navigate('/projects');
  };

  const navigateToUsers = () => {
    navigate('/users');
  };

  return (
    <div className="min-h-screen min-w-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-blue-600 text-white text-lg">{user?.username?.[0] ?? ' '}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">Welcome back, {user?.username} 👋</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{user?.tenant?.name}</p>
            <Badge variant={user?.role === 'ADMIN' ? 'default' : 'secondary'} className="text-xs mt-1"> {user?.role === 'ADMIN' ? ( <> <Shield className="w-3 h-3 mr-1" /> Administrator </> ) : ( <> <Users className="w-3 h-3 mr-1" /> Team Member </> )} </Badge>
            </div>
            <LogoutButton />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Projects" value={stats.totalProjects} icon={FolderOpen} onClick={navigateToProjects} />
          <StatCard title="Active Projects" value={stats.activeProjects} icon={Activity} onClick={navigateToProjects} />
          <StatCard title="Completed Projects" value={stats.completedProjects} icon={BarChart3} onClick={navigateToProjects} />
          <StatCard title="Team Members" value={stats.totalUsers} icon={Users} onClick={navigateToUsers} />
        </div>

        {/* Quick Actions / Recent Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center text-lg font-medium"><FolderOpen className="mr-2 h-5 w-5" /> Recent Projects</h2>
              <Button variant="outline" size="sm" onClick={navigateToProjects}>
                View All <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-4">
              {projectsLoading ? (
                <div className="text-center py-8">Loading projects...</div>
              ) : projectsData?.length > 0 ? (
                projectsData.slice(0, 4).map(project => (
                  <ProjectCard key={project.id} project={project} getStatusColor={getStatusColor} />
                ))
              ) : (
                <div className="text-center py-8">
                  <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No projects yet 📋</p>
                  <p className="text-xs text-gray-400 mt-1">Create your first project to get started!</p>
                </div>
              )}
            </div>
          </div>

          {/* Team Activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center text-lg font-medium"><Users className="mr-2 h-5 w-5" /> Team Activity</h2>
              <Button variant="outline" size="sm" onClick={navigateToUsers}>
                Manage <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-4">
              {usersLoading ? (
                <div className="text-center py-8">Loading users...</div>
              ) : usersData?.length > 0 ? (
                usersData?.slice(0, 5).map(user => (
                  <UserCard key={user.id} user={user} />
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No team members yet 🤝</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
