import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext";

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
      setError("Fill in both fields.");
      return;
    }
    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate("/product-comparison", { replace: true });
    } catch (err) {
      setError(err?.response?.status === 401 ? "Wrong email or password." : "Connection error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "#F5F7FA",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Radial glow blobs */}
      <div style={glowStyle(-150, -150, undefined, undefined, "rgba(74,172,180,0.12)")} />
      <div style={glowStyle(undefined, undefined, -100, -100, "rgba(212,168,75,0.07)", 400)} />
      {/* Grid lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(74,172,180,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(74,172,180,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles */}
      <Particle top="8%" left="6%" anim="float1 7s ease-in-out infinite">
        <DiamondIcon size={48} stroke="#4AACB4" />
      </Particle>
      <Particle top="15%" right="8%" anim="float2 9s ease-in-out infinite">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="4" width="24" height="24" stroke="#D4A84B" strokeWidth="0.8" fill="none" opacity="0.6" />
        </svg>
      </Particle>
      <Particle top="60%" left="4%" anim="float3 8s ease-in-out infinite">
        <DiamondIcon size={24} stroke="#4AACB4" fill="rgba(74,172,180,0.08)" />
      </Particle>
      <Particle bottom="20%" right="5%" anim="float4 10s ease-in-out infinite">
        <DiamondDots size={40} />
      </Particle>
      <Particle top="40%" right="3%" anim="float5 6s ease-in-out infinite">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="16" height="16" stroke="#D4A84B" strokeWidth="0.8" fill="none" opacity="0.5" transform="rotate(45 10 10)" />
        </svg>
      </Particle>
      <Particle bottom="35%" left="8%" anim="float2 11s ease-in-out infinite">
        <DiamondIcon size={28} stroke="#4AACB4" opacity={0.5} />
      </Particle>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
        <LogoRing />
        <div
          style={{
            fontSize: 48,
            fontWeight: 300,
            color: "#111827",
            letterSpacing: 8,
            marginBottom: 6,
            textShadow: "0 0 40px rgba(74,172,180,0.3)",
          }}
        >
          SWAG
        </div>
        <div style={{ fontSize: 9, letterSpacing: 5, textTransform: "uppercase", color: "var(--odoo-purple)", marginBottom: 32 }}>
          Product Intelligence · 5 Systems
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            width: 360,
            maxWidth: "90vw",
            background: "#F9FAFB",
            border: "1.5px solid var(--odoo-purple)",
            borderRadius: 16,
            padding: 28,
            boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Email</div>
            <input
              style={fieldStyle}
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
              style={fieldStyle}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{ background: "#FDECEC", color: "var(--odoo-danger)", fontSize: 12.5, padding: "8px 10px", borderRadius: 6, marginBottom: 14 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: 40,
              background: "var(--odoo-purple)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 13.5,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#6B7280" }}>
          SWAG Dashboard · 2026 · Powered by Odoo
        </div>
      </div>

      <style>{`
        @keyframes float1 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-18px) rotate(5deg); } }
        @keyframes float2 { 0%,100% { transform: translateY(0) rotate(45deg); } 50% { transform: translateY(-24px) rotate(50deg); } }
        @keyframes float3 { 0%,100% { transform: translateY(0) rotate(20deg); } 50% { transform: translateY(-12px) rotate(15deg); } }
        @keyframes float4 { 0%,100% { transform: translateY(0) rotate(70deg); } 60% { transform: translateY(-20px) rotate(65deg); } }
        @keyframes float5 { 0%,100% { transform: translateY(0) rotate(30deg); } 40% { transform: translateY(-16px) rotate(35deg); } }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 40px rgba(74,172,180,0.15), 0 0 80px rgba(74,172,180,0.06); }
          50% { box-shadow: 0 0 60px rgba(74,172,180,0.3), 0 0 120px rgba(74,172,180,0.12); }
        }
        @keyframes logoSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes dotPulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.7; } }
      `}</style>
    </div>
  );
}

function LogoRing() {
  return (
    <div style={{ position: "relative", width: 100, height: 100, marginBottom: 28 }}>
      <div
        style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: "1px solid rgba(26,122,130,0.3)",
          animation: "glowPulse 3s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute", inset: 10, borderRadius: "50%",
          border: "1px dashed rgba(74,172,180,0.25)",
          animation: "logoSpin 20s linear infinite",
        }}
      />
      {["t", "r", "b", "l"].map((pos, i) => (
        <span
          key={pos}
          style={{
            position: "absolute", width: 6, height: 6, borderRadius: "50%", background: "#D4A84B",
            animation: `dotPulse 2s ease-in-out infinite`, animationDelay: `${i * 0.5}s`,
            ...(pos === "t" && { top: 3, left: "50%", transform: "translateX(-50%)" }),
            ...(pos === "r" && { right: 3, top: "50%", transform: "translateY(-50%)" }),
            ...(pos === "b" && { bottom: 3, left: "50%", transform: "translateX(-50%)" }),
            ...(pos === "l" && { left: 3, top: "50%", transform: "translateY(-50%)" }),
          }}
        />
      ))}
      <div style={{ position: "absolute", inset: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path d="M22 4 L38 22 L22 40 L6 22 Z" stroke="#4AACB4" strokeWidth="1.2" fill="none" />
          <path d="M22 10 L32 22 L22 34 L12 22 Z" stroke="#4AACB4" strokeWidth="0.7" fill="none" opacity="0.5" />
          <path d="M22 15 L28 22 L22 29 L16 22 Z" fill="#4AACB4" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

function DiamondIcon({ size = 40, stroke = "#4AACB4", fill = "none", opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ opacity }}>
      <path d="M24 4 L44 24 L24 44 L4 24 Z" stroke={stroke} strokeWidth="0.8" fill={fill} />
      <path d="M24 12 L36 24 L24 36 L12 24 Z" stroke={stroke} strokeWidth="0.5" fill="none" opacity="0.5" />
    </svg>
  );
}

function DiamondDots({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 3 L37 20 L20 37 L3 20 Z" stroke="#4AACB4" strokeWidth="0.6" fill="none" />
      <circle cx="20" cy="3" r="1.5" fill="#D4A84B" />
      <circle cx="37" cy="20" r="1.5" fill="#D4A84B" />
      <circle cx="20" cy="37" r="1.5" fill="#D4A84B" />
      <circle cx="3" cy="20" r="1.5" fill="#D4A84B" />
    </svg>
  );
}

function Particle({ top, left, right, bottom, anim, children }) {
  return (
    <div style={{ position: "absolute", top, left, right, bottom, animation: anim, opacity: 0.12 }}>
      {children}
    </div>
  );
}

function glowStyle(left, top, right, bottom, color, size = 600) {
  return {
    position: "absolute",
    width: size,
    height: size,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    left, top, right, bottom,
    pointerEvents: "none",
  };
}

const fieldStyle = {
  width: "100%",
  height: 38,
  padding: "0 12px",
  border: "1px solid var(--odoo-border-strong)",
  borderRadius: 8,
  fontSize: 13,
  background: "#fff",
};
