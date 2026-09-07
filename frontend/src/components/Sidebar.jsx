import { NavLink } from "react-router-dom";
import { useAuth } from "../api/AuthContext";
import { useAppState } from "../api/AppStateContext";

const PAGES = [
  { to: "/total-stock", label: "Total Stock" },
  { to: "/branch-stock", label: "Branch Stock" },
  { to: "/reorder", label: "Reorder Suggestions" },
  { to: "/transfers", label: "Pending Transfers" },
  { to: "/season-comparison", label: "Season Comparison" },
];

export default function Sidebar() {
  const { username, logout } = useAuth();
  const { triggerReload, lowStockThreshold, setLowStockThreshold } = useAppState();

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
        gap: 16,
        height: "100vh",
        position: "sticky",
        top: 0,
        overflowY: "auto",
      }}
    >
      <div style={{ fontSize: 11, color: "var(--odoo-text-muted)", wordBreak: "break-all" }}>
        {username}
      </div>

      <button onClick={logout} style={sidebarBtnStyle()}>
        Logout →
      </button>

      <button onClick={triggerReload} style={sidebarBtnStyle("solid")}>
        ⟳ Reload data
      </button>

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

      <div style={{ flex: 1 }} />

      <div
        style={{
          background: "#E9F7EC",
          border: "1px solid #BFE5C6",
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: 11.5,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, color: "var(--odoo-success)" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--odoo-success)" }} />
          App active
        </div>
        <div style={{ color: "var(--odoo-text-muted)", marginTop: 3 }}>
          Data live from Odoo on request
        </div>
      </div>
    </div>
  );
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
