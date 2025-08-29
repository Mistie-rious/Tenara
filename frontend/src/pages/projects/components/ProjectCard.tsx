'use client';

import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../../components/ui/dropdown-menu';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../../../components/ui/alert-dialog';
import { MoreHorizontal, Edit, Trash2, Calendar, Users } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import type { Project } from '../../../lib/types';

interface Props {
  project: Project;
  isAdmin: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onAssign: (project: Project) => void;
  onUnassign?: (projectId: string, userId: string) => void;
}

export const ProjectCard = ({ project, isAdmin, onEdit, onDelete, onAssign, onUnassign }: Props) => {
  console.log("🧩 ProjectCard received project:", project);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'INACTIVE': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'ONGOING': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleMemberClick = (memberId: string, memberName: string) => {
    if (isAdmin && onUnassign) {
      if (confirm(`Remove ${memberName} from this project?`)) {
        onUnassign(project.id, memberId);
      }
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 flex justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base">{project.name}</CardTitle>
          <Badge className={getStatusColor(project.status)} variant="secondary">
            {project.status}
          </Badge>
        </div>
        {isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(project)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onAssign(project)}>
                <Users className="mr-2 h-4 w-4" />
                Manage Members
              </DropdownMenuItem>

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
                    <AlertDialogAction 
                      onClick={() => onDelete(project.id)} 
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {project.description || 'No description provided'}
        </p>

        {project.assignedUsers && project.assignedUsers.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center gap-1 flex-wrap">
              {project.assignedUsers.slice(0, 4).map((member) => (
                <div
                  key={member.id}
                  className={`h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-200 ${
                    isAdmin ? 'cursor-pointer hover:bg-red-200 dark:hover:bg-red-800 hover:text-red-800 dark:hover:text-red-200' : ''
                  }`}
                  title={isAdmin ? `${member.username} (Click to remove)` : member.username}
                  onClick={isAdmin ? () => handleMemberClick(member.id, member.username ?? "") : undefined}

                >
                  {(member.username?.[0] ?? "").toUpperCase()}
                </div>
              ))}
              {project.assignedUsers.length > 4 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{project.assignedUsers.length - 4}
                </span>
              )}
            </div>
           
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t flex items-center text-xs text-muted-foreground">
        <Calendar className="mr-1 h-3 w-3" /> 
        Created {new Date(project.createdAt).toLocaleDateString()}
      </CardFooter>
    </Card>
  );
};