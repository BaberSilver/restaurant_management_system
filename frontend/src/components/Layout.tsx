import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-shell">
        <Navbar />
        <main className="page-frame">
          <Outlet />
        </main>
      </div>
    </div>
  );
}