export default function RowDetailDrawer({ row, columns, onClose }) {
  if (!row) return null;
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(17,24,39,0.35)", zIndex: 90 }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 360,
          maxWidth: "90vw",
          background: "#fff",
          zIndex: 91,
          boxShadow: "-8px 0 32px rgba(0,0,0,0.15)",
          padding: 24,
          overflowY: "auto",
          animation: "drawerIn 0.25s ease both",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--odoo-purple)" }}>Details</div>
          <button
            onClick={onClose}
            style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: "var(--odoo-text-muted)", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {columns.map((c) => (
          <div key={c.key} style={{ marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #F3F4F6" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--odoo-text-muted)", marginBottom: 4 }}>
              {c.label}
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--odoo-text)", wordBreak: "break-word" }}>
              {c.render ? c.render(row) : String(row[c.key] ?? "—")}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes drawerIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}
