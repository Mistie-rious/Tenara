import { Badge } from '@/components/ui/badge';
import React from 'react';
import { FolderOpen } from 'lucide-react';
import type { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  getStatusColor: (status: string) => string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, getStatusColor }) => (
  <div className="flex items-center border border-gray-200 justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
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
        </div>
      </div>
    </div>
  </div>
);
