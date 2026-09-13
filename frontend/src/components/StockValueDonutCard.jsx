import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DonutChart from "./DonutChart";

const PALETTE = ["#1A7A82", "#D4A84B", "#059669", "#7C3AED", "#DC2626", "#0EA5E9"];

export default function StockValueDonutCard({ rows, title = "Stock Split by System" }) {
  const [hoveredLabel, setHoveredLabel] = useState(null);

  const ok = rows.filter((r) => r.status === "OK");
  const bySystem = {};
  for (const r of ok) {
    bySystem[r.system_name] = (bySystem[r.system_name] || 0) + r.sale_price * r.on_hand;
  }
  const data = Object.entries(bySystem)
    .map(([label, value], i) => ({ label, value: Math.round(value), color: PALETTE[i % PALETTE.length] }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((s, d) => s + d.value, 0);
  const active = data.find((d) => d.label === hoveredLabel);
  const displayValue = active?.value ?? total;
  const displayLabel = active?.label ?? "Total Value";
  const displayPct = active ? (active.value / total) * 100 : 100;

  if (data.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "var(--odoo-text-muted)", fontSize: 12.5 }}>
        Chart ke liye koi data nahi.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>{title}</div>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <DonutChart
          data={data}
          size={180}
          strokeWidth={22}
          animationDuration={1.1}
          animationDelayPerSegment={0.06}
          onSegmentHover={(seg) => setHoveredLabel(seg?.label ?? null)}
          centerContent={
            <AnimatePresence mode="wait">
              <motion.div
                key={displayLabel}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
              >
                <div style={{ fontSize: 10.5, color: "var(--odoo-text-muted)", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {displayLabel}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--odoo-text)" }}>
                  {displayValue.toLocaleString()}
                </div>
                {active && (
                  <div style={{ fontSize: 11, color: "var(--odoo-text-muted)" }}>{displayPct.toFixed(0)}%</div>
                )}
              </motion.div>
            </AnimatePresence>
          }
        />
      </div>

      <div style={{ width: "100%", marginTop: 16, borderTop: "1px solid var(--odoo-border)", paddingTop: 10 }}>
        {data.map((d, i) => (
          <motion.div
            key={d.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + i * 0.08, duration: 0.3 }}
            onMouseEnter={() => setHoveredLabel(d.label)}
            onMouseLeave={() => setHoveredLabel(null)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "6px 8px",
              borderRadius: 6,
              cursor: "pointer",
              background: hoveredLabel === d.label ? "var(--odoo-purple-pale)" : "transparent",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: d.color }} />
              <span style={{ fontSize: 12, fontWeight: 500 }}>{d.label}</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--odoo-text-muted)" }}>
              {d.value.toLocaleString()}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
