export default function KpiRow({ items }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${items.length}, 1fr)`,
        gap: 12,
        marginBottom: 14,
      }}
    >
      {items.map((it) => (
        <div
          key={it.label}
          style={{
            background: "var(--odoo-surface)",
            border: "1px solid var(--odoo-border)",
            borderRadius: "var(--odoo-radius)",
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "var(--odoo-text-muted)",
              marginBottom: 6,
            }}
          >
            {it.label}
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: it.color || "var(--odoo-text)",
            }}
          >
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}
