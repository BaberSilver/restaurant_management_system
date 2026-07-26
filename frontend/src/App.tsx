import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Employees from "./pages/Employees";
import Inventory from "./pages/Inventory";
import Schedule from "./pages/Schedule";
import LeaveRequests from "./pages/LeaveRequests";
import NotFound from "./pages/NotFound";

function App() {
    return (
        <Routes>

            {/* Public */}

            <Route
                path="/login"
                element={<Login />}
            />

            {/* Protected */}

            <Route element={<Layout />}>

                <Route
                    path="/"
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
                    path="/employees"
                    element={<Employees />}
                />

                <Route
                    path="/leave"
                    element={<LeaveRequests />}
                />

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

            </Route>

            <Route
                path="*"
                element={<NotFound />}
            />

        </Routes>
    );
}

export default App;