export default function KpiRow({ items }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${items.length}, 1fr)`,
        gap: 14,
        marginBottom: 16,
      }}
    >
      {items.map((it, i) => (
        <div
          key={it.label}
          className="kpi-card"
          style={{
            background: "var(--odoo-surface)",
            border: "2px solid var(--odoo-border)",
            borderRadius: 14,
            padding: "20px 22px",
            textAlign: "center",
            animation: `countUp 0.5s ease both`,
            animationDelay: `${i * 0.08}s`,
            transition: "all 0.2s",
            cursor: "default",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "var(--odoo-text-muted)",
              marginBottom: 8,
            }}
          >
            {it.label}
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 600,
              lineHeight: 1,
              color: it.color || "var(--odoo-text)",
            }}
          >
            {it.value}
          </div>
        </div>
      ))}
      <style>{`
        .kpi-card:hover {
          border-color: var(--odoo-purple);
          box-shadow: 0 8px 24px rgba(26,122,130,0.15);
          transform: translateY(-3px);
        }
      `}</style>
    </div>
  );
}
