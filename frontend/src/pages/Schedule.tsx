import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import type { DashboardResponse, ScheduleRecord } from "../lib/api";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function Schedule() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [shifts, setShifts] = useState<ScheduleRecord[]>([]);
  const [start, setStart] = useState(() => new Date().toISOString().slice(0, 10));
  const [end, setEnd] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 13);
    return date.toISOString().slice(0, 10);
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const [dashboardResponse, rangeResponse] = await Promise.all([
          api.get<DashboardResponse>("/dashboard"),
          api.get<ScheduleRecord[]>(`/schedules/me/range?start=${start}&end=${end}`),
        ]);

        if (alive) {
          setDashboard(dashboardResponse.data);
          setShifts(rangeResponse.data);
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
  }, [start, end]);

  const grouped = useMemo(() => {
    return shifts.reduce<Record<string, ScheduleRecord[]>>((accumulator, shift) => {
      const key = shift.workDate.slice(0, 10);
      accumulator[key] = accumulator[key] ?? [];
      accumulator[key].push(shift);
      return accumulator;
    }, {});
  }, [shifts]);

  if (loading || !dashboard) {
    return <div className="card">Loading schedule...</div>;
  }

  return (
    <div className="page-grid">
      <section className="grid-3 page-grid">
        <div className="card stat">
          <span className="meta">Current shift</span>
          <strong className="stat-value">{dashboard.schedule.today ? dashboard.schedule.today.shiftStatus : "None"}</strong>
          <span>{dashboard.schedule.today ? `${formatTime(dashboard.schedule.today.shiftStart)} - ${formatTime(dashboard.schedule.today.shiftEnd)}` : "No shift today"}</span>
        </div>
        <div className="card stat">
          <span className="meta">Coworkers today</span>
          <strong className="stat-value">{dashboard.schedule.coworkersOnDuty.length}</strong>
          <span>Working the same date</span>
        </div>
        <div className="card stat">
          <span className="meta">Upcoming shifts</span>
          <strong className="stat-value">{shifts.length}</strong>
          <span>Between your selected dates</span>
        </div>
      </section>

      <section className="split">
        <div className="card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Date window</p>
              <h2>Plan ahead</h2>
            </div>
          </div>

          <div className="form-grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            <label>
              <span className="meta">Start</span>
              <input className="input" type="date" value={start} onChange={(event) => setStart(event.target.value)} />
            </label>
            <label>
              <span className="meta">End</span>
              <input className="input" type="date" value={end} onChange={(event) => setEnd(event.target.value)} />
            </label>
          </div>

          <div className="stack" style={{ marginTop: 16 }}>
            <div className="timeline-item">
              <div>
                <strong>Previous shift</strong>
                <div className="meta">{dashboard.schedule.previous ? formatDate(dashboard.schedule.previous.workDate) : "No prior shift"}</div>
              </div>
              <span className="badge neutral">{dashboard.schedule.previous?.shiftStatus ?? "None"}</span>
            </div>
            <div className="timeline-item">
              <div>
                <strong>Next shift</strong>
                <div className="meta">{dashboard.schedule.next ? formatDate(dashboard.schedule.next.workDate) : "No next shift"}</div>
              </div>
              <span className="badge neutral">{dashboard.schedule.next?.shiftStatus ?? "None"}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Shift context</p>
              <h2>Coworkers on duty</h2>
            </div>
          </div>

          <div className="stack">
            {dashboard.schedule.coworkersOnDuty.length ? dashboard.schedule.coworkersOnDuty.map((shift) => (
              <div className="timeline-item" key={shift.scheduleId}>
                <div>
                  <strong>{shift.employee?.firstName} {shift.employee?.lastName}</strong>
                  <div className="meta">{formatTime(shift.shiftStart)} - {formatTime(shift.shiftEnd)}</div>
                </div>
                <span className="badge neutral">{shift.shiftStatus}</span>
              </div>
            )) : <div className="empty-state">No coworker data for this shift.</div>}
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <div>
            <p className="eyebrow">Your schedule</p>
            <h2>Selected date range</h2>
          </div>
        </div>

        <div className="timeline">
          {Object.keys(grouped).length ? Object.entries(grouped).map(([day, dayShifts]) => (
            <div key={day} className="card" style={{ boxShadow: "none", background: "rgba(255,255,255,0.6)" }}>
              <div className="card-header">
                <strong>{formatDate(day)}</strong>
                <span className="badge neutral">{dayShifts.length} shift(s)</span>
              </div>
              <div className="stack">
                {dayShifts.map((shift) => (
                  <div className="timeline-item" key={shift.scheduleId}>
                    <div>
                      <strong>{formatTime(shift.shiftStart)} - {formatTime(shift.shiftEnd)}</strong>
                      <div className="meta">Status: {shift.shiftStatus}</div>
                    </div>
                    <span className="badge success">{shift.employee?.firstName} {shift.employee?.lastName}</span>
                  </div>
                ))}
              </div>
            </div>
          )) : <div className="empty-state">No shifts found in the selected date range.</div>}
        </div>
      </section>
    </div>
  );
}