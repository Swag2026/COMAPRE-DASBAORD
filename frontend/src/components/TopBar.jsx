import { LayoutGrid } from "lucide-react";
import MegaMenu from "./MegaMenu";
import { useAuth } from "../api/AuthContext";

export default function TopBar() {
  const { username } = useAuth();
  const initials = (username || "?")
    .split("@")[0]
    .split(/[._-]/)
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      style={{
        height: "var(--odoo-topbar-h)",
        background: "linear-gradient(180deg, #0F0F10 0%, #0A0A0A 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: 20,
        color: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <button
        aria-label="Apps"
        style={{
          background: "transparent",
          border: "none",
          color: "rgba(255,255,255,0.55)",
          display: "flex",
          alignItems: "center",
          padding: 6,
          cursor: "pointer",
        }}
      >
        <LayoutGrid size={17} />
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            background: "linear-gradient(135deg, #4AACB4, #D4A84B)",
          }}
        />
        <div style={{ fontWeight: 600, fontSize: 14.5, letterSpacing: 0.3, color: "#fff" }}>
          SWAG <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>Dashboard</span>
        </div>
      </div>

      <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.1)" }} />

      <MegaMenu />

      <div style={{ flex: 1 }} />

      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: 0.5,
          color: "rgba(255,255,255,0.7)",
        }}
      >
        {initials}
      </div>
    </div>
  );
}
