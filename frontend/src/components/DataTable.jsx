import { useMemo, useRef, useState } from "react";
import SkeletonRows from "./SkeletonRows";
import RowDetailDrawer from "./RowDetailDrawer";
import { useLanguage } from "../i18n/LanguageContext";

export default function DataTable({
  columns, rows, loading,
  emptyText = "No data for selected filters.",
  lowStockThreshold = 0,
}) {
  const { t } = useLanguage();
  emptyText = emptyText === "No data for selected filters." ? t("noDataFilters") : emptyText;
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
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
      <div style={{ background: "var(--odoo-surface)", border: "1px solid var(--odoo-border)", borderRadius: "var(--odoo-radius)", overflow: "hidden" }}>
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
          border: "1px solid var(--odoo-border)",
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
      <div ref={wrapRef} className="table-wrap swag-table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((c) => {
                const isSorted = sortKey === c.key;
                return (
                  <th
                    key={c.key}
                    onClick={() => toggleSort(c.key)}
                    className={`sortable${isSorted ? " sort-active" : ""}`}
                    title="Click to sort"
                  >
                    {c.label}
                    <span className="sort-arrow">{isSorted ? (sortDir === "asc" ? "▲" : "▼") : "↕"}</span>
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
              return (
                <tr
                  key={i}
                  className="swag-row"
                  onClick={() => setSelectedRow(row)}
                  style={{ animationDelay: `${Math.min(i, 30) * 0.01}s` }}
                >
                  {columns.map((c) => {
                    const isQtyCol = c.key === "on_hand" || c.key === "qty";
                    return (
                      <td
                        key={c.key}
                        className={c.align === "right" ? "right" : ""}
                      >
                        {isQtyCol ? (
                          <span
                            style={
                              isZero || isLow
                                ? {
                                    display: "inline-block",
                                    minWidth: 28,
                                    padding: "2px 9px",
                                    borderRadius: 999,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    background: isZero ? "#FBE8E4" : "#FBF0DB",
                                    color: isZero ? "#A93226" : "#B5842A",
                                  }
                                : undefined
                            }
                          >
                            {c.render ? c.render(row) : row[c.key]}
                          </span>
                        ) : (
                          c.render ? c.render(row) : row[c.key]
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <style>{`
          .swag-row:hover td { background: var(--odoo-bg) !important; }
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
