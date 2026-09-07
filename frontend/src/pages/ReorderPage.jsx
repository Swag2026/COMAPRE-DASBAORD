import { useEffect, useMemo, useState } from "react";
import { getReorder } from "../api/client";
import DataTable from "../components/DataTable";
import KpiRow from "../components/KpiRow";
import { FilterBar, FilterField, inputStyle } from "../components/FilterBar";
import { SectionTag } from "./TotalStockPage";

const columns = [
  { key: "system_name", label: "System" },
  { key: "model_code", label: "Model Code" },
  { key: "product", label: "Product" },
  { key: "on_hand", label: "On Hand", align: "right" },
  { key: "sold_30d", label: "Sold (30d)", align: "right" },
  { key: "daily_velocity", label: "Daily Vel", align: "right" },
  { key: "days_left", label: "Days Left", align: "right" },
  { key: "suggest", label: "Suggest", align: "right" },
  {
    key: "priority",
    label: "Priority",
    render: (r) => (
      <span
        style={{
          padding: "2px 8px",
          borderRadius: 10,
          fontSize: 11,
          fontWeight: 600,
          background:
            r.priority === "Critical" ? "#FDECEC" : r.priority === "Low" ? "#FDF3E3" : "#E9F7EC",
          color:
            r.priority === "Critical" ? "var(--odoo-danger)" : r.priority === "Low" ? "var(--odoo-warning)" : "var(--odoo-success)",
        }}
      >
        {r.priority}
      </span>
    ),
  },
];

export default function ReorderPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targetDays, setTargetDays] = useState(30);
  const [reorderPoint, setReorderPoint] = useState(10);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setLoading(true);
    getReorder({ targetDays, reorderPoint })
      .then((d) => setRows(d.rows))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [targetDays, reorderPoint]);

  const ok = useMemo(() => rows.filter((r) => r.status === "OK"), [rows]);
  const critical = ok.filter((r) => r.priority === "Critical").length;
  const low = ok.filter((r) => r.priority === "Low").length;
  const okCount = ok.filter((r) => r.priority === "OK").length;
  const toOrder = ok.reduce((sum, r) => sum + (r.suggest || 0), 0);

  const shown = showAll ? ok : ok.filter((r) => r.priority === "Critical" || r.priority === "Low");

  return (
    <div style={{ padding: "18px 24px" }}>
      <SectionTag>Reorder Suggestions</SectionTag>

      <FilterBar>
        <FilterField label="Target Days" width={120}>
          <input
            type="number"
            min={1}
            style={inputStyle}
            value={targetDays}
            onChange={(e) => setTargetDays(Number(e.target.value) || 1)}
          />
        </FilterField>
        <FilterField label="Reorder Point" width={140}>
          <input
            type="number"
            min={0}
            style={inputStyle}
            value={reorderPoint}
            onChange={(e) => setReorderPoint(Number(e.target.value) || 0)}
          />
        </FilterField>
        <FilterField label="View" width={160}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, height: 34 }}>
            <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
            <span style={{ fontSize: 13 }}>Show all</span>
          </label>
        </FilterField>
      </FilterBar>

      <KpiRow
        items={[
          { label: "Critical", value: critical, color: "var(--odoo-danger)" },
          { label: "Low", value: low, color: "var(--odoo-warning)" },
          { label: "OK", value: okCount, color: "var(--odoo-success)" },
          { label: "To Order", value: toOrder.toLocaleString() },
        ]}
      />

      {critical + low > 0 && (
        <div
          style={{
            background: "#FDF3E3",
            border: "1px solid #F0D8A8",
            borderRadius: "var(--odoo-radius)",
            padding: "8px 14px",
            marginBottom: 14,
            fontSize: 13,
            color: "#8A5A17",
          }}
        >
          {critical + low} products need reordering
        </div>
      )}

      <DataTable columns={columns} rows={shown} loading={loading} />
      <div style={{ marginTop: 10, fontSize: 12, color: "var(--odoo-text-muted)" }}>
        {shown.length.toLocaleString()} rows
      </div>
    </div>
  );
}
