import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";

export default function Login() {
  const { login, isAuthenticated } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    navigate("/admin", { replace: true });
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(password);
      navigate(location.state?.from || "/admin", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Incorrect password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <form onSubmit={submit} className="panel" style={{ width: 340, padding: 30 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
          <span style={{ width: 10, height: 10, background: "var(--amber)", display: "inline-block" }} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink)" }}>
            StoreOps
          </span>
        </div>
        <p style={{ color: "var(--ink-faint)", fontSize: 12.5, fontFamily: "var(--font-mono)", marginTop: 0, marginBottom: 22 }}>
          ADMIN ACCESS
        </p>

        {error && <div className="error-banner">{error}</div>}

        <div className="field" style={{ marginBottom: 18 }}>
          <label>Password</label>
          <input
            className="input"
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={busy}>
          {busy ? "Checking…" : "Enter dashboard"}
        </button>
      </form>
    </div>
  );
}
