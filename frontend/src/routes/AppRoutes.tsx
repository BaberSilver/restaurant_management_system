import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../pages/AdminDashboard";
import Categories from "../pages/Categories";
import Employees from "../pages/Employees";
import EmployeeDashboard from "../pages/EmployeeDashboard";
import Inventory from "../pages/Inventory";
import LeaveRequest from "../pages/LeaveRequest";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Schedule from "../pages/Schedule";
import RoleProtectedRoute from "../components/RoleProtectedRoute";

export default function AppRoutes() {
    return(
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>

          <Route element={<Layout />}>

              <Route
                  path="/dashboard"
                  element={<EmployeeDashboard />}
              />

              <Route
                  path="/schedule"
                  element={<Schedule />}
              />

              <Route
                  path="/inventory"
                  element={<Inventory />}
              />

              <Route
                  path="/leave"
                  element={<LeaveRequest />}
              />

              {/* Manager + Admin */}

              <Route
                  element={
                      <RoleProtectedRoute
                          allowedRoles={[
                              "MANAGER",
                              "ADMINISTRATOR",
                          ]}
                      />
                  }
              >

                  <Route
                      path="/employees"
                      element={<Employees />}
                  />

                  <Route
                      path="/categories"
                      element={<Categories />}
                  />

              </Route>

              {/* Admin only */}

              <Route
                  element={
                      <RoleProtectedRoute
                          allowedRoles={[
                              "ADMINISTRATOR",
                          ]}
                      />
                  }
              >

                  <Route
                      path="/admin"
                      element={<AdminDashboard />}
                  />

              </Route>

          </Route>

      </Route>

      <Route
          path="*"
          element={<NotFound />}
      />

  </Routes>
    );
}