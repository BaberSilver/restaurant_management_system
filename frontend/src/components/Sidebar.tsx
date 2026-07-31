import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const baseLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/schedule", label: "Schedule" },
  { to: "/leave", label: "Leave" },
];

const chefLinks = [
  { to: "/inventory", label: "Inventory" },
];

const adminLinks = [
  { to: "/employees", label: "Employees" },
  { to: "/admin", label: "Admin" },
  { to: "/categories", label: "Categories" },
];

export default function Sidebar() {
  const { user } = useAuth();
  const isAdminOrManager = user?.role.roleName === "ADMINISTRATOR" || user?.role.roleName === "MANAGER";
  const isChef = user?.role.roleName === "CHEF";

  const links = isAdminOrManager
    ? [...baseLinks, ...chefLinks, ...adminLinks]
    : isChef
      ? [...baseLinks, ...chefLinks]
      : baseLinks;

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true" />
        <div className="brand-copy">
          <strong>KitchenOS</strong>
          <small>Simple operations, clear control</small>
        </div>
      </div>

      <nav>
        <ul className="nav-list">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                <span>{link.label}</span>
                <span className="meta">Open</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}