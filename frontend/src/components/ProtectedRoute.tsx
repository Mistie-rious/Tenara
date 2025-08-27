// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

 const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = useAuthStore((state) => state.token);
  console.log("Token exists?", !!token, "Token value:", token);

  return token ? <>{children}</> : <Navigate to="/login" replace />;
};


export default ProtectedRoute;
