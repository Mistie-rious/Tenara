export interface Project {
    id: string;
    name: string;
    description?: string;
    status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | string;
    createdAt: string;
  }
  

  export interface CreateUserPayload {
    name: string;
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
  }

  export interface ITenant {
    id: string
    name: string
    slug: string
  }