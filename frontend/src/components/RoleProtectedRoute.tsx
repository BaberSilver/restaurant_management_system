import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
    allowedRoles: string[];
}

export default function RoleProtectedRoute({
    allowedRoles,
}: Props) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role.roleName)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}