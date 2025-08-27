import  { useState } from 'react';
import { Button } from '../../components/ui/button';
import { useCreateUser } from '../../lib/api/hooks/useUsers';
import UserProfileCard from './components/ProfileCard';
import CreateUserDialog from './components/CreateUserDialog';
import type { User } from '../../lib/types/project';
import { useUsers } from '../../lib/api/hooks/useUsers';
import { Loader2, Plus, Shield, Users } from 'lucide-react';
export const UsersPage = ({ currentUser }: { currentUser: User }) => {
  const [createUserOpen, setCreateUserOpen] = useState(false);

  // Fetch users with React Query
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useUsers();

  // Create user mutation
  const { mutate: createUser, isPending: creating } = useCreateUser();

  const handleCreateUser =  async (data: { name: string; email: string; password: string }) => {
    createUser(data, {
      onSuccess: () => {
        setCreateUserOpen(false);
      },
    });
  };

  const isAdmin = currentUser.role === "ADMIN";

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading team members...</span>
      </div>
    );

  if (isError)
    return (
      <div className="text-center p-8 text-red-600">
        <p>{(error as Error).message || "Failed to fetch users"}</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Members</h1>
          <p className="text-muted-foreground">Manage your tenant's users and access</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setCreateUserOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        )}
      </div>

      {/* Users Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((u) => (
          <UserProfileCard key={u.id} user={u} />
        ))}
      </div>

      {/* Empty State */}
      {users.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No team members yet</h3>
          <p className="text-muted-foreground mb-4">
            Start by adding your first team member
          </p>
          {isAdmin && (
            <Button onClick={() => setCreateUserOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          )}
        </div>
      )}

      {/* Info message for non-admins */}
      {!isAdmin && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
          <Shield className="h-5 w-5 text-blue-600 mr-2" />
          <p className="text-sm text-blue-800">
            You're viewing the team directory. Contact an administrator to manage
            user access.
          </p>
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
  );
};