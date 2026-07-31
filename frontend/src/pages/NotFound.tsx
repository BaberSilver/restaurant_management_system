import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="hero-layout">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">404</p>
          <h1>We could not find that page.</h1>
          <p className="subtle" style={{ marginTop: 16 }}>
            Return to the dashboard and continue from a known route.
          </p>
        </div>
      </section>
      <section className="login-panel surface">
        <div className="card login-card">
          <h2>Back to work</h2>
          <p className="subtle" style={{ margin: "12px 0 20px" }}>Use the dashboard or log in again.</p>
          <Link className="button primary" to="/dashboard" style={{ display: "inline-flex", textDecoration: "none" }}>Go to dashboard</Link>
        </div>
      </section>
    </div>
  );
}