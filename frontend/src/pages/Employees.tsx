import { useEffect, useState } from "react";
import api from "../lib/api";
import type { EmployeeRecord } from "../lib/api";
import { useAuth } from "../context/AuthContext";


export default function Employees() {
  const { user } = useAuth();

const canManageEmployees =
  user?.role.roleName === "ADMINISTRATOR" ||
  user?.role.roleName === "MANAGER";

const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeRecord | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    hireDate: "",
    employmentStatus: "ACTIVE",
    username: "",
    password: "",
    roleId: "",
  });


  function editEmployee(employee: EmployeeRecord) {
    setEditingEmployee(employee);

    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phoneNumber: employee.phoneNumber ?? "",
      hireDate: employee.hireDate.slice(0, 10),
      employmentStatus: employee.employmentStatus,
      username: employee.user?.username ?? "",
      password: "",
      roleId: String(employee.user?.role.roleId ?? ""),
    });

    setShowForm(true);
  }

  async function saveEmployee() {
    if (editingEmployee) {
      await api.put<EmployeeRecord>(`/employees/${editingEmployee.employeeId}`, formData);
    } else {
      await api.post<EmployeeRecord>("/employees", formData);
    }

    setShowForm(false);
    setEditingEmployee(null);

    const response = await api.get<EmployeeRecord[]>("/employees");
    setItems(response.data);
  }


  const [items, setItems] = useState<EmployeeRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const response = await api.get<EmployeeRecord[]>("/employees");
        if (alive) {
          setItems(response.data);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, []);

  const filtered = items.filter((employee) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return `${employee.firstName} ${employee.lastName} ${employee.email}`.toLowerCase().includes(term);
  });

  if (loading) {
    return <div className="card">Loading employees...</div>;
  }

  return (
    <div className="page-grid">
      <section className="card">
        <div className="toolbar">
          <div>
            <p className="eyebrow">Staff directory</p>
            <h2>Employee management</h2>
          </div>
          <input className="input" style={{ maxWidth: 320 }} placeholder="Search employee" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>

        {canManageEmployees && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingEmployee(null);

                setFormData({
                  firstName: "",
                  lastName: "",
                  email: "",
                  phoneNumber: "",
                  hireDate: "",
                  employmentStatus: "ACTIVE",
                  username: "",
                  password: "",
                  roleId: "",
                });

                setShowForm(true);
              }}
            >
              Add Employee
            </button>
          )}
        </div>


        <div className="table-wrap" style={{ marginTop: 16 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>

                {canManageEmployees && (
                  <th>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length ? filtered.map((employee) => (
                <tr key={employee.employeeId}>
                  <td>{employee.firstName} {employee.lastName}</td>
                  <td>{employee.email}</td>
                  <td>{employee.user?.role.roleName ?? "Unassigned"}</td>
                  <td>
                    <span 
                    className={`badge ${
                      employee.employmentStatus === "ACTIVE" 
                      ? "success" 
                      : "neutral"
                      }`
                      }>{employee.employmentStatus}
                    </span>
                  </td>

                  {canManageEmployees && (
                    <td>
                      <button
                        className="btn btn-secondary"
                        onClick={() => editEmployee(employee)}
                      >
                        Edit
                      </button>
                    </td>
                  )}

                </tr>
              )) : (
                <tr><td colSpan={canManageEmployees ? 5 : 4}><div className="empty-state">No employees found.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showForm && (
        <section className="card" style={{ marginTop: "1.5rem" }}>
          <div className="card-header">
            <div>
              <p className="eyebrow">
                {editingEmployee ? "Update Employee" : "New Employee"}
              </p>

              <h2>
                {editingEmployee ? "Edit Employee" : "Add Employee"}
              </h2>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <input
              className="input"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  firstName: e.target.value,
                })
              }
            />

            <input
              className="input"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lastName: e.target.value,
                })
              }
            />

            <input
              className="input"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
            />

            <input
              className="input"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phoneNumber: e.target.value,
                })
              }
            />

            <input
              className="input"
              type="date"
              value={formData.hireDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hireDate: e.target.value,
                })
              }
            />

            <select
              className="input"
              value={formData.employmentStatus}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  employmentStatus: e.target.value,
                })
              }
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="TERMINATED">TERMINATED</option>
            </select>

            <input
              className="input"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  username: e.target.value,
                })
              }
            />

            {!editingEmployee && (
              <input
                className="input"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
              />
            )}

            <input
              className="input"
              type="number"
              placeholder="Role ID"
              value={formData.roleId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  roleId: e.target.value,
                })
              }
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "1.5rem",
            }}
          >
            <button
              className="btn btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={saveEmployee}
            >
              {editingEmployee ? "Update Employee" : "Add Employee"}
            </button>
          </div>
        </section>
      )}

    </div>
  );
}