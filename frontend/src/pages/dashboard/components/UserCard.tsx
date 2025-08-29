import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import React from 'react';
import type { User } from '@/lib/types';

interface UserCardProps {
  user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => (
  <div className="flex border border-gray-200 items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
    <Avatar className="w-8 h-8">
      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-400 to-purple-500 text-white">
        {user.username?.substring(0, 2).toUpperCase() || 'U'}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.username}</p>
      <div className="flex items-center space-x-2">
        <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="text-xs">
          {user.role === 'ADMIN' ? 'Admin' : 'Member'}
        </Badge>
        <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {user.isActive ? 'Online' : 'Offline'}
        </span>
      </div>
    </div>
    <div className="text-xs text-gray-500 dark:text-gray-400">
      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
    </div>
  </div>
);
