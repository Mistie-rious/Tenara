import { apiClient } from "../apiClient";
import type { User, CreateUserPayload } from "../../types/project";


  export const  getUsers = async(): Promise<User[]> => {
    const res = await apiClient.get("/users/findAll");
    return res.data.data;
  }

  export const createUser = async(payload: CreateUserPayload): Promise<User> => {
    const res = await apiClient.post("/users/create", payload);
    return res.data.data;
  }

  export const getProfile = async(): Promise<User> => {
    const res = await apiClient.get("/users/me");
    return res.data.data;
  }

