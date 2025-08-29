import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, onClick }) => (
  <Card
    className="hover:shadow-lg transition-shadow cursor-pointer"
    onClick={onClick}
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-400">{title}</CardTitle>
      <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
    </CardHeader>
    <CardContent className="pb-3">
      <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
    </CardContent>
  </Card>
);
