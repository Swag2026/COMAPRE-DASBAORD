import { useMemo, useRef, useState } from "react";
import SkeletonRows from "./SkeletonRows";
import RowDetailDrawer from "./RowDetailDrawer";

export default function DataTable({
  columns, rows, loading,
  emptyText = "No data for selected filters.",
  lowStockThreshold = 0,
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [scrolled, setScrolled] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const wrapRef = useRef(null);

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      let cmp;
      if (typeof av === "number" && typeof bv === "number") cmp = av - bv;
      else cmp = String(av ?? "").localeCompare(String(bv ?? ""));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  if (loading) {
    return (
      <div style={{ background: "var(--odoo-surface)", border: "2px solid var(--odoo-border)", borderRadius: "var(--odoo-radius)", overflow: "hidden" }}>
        <SkeletonRows columns={columns} />
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          color: "var(--odoo-text-muted)",
          background: "var(--odoo-surface)",
          border: "2px solid var(--odoo-border)",
          borderRadius: "var(--odoo-radius)",
        }}
      >
        <EmptyBoxIcon />
        <div style={{ marginTop: 10 }}>{emptyText}</div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={wrapRef}
        className="swag-table-wrap"
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 2)}
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
              {columns.map((c) => {
                const isSorted = sortKey === c.key;
                return (
                  <th
                    key={c.key}
                    onClick={() => toggleSort(c.key)}
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
                      cursor: "pointer",
                      userSelect: "none",
                      boxShadow: scrolled ? "0 4px 10px rgba(0,0,0,0.18)" : "none",
                      transition: "box-shadow 0.15s",
                    }}
                    title="Click to sort"
                  >
                    {c.label}
                    {isSorted && <span style={{ marginLeft: 5 }}>{sortDir === "asc" ? "▲" : "▼"}</span>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, i) => {
              const qty = row.on_hand;
              const isZero = qty === 0;
              const isLow = qty > 0 && qty <= lowStockThreshold;
              const rowBg = isLow ? "#FFFBEB" : i % 2 === 0 ? "var(--odoo-surface)" : "#F9FAFB";
              return (
                <tr
                  key={i}
                  className="swag-row"
                  onClick={() => setSelectedRow(row)}
                  style={{
                    background: rowBg,
                    borderBottom: "1px solid #F3F4F6",
                    animation: "fadeRow 0.25s ease both",
                    animationDelay: `${Math.min(i, 30) * 0.01}s`,
                    cursor: "pointer",
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

      <RowDetailDrawer row={selectedRow} columns={columns} onClose={() => setSelectedRow(null)} />
    </>
  );
}

function EmptyBoxIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ margin: "0 auto" }}>
      <path d="M8 20 L28 10 L48 20 L48 40 L28 50 L8 40 Z" stroke="var(--odoo-border-strong)" strokeWidth="1.5" fill="none" />
      <path d="M8 20 L28 30 L48 20" stroke="var(--odoo-border-strong)" strokeWidth="1.5" />
      <path d="M28 30 L28 50" stroke="var(--odoo-border-strong)" strokeWidth="1.5" />
    </svg>
  );
}
