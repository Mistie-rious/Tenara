'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Loader2 } from 'lucide-react';
import type { Project } from '../../../lib/types/project';
import type { UpdateProjectPayload } from '..';
interface Props {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: UpdateProjectPayload) => void;
}

export const EditProjectDialog = ({ project, open, onOpenChange, onSubmit }: Props) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || '');
  const [status, setStatus] = useState(project.status);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    setName(project.name);
    setDescription(project.description || '');
    setStatus(project.status);
  }, [project]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
    await onSubmit({ 
  id: project.id, 
  data: { name, description, status } 
});

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
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          <Label>Status</Label>
          
          <Select value={status} onValueChange={(val) => setStatus(val)}>
            <SelectTrigger className="border-muted focus:ring-accent bg-white text-muted-foreground"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="ONGOING">Ongoing</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
      
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading || !name.trim()}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : 'Update Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
