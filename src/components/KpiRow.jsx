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
  // Structural redesign, not a recolor: the lead stat is called out as a big
  // dark "featured" tile (the way the Scalerfy reference makes one project
  // card carry a solid dark overlay while the rest stay plain), so the row
  // reads as an editorial hierarchy instead of N identical boxes.
  const canFeature = items.length >= 3;
  return (
    <div className="kpi-grid">
      {items.map((it, i) => (
        <KpiCard key={it.label} item={it} delay={i * 0.06} featured={canFeature && i === 0} />
      ))}
    </div>
  );
}

function KpiCard({ item, delay, featured }) {
  const animated = useCountUp(item.value);
  const display = typeof item.value === "number" && item.format ? item.format(animated) : animated;
  const tone = TONE[item.tone] || TONE.default;
  const Icon = item.icon;
  const iconBg = featured ? "rgba(255,255,255,.14)" : tone.bg;
  const iconColor = featured ? "#fff" : tone.icon;

  return (
    <div
      className={`kpi-card ${item.tone || ""}${featured ? " featured" : ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {!featured && <span className="kpi-accent" style={{ background: tone.bg }} />}
      {Icon && (
        <span className="kpi-icon" style={{ background: iconBg, color: iconColor }}>
          <Icon size={featured ? 22 : 19} />
        </span>
      )}
      <div className="kpi-info">
        <div className="num" style={{ color: featured ? "#fff" : item.color || tone.num }}>
          {display}
        </div>
        <div className="label">{item.label}</div>
      </div>
    </div>
  );
}
