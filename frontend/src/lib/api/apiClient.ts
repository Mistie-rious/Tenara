
import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL;


export const apiClient = axios.create({
  baseURL: baseURL, 
  headers: {
    "Content-Type": "application/json",
  },
});


apiClient.interceptors.request.use((config: any) => {
  const token = sessionStorage.getItem("token");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
