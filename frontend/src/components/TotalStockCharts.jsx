import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ValueBySystemChart({ rows }) {
  const ok = rows.filter((r) => r.status === "OK");
  const byS = {};
  for (const r of ok) {
    byS[r.system_name] = (byS[r.system_name] || 0) + r.sale_price * r.on_hand;
  }
  const data = Object.entries(byS)
    .map(([system_name, value]) => ({ system_name, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) return <EmptyChart />;

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--odoo-border)" />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="system_name" tick={{ fontSize: 11 }} width={130} />
          <Tooltip
            formatter={(v) => v.toLocaleString()}
            contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid var(--odoo-border)" }}
          />
          <Bar dataKey="value" fill="var(--odoo-purple)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Top10ValueChart({ rows }) {
  const ok = rows.filter((r) => r.status === "OK");
  const data = ok
    .map((r) => ({
      label: `${r.model_code}`,
      value: Math.round(r.sale_price * r.on_hand),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  if (data.length === 0) return <EmptyChart />;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--odoo-border)" />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="label" tick={{ fontSize: 11 }} width={90} />
          <Tooltip
            formatter={(v) => v.toLocaleString()}
            contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid var(--odoo-border)" }}
          />
          <Bar dataKey="value" fill="#D4A84B" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyChart() {
  return (
    <div style={{ padding: 24, textAlign: "center", color: "var(--odoo-text-muted)", fontSize: 12.5 }}>
      Chart ke liye koi data nahi.
    </div>
  );
}
