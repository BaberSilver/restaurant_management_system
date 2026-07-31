import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const titles: Record<string, string> = {
  "/dashboard": "Employee Dashboard",
  "/schedule": "Schedule",
  "/inventory": "Inventory",
  "/leave": "Leave Requests",
  "/employees": "Employees",
  "/admin": "Admin Overview",
  "/categories": "Categories",
};

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const title = titles[location.pathname] ?? "Restaurant Management";

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Restaurant Management System</p>
        <h2>{title}</h2>
      </div>
      <div className="topbar-actions">
        <div className="pill neutral">
          {user?.employee.firstName} {user?.employee.lastName} • {user?.role.roleName}
        </div>
        <button type="button" className="button ghost" onClick={logout}>
          Sign out
        </button>
      </div>
    </header>
  );
}