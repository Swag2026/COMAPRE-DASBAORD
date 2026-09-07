export default function DataTable({ columns, rows, loading, emptyText = "No data for selected filters." }) {
  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--odoo-text-muted)" }}>
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
          border: "1px solid var(--odoo-border)",
          borderRadius: "var(--odoo-radius)",
        }}
      >
        {emptyText}
      </div>
    );
  }
  return (
    <div
      style={{
        background: "var(--odoo-surface)",
        border: "1px solid var(--odoo-border)",
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
                  padding: "9px 12px",
                  fontSize: 11.5,
                  fontWeight: 600,
                  letterSpacing: 0.3,
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
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{
                background: i % 2 === 0 ? "var(--odoo-surface)" : "#FAFAFC",
                borderBottom: "1px solid var(--odoo-border)",
              }}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  style={{
                    padding: "8px 12px",
                    textAlign: c.align === "right" ? "right" : "left",
                    color: c.key === "on_hand" && row[c.key] === 0
                      ? "var(--odoo-danger)"
                      : "var(--odoo-text)",
                    fontWeight: c.key === "on_hand" ? 600 : 400,
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
