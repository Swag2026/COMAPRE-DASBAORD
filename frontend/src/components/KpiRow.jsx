import useCountUp from "../utils/useCountUp";

// Matches the reference's Summary & Alerts cards exactly — verified against
// its source CSS (not just a screenshot). Each tone has THREE distinct
// shades, not one: the badge's solid background, a near-black tinted glyph
// color inside it, and a separately-darkened number color. Default/neutral
// is solid black + white glyph; purple stays reserved for hero/CTA only.
const TONE = {
  good: { bg: "var(--odoo-success)", icon: "#12271A", num: "#146c3a" },
  warn: { bg: "var(--odoo-warning)", icon: "#2E2308", num: "#8a5300" },
  bad: { bg: "var(--odoo-danger)", icon: "#2E100C", num: "#a51e1e" },
  default: { bg: "#1a1a1a", icon: "#fff", num: "var(--odoo-heading)" },
};

export default function KpiRow({ items }) {
  return (
    <div className="kpi-grid">
      {items.map((it, i) => (
        <KpiCard key={it.label} item={it} delay={i * 0.06} />
      ))}
    </div>
  );
}

function KpiCard({ item, delay }) {
  const animated = useCountUp(item.value);
  const display = typeof item.value === "number" && item.format ? item.format(animated) : animated;
  const tone = TONE[item.tone] || TONE.default;
  const Icon = item.icon;

  return (
    <div
      className={`kpi-card ${item.tone || ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="kpi-accent" style={{ background: tone.bg }} />
      {Icon && (
        <span className="kpi-icon" style={{ background: tone.bg, color: tone.icon }}>
          <Icon size={19} />
        </span>
      )}
      <div className="kpi-info">
        <div className="num" style={{ color: item.color || tone.num }}>
          {display}
        </div>
        <div className="label">{item.label}</div>
      </div>
    </div>
  );
}
