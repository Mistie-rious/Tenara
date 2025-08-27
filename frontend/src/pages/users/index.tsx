import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Users, Plus, Mail, Calendar, Activity, Shield, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api';

interface User {
  id: string;
  name?: string;
  username?: string;
  email: string;
  role: 'ADMIN' | 'USER' | string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

// API functions without token
const api = {
  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users/findAll`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },
  createUser: async (data: { name: string; email: string; password: string; }): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },
};

const CreateUserDialog = ({ open, onOpenChange, onSubmit }: { open: boolean; onOpenChange: (open: boolean) => void; onSubmit: (data: { name: string; email: string; password: string }) => Promise<void> }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) return;
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ name: '', email: '', password: '' });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>Add a new team member</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading || !formData.name.trim() || !formData.email.trim() || !formData.password.trim()}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : 'Create User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const UserProfileCard = ({ user }: { user: User }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="pb-3 flex items-start space-x-3">
      <Avatar className="w-12 h-12">
        <AvatarFallback>{(user.username || user.name || 'U').substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="space-y-1 flex-1 min-w-0">
        <CardTitle className="text-base">{user.username || user.name || 'Unknown User'}</CardTitle>
        <div className="flex items-center flex-wrap gap-2">
          <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="text-xs">
            {user.role === 'ADMIN' && <Shield className="mr-1 h-3 w-3" />}
            {user.role}
          </Badge>
          <Badge variant={user.isActive ? 'outline' : 'destructive'} className="text-xs">
            {user.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-3 text-sm">
      <div className="flex items-center text-muted-foreground">
        <Mail className="mr-2 h-3 w-3" />
        <span className="truncate">{user.email}</span>
      </div>
      <div className="flex items-center text-muted-foreground">
        <Calendar className="mr-2 h-3 w-3" />
        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center text-muted-foreground">
        <Activity className="mr-2 h-3 w-3" />
        <span>{user.lastLogin ? `Last login ${new Date(user.lastLogin).toLocaleDateString()}` : 'Never logged in'}</span>
      </div>
    </CardContent>
  </Card>
);

export const UsersPage = ({ currentUser }: { currentUser: User }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createUserOpen, setCreateUserOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreateUser = async (data: { name: string; email: string; password: string }) => {
    await api.createUser(data);
    await fetchUsers();
  };

  const isAdmin = currentUser.role === 'ADMIN';

  if (loading) return <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /><span className="ml-2">Loading team members...</span></div>;
  if (error) return <div className="text-center p-8 text-red-600"><p>{error}</p><Button onClick={fetchUsers}>Try Again</Button></div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Members</h1>
          <p className="text-muted-foreground">Manage your tenant's users and access</p>
        </div>
        {isAdmin && <Button onClick={() => setCreateUserOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add User</Button>}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map(u => <UserProfileCard key={u.id} user={u} />)}
      </div>

      {users.length === 0 && <div className="text-center py-12"><Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" /><h3 className="text-lg font-medium mb-2">No team members yet</h3><p className="text-muted-foreground mb-4">Start by adding your first team member</p>{isAdmin && <Button onClick={() => setCreateUserOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add User</Button>}</div>}

      {!isAdmin && <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center"><Shield className="h-5 w-5 text-blue-600 mr-2" /><p className="text-sm text-blue-800">You're viewing the team directory. Contact an administrator to manage user access.</p></div>}

      <CreateUserDialog open={createUserOpen} onOpenChange={setCreateUserOpen} onSubmit={handleCreateUser} />
    </div>
  );
};
