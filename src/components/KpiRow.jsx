import useCountUp from "../utils/useCountUp";

const TONE_COLORS = {
  good: { bar: "#3D7A4E", bg: "#E7F2E8", fg: "#3D7A4E" },
  warn: { bar: "#B5842A", bg: "#FBF0DB", fg: "#B5842A" },
  bad: { bar: "#A93226", bg: "#FBE8E4", fg: "#A93226" },
  default: { bar: "#8B5E7E", bg: "#F1E6EE", fg: "#714B67" },
};

export default function KpiRow({ items }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`,
        gap: 14,
        marginBottom: 20,
      }}
    >
      {items.map((it, i) => (
        <KpiCard key={it.label} item={it} delay={i * 0.06} />
      ))}
    </div>
  );
}

function KpiCard({ item, delay }) {
  const animated = useCountUp(item.value);
  const display = typeof item.value === "number" && item.format ? item.format(animated) : animated;
  const tone = TONE_COLORS[item.tone] || TONE_COLORS.default;
  const Icon = item.icon;

  return (
    <div
      className="kpi-card"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 13,
        background: "var(--odoo-surface)",
        border: "1px solid var(--odoo-border)",
        borderRadius: "var(--odoo-radius)",
        padding: "15px 16px",
        boxShadow: "var(--odoo-shadow)",
        position: "relative",
        overflow: "hidden",
        animation: "countUp 0.5s ease both",
        animationDelay: `${delay}s`,
        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
      }}
    >
      <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: tone.bar, opacity: 0.7 }} />
      {Icon && (
        <span
          style={{
            width: 42, height: 42, borderRadius: 11, flexShrink: 0,
            background: tone.bg, color: tone.fg,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Icon size={19} />
        </span>
      )}
      <div>
        <div style={{ fontSize: 20, fontWeight: 800, color: item.color || "var(--odoo-text)", lineHeight: 1.15 }}>
          {display}
        </div>
        <div style={{ fontSize: 12, color: "var(--odoo-text-muted)", marginTop: 2 }}>{item.label}</div>
      </div>
      <style>{`
        .kpi-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 2px 6px rgba(45,25,40,.08), 0 8px 20px rgba(45,25,40,.08);
          border-color: var(--odoo-purple-light);
        }
      `}</style>
    </div>
  );
}
