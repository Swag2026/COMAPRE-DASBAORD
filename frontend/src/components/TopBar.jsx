export default function TopBar() {
  return (
    <div
      style={{
        height: "var(--odoo-topbar-h)",
        background: "var(--odoo-purple)",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 16,
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
          color: "#fff",
          display: "grid",
          gridTemplateColumns: "repeat(3, 4px)",
          gap: 3,
          padding: 8,
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} style={{ width: 4, height: 4, borderRadius: 1, background: "#fff" }} />
        ))}
      </button>
      <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: 0.2 }}>SWAG Dashboard</div>
    </div>
  );
}
