import useCountUp from "../utils/useCountUp";

const TONE_COLORS = {
  good: { bar: "#3D7A4E", bg: "#E7F2E8", fg: "#3D7A4E" },
  warn: { bar: "#B5842A", bg: "#FBF0DB", fg: "#B5842A" },
  bad: { bar: "#A93226", bg: "#FBE8E4", fg: "#A93226" },
  default: { bar: "#8B5E7E", bg: "#F1E6EE", fg: "#714B67" },
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
  const tone = TONE_COLORS[item.tone] || TONE_COLORS.default;
  const Icon = item.icon;

  return (
    <div
      className={`kpi-card ${item.tone || ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="kpi-accent" style={{ background: tone.bar }} />
      {Icon && (
        <span className="kpi-icon" style={{ background: tone.bg, color: tone.fg }}>
          <Icon size={19} />
        </span>
      )}
      <div className="kpi-info">
        <div className="num" style={{ color: item.color || undefined }}>
          {display}
        </div>
        <div className="label">{item.label}</div>
      </div>
    </div>
  );
}
