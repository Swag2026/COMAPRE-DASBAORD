import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppState } from "../api/AppStateContext";
import { useToast } from "../api/ToastContext";
import { FLAT_NAV } from "./MegaMenu";
import Spinner from "./Spinner";

export default function Sidebar() {
  const {
    triggerReload,
    lowStockThreshold, setLowStockThreshold,
    exactMatch, setExactMatch,
    lastRun,
  } = useAppState();
  const [reloading, setReloading] = useState(false);
  const { showToast } = useToast();
  const { pathname } = useLocation();
  const navigate = useNavigate();

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
    <aside
      style={{
        width: 250,
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        background: "var(--odoo-surface)",
        borderRight: "1px solid var(--odoo-border)",
        boxShadow: "0 4px 10px rgba(45,25,40,.06), 0 14px 34px rgba(45,25,40,.15)",
        display: "flex",
        flexDirection: "column",
        zIndex: 30,
      }}
    >
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 18px 16px", borderBottom: "1px solid var(--odoo-border)" }}>
        <div
          style={{
            width: 38, height: 38, borderRadius: 11, flexShrink: 0,
            background: "linear-gradient(155deg, #F0EEEE, #FBFBFB)",
            border: "1px solid var(--odoo-border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "var(--odoo-shadow)",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 100 88">
            <path d="M13 51 L50 65 L87 51 L87 58 L50 72 L13 58 Z" fill="#A87F9D" />
            <rect x="24" y="30" width="15" height="30" fill="#714B67" />
            <rect x="41" y="12" width="16" height="48" fill="#8B5E7E" />
            <rect x="59" y="32" width="15" height="28" fill="#F1E6EE" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: "var(--odoo-text)" }}>SWAG</div>
          <div style={{ fontSize: 11, color: "var(--odoo-text-faint)", marginTop: 1 }}>Product Dashboard</div>
        </div>
      </div>

      {/* Flat nav tabs */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, padding: "14px 10px", flex: 1, overflowY: "auto" }}>
        {FLAT_NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to;
          return (
            <button
              key={item.to}
              onClick={() => navigate(item.to)}
              className="nav-tab-btn"
              style={{
                display: "flex", alignItems: "center", gap: 10,
                background: active ? "linear-gradient(135deg, var(--odoo-purple-pale), #F0EEEE 130%)" : "transparent",
                color: active ? "var(--odoo-purple)" : "var(--odoo-text-muted)",
                border: "none",
                borderRadius: 8,
                padding: "10px 13px",
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                cursor: "pointer",
                position: "relative",
                textAlign: "left",
                boxShadow: active ? "inset 0 0 0 1px rgba(113,75,103,.08)" : "none",
              }}
            >
              {active && (
                <span style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 3, borderRadius: 3, background: "var(--odoo-purple)" }} />
              )}
              <Icon size={17} style={{ color: active ? "var(--odoo-purple)" : "var(--odoo-text-faint)", flexShrink: 0 }} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Snapshot card */}
      <div style={{ margin: "0 14px 14px", padding: "13px 15px", border: "1px solid var(--odoo-border)", borderRadius: 10, background: "#FBFBFB" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--odoo-text-faint)", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 9 }}>
          Session
        </div>
        <SnapRow label="Low stock ≤" value={lowStockThreshold} />
        <div style={{ marginTop: 10 }}>
          <SnapRow label="Last run" value={lastRun || "—"} />
        </div>
      </div>

      {/* Settings */}
      <div style={{ padding: "0 16px 14px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--odoo-text-muted)", cursor: "pointer", marginBottom: 10 }}>
          <input type="checkbox" checked={exactMatch} onChange={(e) => setExactMatch(e.target.checked)} />
          Exact match search
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "var(--odoo-text-muted)" }}>Threshold</span>
          <input
            type="number"
            min={0}
            value={lowStockThreshold}
            onChange={(e) => setLowStockThreshold(Number(e.target.value) || 0)}
            style={{ width: 60, height: 28, padding: "0 8px", border: "1px solid var(--odoo-border-strong)", borderRadius: 6, fontSize: 12.5 }}
          />
          <button onClick={handleReload} disabled={reloading} style={reloadBtnStyle}>
            {reloading ? <Spinner size={12} /> : "⟳"}
          </button>
        </div>
      </div>

      <div style={{ padding: "12px 20px 18px", fontSize: 11.5, color: "var(--odoo-text-faint)", borderTop: "1px solid var(--odoo-border)", display: "flex", gap: 8 }}>
        <span>🔒</span>
        <span>Live data from Odoo, secured behind your account login.</span>
      </div>

      <style>{`
        .nav-tab-btn:hover { background: var(--odoo-bg) !important; color: var(--odoo-text) !important; }
      `}</style>
    </aside>
  );
}

function SnapRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 12, color: "var(--odoo-text-muted)" }}>
      <span>{label}</span>
      <span style={{ fontWeight: 800, color: "var(--odoo-text)", fontSize: 13.5 }}>{value}</span>
    </div>
  );
}

const reloadBtnStyle = {
  width: 28, height: 28, borderRadius: 6,
  border: "1px solid var(--odoo-border-strong)",
  background: "#fff",
  color: "var(--odoo-purple)",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 13,
};
