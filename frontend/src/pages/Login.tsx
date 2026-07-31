import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { FormEvent } from "react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(username, password);
      navigate("/dashboard", { replace: true });
    } 
    catch (error) {
      const message = error instanceof Error ? error.message : "Invalid username or password.";
      console.error("Login failed:", error);
      setError(message);
    } 
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="hero-layout">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Restaurant control center</p>
          <h1>Manage shifts, stock, and staff without clutter.</h1>
          <p className="subtle" style={{ marginTop: 16, maxWidth: 540 }}>
            A focused workspace for employees, chefs, and administrators. Fast to learn,
            easy to extend, and ready for a small team.
          </p>
        </div>
      </section>

      <section className="login-panel surface">
        <form className="card login-card" onSubmit={handleSubmit}>
          <div className="stack" style={{ marginBottom: 20 }}>
            <p className="eyebrow">Sign in</p>
            <h2>Use your staff account</h2>
          </div>

          <div className="form-grid">
            <label>
              <span className="meta">Username</span>
              <input
                className="input"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                required
              />
            </label>

            <label>
              <span className="meta">Password</span>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            {error ? <div className="badge danger">{error}</div> : null}

            <button type="submit" className="button primary" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}