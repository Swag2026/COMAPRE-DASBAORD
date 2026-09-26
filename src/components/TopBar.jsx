import { Bell, LogOut } from "lucide-react";
import { useAuth } from "../api/AuthContext";

export default function TopBar() {
  const { username, logout } = useAuth();

  return (
    <header
      style={{
        height: 64,
        background: "var(--odoo-surface)",
        borderBottom: "1px solid var(--odoo-border)",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 16,
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <div style={{ flex: 1 }}>
        <h1 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "var(--odoo-text)" }}>
          Product Comparison Dashboard
        </h1>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--odoo-purple)", fontWeight: 600 }}>
          {username}
        </p>
      </div>

      <IconBtn title="Alerts"><Bell size={17} /></IconBtn>
      <span style={{ width: 1, height: 22, background: "var(--odoo-border)" }} />
      <IconBtn title="Logout" danger onClick={logout}><LogOut size={17} /></IconBtn>
    </header>
  );
}

function IconBtn({ children, title, danger, onClick }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: 36,
        height: 36,
        borderRadius: 9,
        border: "1px solid var(--odoo-border)",
        background: "var(--odoo-bg)",
        color: danger ? "var(--odoo-danger)" : "var(--odoo-text-muted)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
}
