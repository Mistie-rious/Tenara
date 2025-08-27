import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import LoginPage from "../auth/login";
import Register from "../auth/register";
import DashboardPage from "../dashboard";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage  />} />
      <Route path="/register" element={<Register/>} />

      {/* Protected routes */}
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
