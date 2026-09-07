import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext";
import { inputStyle } from "../components/FilterBar";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Username aur password dono daalo.");
      return;
    }
    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate("/total-stock", { replace: true });
    } catch (err) {
      setError(
        err?.response?.status === 401
          ? "Username ya password galat hai."
          : "Login nahi ho paya — server check karo."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--odoo-bg)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 340,
          background: "var(--odoo-surface)",
          border: "1px solid var(--odoo-border)",
          borderRadius: 10,
          padding: "32px 28px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: "var(--odoo-purple)",
            margin: "0 auto 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          S
        </div>
        <div style={{ textAlign: "center", fontSize: 17, fontWeight: 600, marginBottom: 2 }}>
          SWAG Dashboard
        </div>
        <div
          style={{
            textAlign: "center",
            fontSize: 12.5,
            color: "var(--odoo-text-muted)",
            marginBottom: 22,
          }}
        >
          Apne Odoo account se login karo
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Email</div>
          <input
            style={inputStyle}
            type="email"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="you@swag.com.sa"
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Password</div>
          <input
            style={inputStyle}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div
            style={{
              background: "#FDECEC",
              color: "var(--odoo-danger)",
              fontSize: 12.5,
              padding: "8px 10px",
              borderRadius: 6,
              marginBottom: 14,
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            height: 38,
            background: "var(--odoo-purple)",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 13.5,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
