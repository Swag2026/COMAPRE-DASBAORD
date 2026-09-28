// Matches the reference app's `.chart-card` exactly:
//   background:var(--surface); border:1px solid var(--line); border-radius:var(--radius);
//   padding:18px; box-shadow:var(--shadow-sm);
//   h3 { margin:0 0 4px; font-size:14px; font-weight:800; color:var(--heading-text); }
//   p  { margin:0 0 10px; font-size:13px; color:var(--ink-600); }
export default function ChartCard({ title, subtitle, children }) {
  return (
    <div
      className="chart-card"
      style={{
        background: "var(--odoo-surface)",
        border: "1px solid var(--odoo-border)",
        borderRadius: "var(--odoo-radius)",
        padding: 18,
        boxShadow: "var(--odoo-shadow)",
      }}
    >
      {title && (
        <div style={{ margin: "0 0 4px", fontFamily: "var(--odoo-display-font)", fontSize: 14, fontWeight: 800, color: "var(--odoo-heading)" }}>
          {title}
        </div>
      )}
      {subtitle && (
        <div style={{ margin: "0 0 10px", fontSize: 13, color: "var(--odoo-text-muted)" }}>
          {subtitle}
        </div>
      )}
      {children}
    </div>
  );
}
