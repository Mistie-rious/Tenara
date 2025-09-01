'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; description: string; status: string , createdAt: string}) => void;
}

export const CreateProjectDialog = ({ open, onOpenChange, onSubmit }: Props) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('ONGOING');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onSubmit({ name, description, status, createdAt:'2020' });
      setName('');
      setDescription('');
      setStatus('ONGOING');
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
  
      {/* Wrap everything in a form */}
      <form
        onSubmit={(e) => {
          e.preventDefault(); 
          handleSubmit();     
        }}
      >
        <div className="space-y-4 py-4">
          <Label>Project Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Website Redesign"
          />
  
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Redesign the company website..."
          />
  
          <Label>Status</Label>
          <Select   value={status} onValueChange={(val) => setStatus(val)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="ONGOING">Ongoing</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
  
        <DialogFooter className="mt-4">
          <Button type="button" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !name.trim()}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
              </>
            ) : (
              'Create Project'
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
  
  );
};
