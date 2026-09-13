import Spinner from "./Spinner";

export default function DataTable({ columns, rows, loading, emptyText = "No data for selected filters.", lowStockThreshold = 0 }) {
  if (loading) {
    return (
      <div style={{ padding: 50, textAlign: "center", color: "var(--odoo-text-muted)" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <Spinner size={28} />
        </div>
        Loading…
      </div>
    );
  }
  if (!rows || rows.length === 0) {
    return (
      <div
        style={{
          padding: 32,
          textAlign: "center",
          color: "var(--odoo-text-muted)",
          background: "var(--odoo-surface)",
          border: "2px solid var(--odoo-border)",
          borderRadius: "var(--odoo-radius)",
        }}
      >
        {emptyText}
      </div>
    );
  }
  return (
    <div
      className="swag-table-wrap"
      style={{
        background: "var(--odoo-surface)",
        border: "2px solid var(--odoo-border)",
        borderRadius: "var(--odoo-radius)",
        overflow: "auto",
        maxHeight: 560,
      }}
    >
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  position: "sticky",
                  top: 0,
                  background: "var(--odoo-purple)",
                  color: "#fff",
                  textAlign: c.align === "right" ? "right" : "left",
                  padding: "12px 14px",
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const qty = row.on_hand;
            const isZero = qty === 0;
            const isLow = qty > 0 && qty <= lowStockThreshold;
            const rowBg = isLow ? "#FFFBEB" : i % 2 === 0 ? "var(--odoo-surface)" : "#F9FAFB";
            return (
              <tr
                key={i}
                className="swag-row"
                style={{
                  background: rowBg,
                  borderBottom: "1px solid #F3F4F6",
                  animation: "fadeRow 0.25s ease both",
                  animationDelay: `${Math.min(i, 30) * 0.01}s`,
                }}
              >
                {columns.map((c) => {
                  const isQtyCol = c.key === "on_hand" || c.key === "qty";
                  return (
                    <td
                      key={c.key}
                      style={{
                        padding: "9px 14px",
                        textAlign: c.align === "right" ? "right" : "left",
                        color: isLow
                          ? "#92400E"
                          : isQtyCol && isZero
                          ? "var(--odoo-danger)"
                          : "var(--odoo-text)",
                        fontWeight: isQtyCol ? 700 : 500,
                        fontSize: 13,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <style>{`
        .swag-table-wrap table { border-collapse: collapse; width: 100%; }
        .swag-row:hover td { background: #EEF9FA !important; }
      `}</style>
    </div>
  );
}
