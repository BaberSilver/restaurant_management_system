import { useEffect, useState } from "react";
import api from "../lib/api";
import type { EmployeeRecord, InventoryRecord, LeaveRecord, ScheduleRecord } from "../lib/api";

export default function AdminDashboard() {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [inventory, setInventory] = useState<InventoryRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [schedules, setSchedules] = useState<ScheduleRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const [employeesResponse, inventoryResponse, leavesResponse, schedulesResponse] = await Promise.all([
          api.get<EmployeeRecord[]>("/employees"),
          api.get<InventoryRecord[]>("/inventory"),
          api.get<LeaveRecord[]>("/leaves"),
          api.get<ScheduleRecord[]>("/schedules"),
        ]);

        if (alive) {
          setEmployees(employeesResponse.data);
          setInventory(inventoryResponse.data);
          setLeaves(leavesResponse.data);
          setSchedules(schedulesResponse.data);
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

  if (loading) {
    return <div className="card">Loading admin overview...</div>;
  }

  const lowStock = inventory.filter((item) => item.quantity <= item.minimumStock);
  const pendingLeaves = leaves.filter((leave) => leave.status === "PENDING");

  return (
    <div className="page-grid">
      <section className="grid-3 page-grid">
        <div className="card stat"><span className="meta">Employees</span><strong className="stat-value">{employees.length}</strong><span>Active staff directory</span></div>
        <div className="card stat"><span className="meta">Low stock</span><strong className="stat-value">{lowStock.length}</strong><span>Items to reorder</span></div>
        <div className="card stat"><span className="meta">Pending leave</span><strong className="stat-value">{pendingLeaves.length}</strong><span>Requests awaiting review</span></div>
      </section>

      <section className="split">
        <div className="card">
          <div className="card-header">
            <div><p className="eyebrow">Operations</p><h2>Management tasks</h2></div>
          </div>
          <div className="stack">
            {[
              "Add or update employees",
              "Maintain inventory counts",
              "Review leave requests",
              "Track schedules across dates",
            ].map((item) => <div className="timeline-item" key={item}><span>{item}</span><span className="badge neutral">Ready</span></div>)}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div><p className="eyebrow">Shift health</p><h2>Scheduled work</h2></div>
          </div>
          <div className="stack">
            <div className="timeline-item"><span>Total schedules</span><strong>{schedules.length}</strong></div>
            <div className="timeline-item"><span>Today’s shifts</span><strong>{schedules.filter((schedule) => schedule.workDate.slice(0, 10) === new Date().toISOString().slice(0, 10)).length}</strong></div>
            <div className="timeline-item"><span>Low stock alert rate</span><strong>{inventory.length ? Math.round((lowStock.length / inventory.length) * 100) : 0}%</strong></div>
          </div>
        </div>
      </section>
    </div>
  );
}