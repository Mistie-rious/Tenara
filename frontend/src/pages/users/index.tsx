import { useState } from 'react';
import { Button } from '../../components/ui/button';
import UserProfileCard from './components/ProfileCard';
import CreateUserDialog from './components/CreateUserDialog';
import { Plus, Users, Shield } from 'lucide-react';
import { getUsers } from '@/lib/api/services/users';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/store/userStore';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserMutations } from '@/hooks/useUser';

const UsersPage = () => {
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const {user} = useUserStore();
  const {data : usersData = []} = useQuery({queryKey: ['users', user?.tenant.id, ], queryFn: getUsers})
  const navigate = useNavigate();
  const { createMutation } = useUserMutations(
  );
 




  const handleCreateUser = async (data: { username: string; email: string; password: string }) => {
    setCreating(true);
    
    createMutation.mutate(data, {
      onSuccess: () => {
       
        setCreateUserOpen(false);
        setCreating(false);
      },
      onError: (error) => {
       
        setCreating(false);
        console.error('Failed to create user:', error);
      }
    });
  };

  const isAdmin = user?.role === 'ADMIN';
  
  return (
    <div className="min-h-screen min-w-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
            <div className='flex space-x-2' >
          <div

  onClick={() => navigate('/dashboard')}
  className="flex items-center w-fit text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
>
  <ArrowLeft className="w-4 h-4 mr-1" />
</div>
<div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
Team Members
              </div>
              </div>
             
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Manage your tenant's users and access
              </p>
            </div>
            {isAdmin && (
              <Button 
                onClick={() => setCreateUserOpen(true)}
                className="w-full sm:w-auto"
                size="default"
              >
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            )}
          </div>
        </div>
  
        {/* Users Grid */}
        {usersData?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6">
            {usersData?.map((user) => (
              <UserProfileCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 mb-6">
            <div className="text-center max-w-md mx-auto px-4">
              <Users className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                No team members yet
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                Start by adding your first team member
              </p>
              {isAdmin && (
                <Button 
                  onClick={() => setCreateUserOpen(true)}
                  size="default"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add User
                </Button>
              )}
            </div>
          </div>
        )}
  
        {/* Info message for non-admins */}
        {!isAdmin && (
          <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex items-start sm:items-center gap-3">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-sm sm:text-base text-blue-800 dark:text-blue-200">
                You're viewing the team directory. Contact an administrator to manage user access.
              </p>
            </div>
          </div>
        )}
  
        {/* Create User Dialog */}
        <CreateUserDialog
          open={createUserOpen}
          onOpenChange={setCreateUserOpen}
          onSubmit={handleCreateUser}
          loading={creating}
        />
      </div>
    </div>
  );
};

export default UsersPage;
