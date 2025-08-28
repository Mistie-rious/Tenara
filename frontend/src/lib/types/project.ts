export interface Project {
    id: string;
    name: string;
    description?: string;
    status: 'INACTIVE' | 'COMPLETED' | 'ARCHIVED' | 'ONGOING' | string;
    createdAt: string;
    assignedUsers?: AssignedUser[];
  }
  
  export interface AssignedUser {
    id: string;
    username?: string;
    email: string;
    role: "ADMIN" | "USER" | string;
  }

  export interface CreateUserPayload {
    username: string;
    email: string;
    password: string;
  }
  
  export interface User {
    id: string;
    name?: string;
    username?: string;
    email: string;
    role: "ADMIN" | "USER" | string;
    isActive: boolean;
    createdAt: string;
    lastLogin?: string;
    tenant: ITenant,
    projects?: Project[]
  }

  export interface ITenant {
    id: string
    name: string
    slug: string
  }