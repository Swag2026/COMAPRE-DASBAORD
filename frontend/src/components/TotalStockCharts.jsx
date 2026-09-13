import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const PALETTE = ["#1A7A82", "#D4A84B", "#059669", "#7C3AED", "#DC2626", "#0EA5E9", "#F97316", "#DB2777"];

export function ValueBySystemChart({ rows }) {
  const ok = rows.filter((r) => r.status === "OK");
  const byS = {};
  const qtyS = {};
  for (const r of ok) {
    byS[r.system_name] = (byS[r.system_name] || 0) + r.sale_price * r.on_hand;
    qtyS[r.system_name] = (qtyS[r.system_name] || 0) + r.on_hand;
  }
  const data = Object.entries(byS)
    .map(([system_name, value]) => ({ system_name, value: Math.round(value), qty: qtyS[system_name] }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) return <EmptyChart />;

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="system_name" tick={{ fontSize: 11 }} width={130} axisLine={false} tickLine={false} />
          <Tooltip content={<RichTooltip unit="SAR" extraKey="qty" extraLabel="Total Qty" />} cursor={{ fill: "rgba(26,122,130,0.06)" }} />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} animationDuration={900} animationEasing="ease-out">
            {data.map((d, i) => (
              <Cell key={d.system_name} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Top10ValueChart({ rows }) {
  const ok = rows.filter((r) => r.status === "OK");
  const data = ok
    .map((r) => ({ label: r.model_code, value: Math.round(r.sale_price * r.on_hand), qty: r.on_hand, system: r.system_name }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  if (data.length === 0) return <EmptyChart />;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="label" tick={{ fontSize: 11 }} width={90} axisLine={false} tickLine={false} />
          <Tooltip content={<RichTooltip unit="SAR" extraKey="qty" extraLabel="On Hand" systemKey="system" />} cursor={{ fill: "rgba(212,168,75,0.08)" }} />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} animationDuration={900} animationEasing="ease-out">
            {data.map((d, i) => (
              <Cell key={d.label} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function RichTooltip({ active, payload, unit, extraKey, extraLabel, systemKey }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--odoo-border)",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        fontSize: 12,
        animation: "tooltipPop 0.15s ease",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 4, color: "var(--odoo-purple)" }}>
        {d.system_name || d.label}
      </div>
      {systemKey && d[systemKey] && (
        <div style={{ color: "var(--odoo-text-muted)", marginBottom: 4 }}>{d[systemKey]}</div>
      )}
      <div style={{ color: "var(--odoo-text)" }}>
        Value: <b>{d.value.toLocaleString()} {unit}</b>
      </div>
      {extraKey && (
        <div style={{ color: "var(--odoo-text-muted)" }}>
          {extraLabel}: <b>{d[extraKey]?.toLocaleString()}</b>
        </div>
      )}
      <style>{`
        @keyframes tooltipPop { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
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
