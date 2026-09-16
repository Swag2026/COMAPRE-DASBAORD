import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../api/AuthContext";
import { useAppState } from "../api/AppStateContext";
import { useToast } from "../api/ToastContext";
import Spinner from "./Spinner";

const PAGES = [
  { to: "/product-comparison", label: "Product Comparison" },
  { to: "/reorder", label: "Reorder Suggestions" },
  { to: "/transfers", label: "Pending Transfers" },
  { to: "/season-comparison", label: "Season Comparison" },
];

export default function Sidebar() {
  const { username, logout } = useAuth();
  const {
    triggerReload,
    lowStockThreshold, setLowStockThreshold,
    exactMatch, setExactMatch,
    lastRun,
  } = useAppState();
  const [reloading, setReloading] = useState(false);
  const { showToast } = useToast();

  async function handleReload() {
    setReloading(true);
    try {
      await triggerReload();
      showToast("Data cache cleared, refetching…", "info");
    } finally {
      setReloading(false);
    }
  }

  return (
    <div
      style={{
        width: 240,
        flexShrink: 0,
        background: "var(--odoo-surface)",
        borderRight: "1px solid var(--odoo-border)",
        display: "flex",
        flexDirection: "column",
        padding: "16px 14px",
        gap: 14,
        height: "calc(100vh - var(--odoo-topbar-h))",
        position: "sticky",
        top: "var(--odoo-topbar-h)",
        overflowY: "auto",
      }}
    >
      <div style={{ paddingBottom: 12, borderBottom: "1px solid var(--odoo-border)" }}>
        <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--odoo-text-faint)", fontWeight: 700, marginBottom: 4 }}>
          Signed in as
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--odoo-text)", wordBreak: "break-all" }}>
          {username}
        </div>
      </div>

      <button onClick={logout} style={sidebarBtnStyle()}>
        Logout →
      </button>
      <button onClick={handleReload} disabled={reloading} style={sidebarBtnStyle("solid")}>
        {reloading ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Spinner size={13} /> Reloading…
          </span>
        ) : (
          "⟳ Reload Data"
        )}
      </button>

      <Divider />

      <div>
        <div style={labelStyle}>Page</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {PAGES.map((p) => (
            <NavLink
              key={p.to}
              to={p.to}
              style={({ isActive }) => ({
                display: "block",
                padding: "9px 12px",
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 600,
                textDecoration: "none",
                background: isActive ? "var(--odoo-purple)" : "transparent",
                color: isActive ? "#fff" : "var(--odoo-text)",
                border: isActive ? "none" : "1px solid var(--odoo-border-strong)",
              })}
            >
              {p.label}
            </NavLink>
          ))}
        </div>
      </div>

      <Divider />

      <div
        style={{
          background: "rgba(26,122,130,0.08)",
          border: "1.5px solid rgba(26,122,130,0.25)",
          borderRadius: 8,
          padding: "10px 12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9.5, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--odoo-purple)", marginBottom: 3 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--odoo-success)" }} />
          App Active
        </div>
        <div style={{ fontSize: 10, color: "var(--odoo-text-faint)" }}>
          Auto-refresh keeps app awake
        </div>
      </div>

      <Divider />

      <div>
        <div style={labelStyle}>Search Mode</div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={exactMatch}
            onChange={(e) => setExactMatch(e.target.checked)}
          />
          Exact match
        </label>
      </div>

      <Divider />

      <div>
        <div style={labelStyle}>Low Stock Alert</div>
        <div style={{ fontSize: 11, color: "var(--odoo-text-muted)", marginBottom: 6 }}>
          Threshold (qty ≤)
        </div>
        <input
          type="number"
          min={0}
          value={lowStockThreshold}
          onChange={(e) => setLowStockThreshold(Number(e.target.value) || 0)}
          style={{
            width: "100%",
            height: 32,
            padding: "0 10px",
            border: "1px solid var(--odoo-border-strong)",
            borderRadius: 6,
            fontSize: 13,
          }}
        />
      </div>

      {lastRun && (
        <>
          <Divider />
          <div>
            <div style={labelStyle}>Last Run</div>
            <div style={{ fontSize: 11, color: "var(--odoo-text-muted)" }}>{lastRun}</div>
          </div>
        </>
      )}

      <div style={{ flex: 1 }} />
    </div>
  );
}

function Divider() {
  return <div style={{ borderTop: "1px solid var(--odoo-border)" }} />;
}

const labelStyle = {
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: "var(--odoo-purple)",
  marginBottom: 8,
};

function sidebarBtnStyle(variant) {
  if (variant === "solid") {
    return {
      height: 36,
      border: "1px solid var(--odoo-purple)",
      background: "var(--odoo-purple-pale)",
      color: "var(--odoo-purple)",
      borderRadius: 8,
      fontSize: 12.5,
      fontWeight: 600,
    };
  }
  return {
    height: 34,
    border: "1px solid var(--odoo-border-strong)",
    background: "#fff",
    color: "var(--odoo-text)",
    borderRadius: 8,
    fontSize: 12.5,
    fontWeight: 600,
  };
}
