import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import LoginPage from "../auth/login";
import Register from "../auth/register";
import DashboardPage from "../dashboard";
import  ProjectsPage  from "../projects";
import  UsersPage  from "../users";
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage  />} />
      <Route path="/register" element={<Register/>} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
       <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <ProjectsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UsersPage/>
          </ProtectedRoute>
        }
      />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
