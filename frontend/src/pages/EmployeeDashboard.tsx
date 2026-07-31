import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import type { DashboardResponse } from "../lib/api";

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: value.includes("T") ? "2-digit" : undefined,
    minute: value.includes("T") ? "2-digit" : undefined,
  }).format(new Date(value));
}

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function loadDashboard() {
      try {
        const response = await api.get<DashboardResponse>("/dashboard");
        if (alive) {
          setData(response.data);
        }
      } catch {
        if (alive) {
          setError("Unable to load dashboard data.");
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return <div className="card">Loading dashboard...</div>;
  }

  if (error || !data) {
    return <div className="card empty-state">{error ?? "No dashboard data available."}</div>;
  }

  const isChef = user?.role.roleName === "CHEF";
  const isWaiter = user?.role.roleName === "WAITER";
  const isAdmin = user?.role.roleName === "ADMINISTRATOR";

  return (
    <div className="page-grid">
      <section className="split">
        <div className="card">
          <div className="card-header">
            <div>
              <p className="eyebrow">My profile</p>
              <h2>{data.profile.firstName} {data.profile.lastName}</h2>
            </div>
            <span className="badge neutral">{data.role}</span>
          </div>

          <div className="stack">
            <div><span className="meta">Email</span><div>{data.profile.email}</div></div>
            <div><span className="meta">Phone</span><div>{data.profile.phoneNumber ?? "Not provided"}</div></div>
            <div><span className="meta">Hire date</span><div>{formatDate(data.profile.hireDate)}</div></div>
            <div><span className="meta">Employment status</span><div>{data.profile.employmentStatus}</div></div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Alerts</p>
              <h2>What needs attention</h2>
            </div>
          </div>

          <div className="stack">
            {data.alerts.length ? data.alerts.map((alert) => (
              <div key={alert} className="timeline-item">
                <span>{alert}</span>
                <span className="badge warning">Info</span>
              </div>
            )) : <div className="empty-state">No alerts right now.</div>}
          </div>
        </div>
      </section>

      {!isAdmin ? (
        <section className="grid-3 page-grid">
          <div className="card stat">
            <span className="meta">Today</span>
            <strong className="stat-value">{data.schedule.today ? "On shift" : "Off"}</strong>
            <span>{data.schedule.today ? `${formatDate(data.schedule.today.shiftStart)} - ${formatDate(data.schedule.today.shiftEnd)}` : "No shift scheduled today"}</span>
          </div>
          <div className="card stat">
            <span className="meta">Coworkers on duty</span>
            <strong className="stat-value">{data.schedule.coworkersOnDuty.length}</strong>
            <span>People sharing this shift</span>
          </div>
          <div className="card stat">
            <span className="meta">Leave requests</span>
            <strong className="stat-value">{data.leaveRequests.length}</strong>
            <span>Your submitted leave items</span>
          </div>
        </section>
      ) : null}

      {isAdmin ? (
        <section className="card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Admin view</p>
              <h2>Operations overview</h2>
            </div>
          </div>
          <div className="empty-state">You manage staff, inventory, schedules, and approvals from the admin tools rather than following a personal shift.</div>
        </section>
      ) : null}

      {isChef ? (
        <section className="card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Kitchen focus</p>
              <h2>Inventory items you should monitor</h2>
            </div>
          </div>
          <div className="empty-state">Use the inventory view for ingredient levels, low-stock alerts, and replenishment planning.</div>
        </section>
      ) : null}

      {isWaiter ? (
        <section className="card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Service focus</p>
              <h2>Room and floor priorities</h2>
            </div>
          </div>
          <div className="empty-state">Your daily focus is your shift, coworkers, and any service requests from the floor.</div>
        </section>
      ) : null}

      {!isAdmin ? (
        <>
          <section className="split">
            <div className="card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Schedule context</p>
                  <h2>Previous, current, next</h2>
                </div>
              </div>

              <div className="timeline">
                {[
                  { label: "Previous", item: data.schedule.previous },
                  { label: "Current", item: data.schedule.today },
                  { label: "Next", item: data.schedule.next },
                ].map(({ label, item }) => (
                  <div className="timeline-item" key={label}>
                    <div>
                      <strong>{label}</strong>
                      <div className="meta">
                        {item ? `${formatDate(item.workDate)} • ${formatDate(item.shiftStart)} - ${formatDate(item.shiftEnd)}` : "No schedule data"}
                      </div>
                    </div>
                    <span className={`badge ${item ? "success" : "neutral"}`}>{item ? item.shiftStatus : "None"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Coworkers</p>
                  <h2>Working alongside you</h2>
                </div>
              </div>

              <div className="stack">
                {data.schedule.coworkersOnDuty.length ? data.schedule.coworkersOnDuty.map((shift) => (
                  <div key={shift.scheduleId} className="timeline-item">
                    <div>
                      <strong>{shift.employee?.firstName} {shift.employee?.lastName}</strong>
                      <div className="meta">{formatDate(shift.shiftStart)} - {formatDate(shift.shiftEnd)}</div>
                    </div>
                    <span className="badge neutral">{shift.shiftStatus}</span>
                  </div>
                )) : <div className="empty-state">No coworkers are scheduled with you today.</div>}
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <div>
                <p className="eyebrow">Leave requests</p>
                <h2>Submitted requests</h2>
              </div>
            </div>

            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Dates</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.leaveRequests.length ? data.leaveRequests.map((leave) => (
                    <tr key={leave.leaveRequestId}>
                      <td>{formatDate(leave.startDate)} to {formatDate(leave.endDate)}</td>
                      <td>{leave.reason}</td>
                      <td><span className={`badge ${leave.status === "APPROVED" ? "success" : leave.status === "REJECTED" ? "danger" : "warning"}`}>{leave.status}</span></td>
                    </tr>
                  )) : (
                    <tr><td colSpan={3}><div className="empty-state">You have no leave requests yet.</div></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}