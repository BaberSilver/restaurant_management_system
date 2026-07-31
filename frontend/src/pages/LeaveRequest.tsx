import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import type { FormEvent } from "react";
import type { LeaveRecord } from "../lib/api";

export default function LeaveRequest() {
  const { user } = useAuth();
  const [myLeaves, setMyLeaves] = useState<LeaveRecord[]>([]);
  const [queueLeaves, setQueueLeaves] = useState<LeaveRecord[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const requests = [api.get<LeaveRecord[]>("/leaves/me")];

        if (user?.role.roleName === "ADMINISTRATOR" || user?.role.roleName === "MANAGER") {
          requests.push(api.get<LeaveRecord[]>("/leaves"));
        }

        const [myResponse, queueResponse] = await Promise.all(requests);

        if (alive) {
          setMyLeaves(myResponse.data);
          setQueueLeaves(queueResponse?.data ?? []);
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await api.post<LeaveRecord>("/leaves", { startDate, endDate, reason });
    setMyLeaves((current) => [response.data, ...current]);
    setStartDate("");
    setEndDate("");
    setReason("");
  }

  async function updateStatus(id: number, status: "APPROVED" | "REJECTED") {
    const response = await api.put<LeaveRecord>(`/leaves/${id}`, { status });
    setQueueLeaves((current) => current.map((leave) => (leave.leaveRequestId === id ? response.data : leave)));
  }

  const canApprove = user?.role.roleName === "ADMINISTRATOR" || user?.role.roleName === "MANAGER";
  const isAdmin = user?.role.roleName === "ADMINISTRATOR";

  if (loading) {
    return <div className="card">Loading leave requests...</div>;
  }

  return (
    <div className="page-grid">
      <section className="split">
        <form className="card" onSubmit={handleSubmit}>
          <div className="card-header">
            <div>
              <p className="eyebrow">Leave request</p>
              <h2>Submit time off</h2>
            </div>
          </div>

          <div className="form-grid">
            {!isAdmin ? (
              <>
                <label>
                  <span className="meta">Start date</span>
                  <input className="input" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required />
                </label>
                <label>
                  <span className="meta">End date</span>
                  <input className="input" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} required />
                </label>
                <label>
                  <span className="meta">Reason</span>
                  <textarea className="textarea" rows={4} value={reason} onChange={(event) => setReason(event.target.value)} required />
                </label>
                <button className="button primary" type="submit">Submit request</button>
              </>
            ) : (
              <div className="empty-state">Administrators manage requests rather than submitting them.</div>
            )}
          </div>
        </form>

        <div className="card">
          <div className="card-header">
            <div>
              <p className="eyebrow">My requests</p>
              <h2>Review status</h2>
            </div>
          </div>

          <div className="stack">
            {myLeaves.length ? myLeaves.map((leave) => (
              <div className="timeline-item" key={leave.leaveRequestId}>
                <div>
                  <strong>{leave.startDate.slice(0, 10)} to {leave.endDate.slice(0, 10)}</strong>
                  <div className="meta">{leave.reason}</div>
                </div>
                <span className={`badge ${leave.status === "APPROVED" ? "success" : leave.status === "REJECTED" ? "danger" : "warning"}`}>{leave.status}</span>
              </div>
            )) : <div className="empty-state">No leave requests yet.</div>}
          </div>
        </div>
      </section>

      {canApprove ? (
        <section className="card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Approval queue</p>
              <h2>Manager review</h2>
            </div>
          </div>

          <div className="stack">
            {queueLeaves.filter((leave) => leave.status === "PENDING").length ? queueLeaves.filter((leave) => leave.status === "PENDING").map((leave) => (
              <div className="timeline-item" key={leave.leaveRequestId}>
                <div>
                  <strong>{leave.employee?.firstName} {leave.employee?.lastName}</strong>
                  <div className="meta">{leave.reason}</div>
                </div>
                <div className="topbar-actions">
                  <button className="button secondary" type="button" onClick={() => updateStatus(leave.leaveRequestId, "APPROVED")}>Approve</button>
                  <button className="button ghost" type="button" onClick={() => updateStatus(leave.leaveRequestId, "REJECTED")}>Reject</button>
                </div>
              </div>
            )) : <div className="empty-state">No pending requests.</div>}
          </div>
        </section>
      ) : null}
    </div>
  );
}