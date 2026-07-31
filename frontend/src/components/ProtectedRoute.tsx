import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { RoleName } from "../lib/api";

interface ProtectedRouteProps {
  allowedRoles?: RoleName[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { token, user, isReady } = useAuth();
  const location = useLocation();

  if (!isReady) {
    return <div className="page-frame">Loading...</div>;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role.roleName)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}