import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const SYSTEM_COLORS = {
  SWAG: "#1A7A82",
  "La Rouche": "#D4A84B",
  "Different Clothes": "#059669",
  "Fashion Limits": "#7C3AED",
  Stock: "#DC2626",
};
const FALLBACK_COLORS = ["#875A7B", "#4B2C43", "#0EA5E9", "#F97316", "#DB2777"];

export default function BranchQtyChart({ rows }) {
  const okRows = rows.filter((r) => r.status === "OK");
  const systems = [...new Set(okRows.map((r) => r.system_name))].sort();

  const byBranch = {};
  const modelsByBranch = {};
  for (const r of okRows) {
    if (!byBranch[r.branch]) byBranch[r.branch] = { branch: r.branch, _total: 0 };
    byBranch[r.branch][r.system_name] = (byBranch[r.branch][r.system_name] || 0) + r.on_hand;
    byBranch[r.branch]._total += r.on_hand;
    if (r.on_hand > 0) {
      modelsByBranch[r.branch] = (modelsByBranch[r.branch] || 0) + 1;
    }
  }
  const data = Object.values(byBranch)
    .map((d) => ({ ...d, _models: modelsByBranch[d.branch] || 0 }))
    .sort((a, b) => b._total - a._total);

  if (data.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "var(--odoo-text-muted)", fontSize: 12.5 }}>
        No data for this chart.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 340 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
          <XAxis
            dataKey="branch"
            tick={{ fontSize: 10 }}
            angle={-35}
            textAnchor="end"
            interval={0}
            height={60}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, "auto"]} allowDecimals={false} />
          <Tooltip content={<BranchTooltip />} cursor={{ fill: "rgba(26,122,130,0.06)" }} />
          <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11, paddingBottom: 8 }} />
          {systems.map((sys, i) => (
            <Bar
              key={sys}
              dataKey={sys}
              name={sys}
              stackId="qty"
              fill={SYSTEM_COLORS[sys] || FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
              radius={sys === systems[systems.length - 1] ? [6, 6, 0, 0] : [0, 0, 0, 0]}
              animationDuration={800}
              animationEasing="ease-out"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function BranchTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  const models = payload[0]?.payload?._models || 0;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--odoo-border)",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        fontSize: 12,
        animation: "branchTooltipPop 0.15s ease",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6, color: "var(--odoo-purple)" }}>{label}</div>
      {payload.filter((p) => p.value > 0).map((p) => (
        <div key={p.dataKey} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.fill }} />
          <span>{p.dataKey}:</span>
          <b>{p.value}</b>
        </div>
      ))}
      <div style={{ marginTop: 6, paddingTop: 6, borderTop: "1px solid #F3F4F6", color: "var(--odoo-text-muted)" }}>
        Total: <b style={{ color: "var(--odoo-text)" }}>{total}</b> · Models in stock: <b style={{ color: "var(--odoo-text)" }}>{models}</b>
      </div>
      <style>{`
        @keyframes branchTooltipPop { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
