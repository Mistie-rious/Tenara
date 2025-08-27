import { apiClient } from "../apiClient";
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
}

export const usersService = {
  async getUsers(): Promise<User[]> {
    const res = await apiClient.get("/users/findAll");
    return res.data;
  },

  async createUser(payload: CreateUserPayload): Promise<User> {
    const res = await apiClient.post("/users/create", payload);
    return res.data;
  },

  async getProfile(): Promise<User> {
    const res = await apiClient.get("/users/me");
    return res.data;
  },
};
