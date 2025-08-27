export interface Project {
    id: string;
    name: string;
    description?: string;
    status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | string;
    createdAt: string;
  }
  