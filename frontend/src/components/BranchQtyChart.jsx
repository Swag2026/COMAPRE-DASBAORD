import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SYSTEM_COLORS = {
  SWAG: "#714B67",
  "La Rouche": "#D4A84B",
  "Different Clothes": "#059669",
  "Fashion Limits": "#7C3AED",
  Stock: "#DC2626",
};
const FALLBACK_COLORS = ["#875A7B", "#4B2C43", "#94A3B8", "#0EA5E9", "#F97316"];

export default function BranchQtyChart({ rows }) {
  const okRows = rows.filter((r) => r.status === "OK");
  const systems = [...new Set(okRows.map((r) => r.system_name))].sort();

  const byBranch = {};
  for (const r of okRows) {
    if (!byBranch[r.branch]) byBranch[r.branch] = { branch: r.branch, _total: 0 };
    byBranch[r.branch][r.system_name] = (byBranch[r.branch][r.system_name] || 0) + r.on_hand;
    byBranch[r.branch]._total += r.on_hand;
  }
  const data = Object.values(byBranch)
    .sort((a, b) => b._total - a._total)
    .slice(0, 30); // keep the chart readable

  if (data.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "var(--odoo-text-muted)", fontSize: 12.5 }}>
        Chart ke liye koi data nahi.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 340 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--odoo-border)" />
          <XAxis
            dataKey="branch"
            tick={{ fontSize: 10 }}
            angle={-35}
            textAnchor="end"
            interval={0}
            height={60}
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid var(--odoo-border)" }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {systems.map((sys, i) => (
            <Bar
              key={sys}
              dataKey={sys}
              stackId="qty"
              fill={SYSTEM_COLORS[sys] || FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
