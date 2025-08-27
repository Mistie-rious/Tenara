'use client';

import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../../components/ui/dropdown-menu';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../../../components/ui/alert-dialog';
import { MoreHorizontal, Edit, Trash2, Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import type { Project } from '../../../lib/types/project';

interface Props {
  project: Project;
  isAdmin: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard = ({ project, isAdmin, onEdit, onDelete }: Props) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 flex justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base">{project.name}</CardTitle>
          <Badge className={getStatusColor(project.status)} variant="secondary">{project.status}</Badge>
        </div>
        {isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(project)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
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
                    <AlertDialogAction onClick={() => onDelete(project.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
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
  );
};
