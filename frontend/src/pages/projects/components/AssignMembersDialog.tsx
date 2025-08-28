'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Loader2, UserPlus } from 'lucide-react';
import type { Project, User } from '@/lib/types/project';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  users: User[];
  onSubmit: (projectId: string, userIds: string[]) => void;
  loading?: boolean;
}

export const AssignMembersDialog = ({ open, onOpenChange, project, users, onSubmit, loading }: Props) => {
  const [selected, setSelected] = useState<string[]>(project.assignedUsers?.map(m => m.id) || []);
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(
    (u) => u.username?.toLowerCase().includes(search.toLowerCase())
  );
  

  const toggleUser = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSubmit(project.id, selected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Members</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3"
        />

        <div className="max-h-60 overflow-y-auto space-y-1">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                selected.includes(user.id) ? 'bg-gray-200 dark:bg-gray-700' : ''
              }`}
              onClick={() => toggleUser(user.id)}
            >
              <span>{user.username}</span>
              {selected.includes(user.id) && <UserPlus className="h-4 w-4 text-green-600" />}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
