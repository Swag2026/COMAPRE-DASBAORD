const SIZE_ORDER = ["2XS", "XS", "S", "M", "L", "XL", "XXL", "2XL", "3XL", "4XL", "5XL", "OSFA"];
const SIZE_RE = /-?(2XS|XS|S|M|L|XL|XXL|2XL|3XL|4XL|5XL|OSFA|OS)$/i;

function extractSize(code) {
  const c = String(code || "").trim();
  const m = c.match(SIZE_RE);
  if (m) {
    const size = m[0].replace(/^-/, "").toUpperCase();
    const base = c.slice(0, m.index).replace(/-$/, "").trim();
    return [base, size];
  }
  return [c, ""];
}

export function buildSizePivot(rows) {
  const sized = rows
    .filter((r) => r.status === "OK")
    .map((r) => {
      const [base, size] = extractSize(r.model_code);
      return { ...r, _base: base, _size: size };
    })
    .filter((r) => r._size !== "");

  if (sized.length === 0) return null;

  const groups = {};
  const sizesFound = new Set();
  for (const r of sized) {
    const key = `${r.system_name}|${r._base}`;
    if (!groups[key]) {
      groups[key] = { system_name: r.system_name, base: r._base, price: r.sale_price, sizes: {} };
    }
    groups[key].sizes[r._size] = (groups[key].sizes[r._size] || 0) + r.on_hand;
    sizesFound.add(r._size);
  }

  const ordered = SIZE_ORDER.filter((s) => sizesFound.has(s));
  const extra = [...sizesFound].filter((s) => !SIZE_ORDER.includes(s)).sort();
  const sizeCols = [...ordered, ...extra];

  const pivotRows = Object.values(groups)
    .map((g) => {
      const total = sizeCols.reduce((sum, s) => sum + (g.sizes[s] || 0), 0);
      return { ...g, total };
    })
    .sort((a, b) => a.system_name.localeCompare(b.system_name) || a.base.localeCompare(b.base));

  return { rows: pivotRows, sizeCols };
}

export default function SizePivotTable({ pivot, threshold = 0 }) {
  if (!pivot || pivot.rows.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "var(--odoo-text-muted)", fontSize: 12.5 }}>
        No size suffixes found in model codes (e.g. XP6013-M). Size View works when model codes end with
        -S/-M/-L/-XL/-XXL etc.
      </div>
    );
  }
  const { rows, sizeCols } = pivot;

  return (
    <div style={{ background: "#fff", border: "1px solid var(--odoo-border)", borderRadius: "var(--odoo-radius)", overflow: "auto", maxHeight: 560 }}>
      <table>
        <thead>
          <tr>
            {["System", "Base Model", "Unit Price", ...sizeCols, "Total"].map((h) => (
              <th
                key={h}
                style={{
                  position: "sticky", top: 0, background: "#E0F4F5", color: "var(--odoo-purple)",
                  fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700,
                  padding: "10px 12px", textAlign: "center", whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
              <td style={cellStyle()}>{r.system_name}</td>
              <td style={{ ...cellStyle(), fontFamily: "monospace", fontWeight: 700, color: "var(--odoo-purple)" }}>
                {r.base}
              </td>
              <td style={{ ...cellStyle(), color: "var(--brand-gold)", fontFamily: "monospace", fontSize: 11 }}>
                {r.price.toFixed(2)}
              </td>
              {sizeCols.map((s) => {
                const v = r.sizes[s] || 0;
                let style = { ...cellStyle(), color: "#7FCDD3", fontWeight: 500 };
                if (v === 0) style = { ...cellStyle(), color: "var(--odoo-danger)", fontSize: 11 };
                else if (threshold > 0 && v <= threshold) style = { ...cellStyle(), color: "var(--brand-gold)", fontWeight: 600 };
                return (
                  <td key={s} style={style}>
                    {v}
                  </td>
                );
              })}
              <td style={{ ...cellStyle(), fontWeight: 700, color: "var(--odoo-text)" }}>{r.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function cellStyle() {
  return { padding: "10px 14px", textAlign: "center", fontSize: 13 };
}
