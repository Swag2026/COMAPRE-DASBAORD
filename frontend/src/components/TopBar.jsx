import { NavLink } from "react-router-dom";

const TABS = [
  { to: "/total-stock", label: "Total Stock" },
  { to: "/branch-stock", label: "Branch Stock" },
  { to: "/reorder", label: "Reorder Suggestions" },
  { to: "/transfers", label: "Pending Transfers" },
  { to: "/season-comparison", label: "Season Comparison" },
];

export default function TopBar() {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 20 }}>
      {/* Row 1 — brand + app switcher, mimics Odoo's purple top bar */}
      <div
        style={{
          height: "var(--odoo-topbar-h)",
          background: "var(--odoo-purple)",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          gap: 16,
          color: "#fff",
        }}
      >
        <button
          aria-label="Apps"
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            display: "grid",
            gridTemplateColumns: "repeat(3, 4px)",
            gap: 3,
            padding: 8,
          }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              style={{ width: 4, height: 4, borderRadius: 1, background: "#fff" }}
            />
          ))}
        </button>
        <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: 0.2 }}>
          SWAG Dashboard
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 12.5, opacity: 0.9 }}>ZIAD.M@SWAG.COM.SA</div>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          ZM
        </div>
      </div>

      {/* Row 2 — tab strip, mimics Odoo's breadcrumb/tab row */}
      <div
        style={{
          background: "var(--odoo-surface)",
          borderBottom: "1px solid var(--odoo-border)",
          display: "flex",
          padding: "0 12px",
          gap: 4,
          overflowX: "auto",
        }}
      >
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            style={({ isActive }) => ({
              padding: "12px 14px",
              fontSize: 13,
              fontWeight: 500,
              color: isActive ? "var(--odoo-purple)" : "var(--odoo-text-muted)",
              borderBottom: isActive
                ? "2px solid var(--odoo-purple)"
                : "2px solid transparent",
              whiteSpace: "nowrap",
              textDecoration: "none",
            })}
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
