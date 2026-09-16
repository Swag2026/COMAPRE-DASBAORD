import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../api/AuthContext";
import { useAppState } from "../api/AppStateContext";
import { useToast } from "../api/ToastContext";
import { NAV_ITEMS } from "./MegaMenu";
import Spinner from "./Spinner";

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
    <div
      style={{
        width: 250,
        flexShrink: 0,
        background: "linear-gradient(180deg, #0F0F10 0%, #0A0A0A 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        padding: "18px 14px",
        gap: 16,
        height: "calc(100vh - var(--odoo-topbar-h))",
        position: "sticky",
        top: "var(--odoo-topbar-h)",
        overflowY: "auto",
        color: "#fff",
      }}
    >
      <div style={{ paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize: 9.5, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontWeight: 700, marginBottom: 4 }}>
          Signed in as
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#fff", wordBreak: "break-all" }}>
          {username}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={logout} style={darkBtnStyle()}>
          Logout →
        </button>
        <button onClick={handleReload} disabled={reloading} style={darkBtnStyle("solid")}>
          {reloading ? <Spinner size={13} /> : "⟳ Reload"}
        </button>
      </div>

      <Divider />

      {NAV_ITEMS.map((group) => (
        <div key={group.label}>
          <div style={groupLabelStyle}>{group.label}</div>
          {group.subMenus.map((sub) => (
            <div key={sub.title} style={{ marginBottom: 10 }}>
              <div style={subLabelStyle}>{sub.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {sub.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.to;
                  return (
                    <button
                      key={item.label}
                      onClick={() => navigate(item.to)}
                      className="sb-item"
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 9,
                        textAlign: "left",
                        padding: "8px 8px",
                        borderRadius: 10,
                        border: "none",
                        cursor: "pointer",
                        background: active ? "rgba(255,255,255,0.08)" : "transparent",
                      }}
                    >
                      <span
                        className="sb-icon"
                        style={{
                          width: 30,
                          height: 30,
                          flexShrink: 0,
                          borderRadius: 8,
                          border: `1px solid ${active ? "#fff" : "rgba(255,255,255,0.25)"}`,
                          background: active ? "#fff" : "transparent",
                          color: active ? "#0A0A0A" : "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon size={15} />
                      </span>
                      <span>
                        <span style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#fff" }}>{item.label}</span>
                        <span style={{ display: "block", fontSize: 10.5, color: "rgba(255,255,255,0.4)" }}>{item.description}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}

      <Divider />

      <div
        style={{
          background: "rgba(5,150,105,0.1)",
          border: "1px solid rgba(5,150,105,0.3)",
          borderRadius: 10,
          padding: "10px 12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9.5, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "#34D399", marginBottom: 3 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34D399" }} />
          App Active
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
          Auto-refresh keeps app awake
        </div>
      </div>

      <Divider />

      <div>
        <div style={groupLabelStyle}>Search Mode</div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, cursor: "pointer", color: "#fff" }}>
          <input type="checkbox" checked={exactMatch} onChange={(e) => setExactMatch(e.target.checked)} />
          Exact match
        </label>
      </div>

      <Divider />

      <div>
        <div style={groupLabelStyle}>Low Stock Alert</div>
        <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>
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
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.06)",
            color: "#fff",
            borderRadius: 8,
            fontSize: 13,
          }}
        />
      </div>

      {lastRun && (
        <>
          <Divider />
          <div>
            <div style={groupLabelStyle}>Last Run</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{lastRun}</div>
          </div>
        </>
      )}

      <div style={{ flex: 1 }} />
      <style>{`
        .sb-item:hover { background: rgba(255,255,255,0.06) !important; }
        .sb-item:hover .sb-icon { background: #fff; color: #0A0A0A; border-color: #fff; }
      `}</style>
    </div>
  );
}

function Divider() {
  return <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />;
}

const groupLabelStyle = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.5)",
  marginBottom: 8,
};

const subLabelStyle = {
  fontSize: 9,
  fontWeight: 500,
  textTransform: "capitalize",
  color: "rgba(255,255,255,0.3)",
  marginBottom: 6,
};

function darkBtnStyle(variant) {
  const base = {
    flex: 1,
    height: 34,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  };
  if (variant === "solid") {
    return { ...base, border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.1)", color: "#fff" };
  }
  return { ...base, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "rgba(255,255,255,0.8)" };
}
