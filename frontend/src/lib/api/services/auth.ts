import {apiClient} from "../apiClient";

export interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
    access_token: string;
    user: {
      id: string;
      email: string;
      role: string;
      [key: string]: any;
    };
  }

export interface CreateTenantData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  const res = await apiClient.post("/auth/login", data);
  return res.data as LoginResponse;
};

export const createTenant = async (data: CreateTenantData) => {
  const res = await apiClient.post("/auth/create-tenant", data);
  return res.data;
};
