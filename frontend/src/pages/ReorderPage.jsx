import { useEffect, useMemo, useState } from "react";
import { AlertOctagon, AlertTriangle, CheckCircle2, ShoppingCart } from "lucide-react";
import { getReorder, exportReorderCsv, exportReorderXlsx } from "../api/client";
import { useAppState } from "../api/AppStateContext";
import DataTable from "../components/DataTable";
import KpiRow from "../components/KpiRow";
import ExportButtons from "../components/ExportButtons";
import HeroHeader from "../components/HeroHeader";
import { FilterBar, FilterField, inputStyle } from "../components/FilterBar";
import { SectionTag } from "./TotalStockPage";
import { useLanguage } from "../i18n/LanguageContext";

const columns = [
  { key: "system_name", label: "System", i18nKey: "system" },
  { key: "model_code", label: "Model Code", i18nKey: "modelCode" },
  { key: "product", label: "Product", i18nKey: "product" },
  { key: "on_hand", label: "On Hand", i18nKey: "onHand", align: "right" },
  { key: "sold_30d", label: "Sold (30d)", i18nKey: "sold30d", align: "right" },
  { key: "daily_velocity", label: "Daily Vel", i18nKey: "dailyVelocity", align: "right" },
  { key: "days_left", label: "Days Left", i18nKey: "daysLeft", align: "right" },
  { key: "suggest", label: "Suggest", i18nKey: "suggest", align: "right" },
  {
    key: "priority",
    label: "Priority", i18nKey: "priority",
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
  const { t } = useLanguage();
  const localizedColumns = columns.map((column) => ({ ...column, label: column.i18nKey ? t(column.i18nKey) : column.label }));
  const { reloadKey } = useAppState();
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
  }, [targetDays, reorderPoint, reloadKey]);

  const ok = useMemo(() => rows.filter((r) => r.status === "OK"), [rows]);
  const critical = ok.filter((r) => r.priority === "Critical").length;
  const low = ok.filter((r) => r.priority === "Low").length;
  const okCount = ok.filter((r) => r.priority === "OK").length;
  const toOrder = ok.reduce((sum, r) => sum + (r.suggest || 0), 0);

  const shown = showAll ? ok : ok.filter((r) => r.priority === "Critical" || r.priority === "Low");

  return (
    <div style={{ padding: "18px 24px" }}>
      <HeroHeader title={t("reorderTitle")} subtitle={t("liveDataSubtitle")} />

      <FilterBar>
        <FilterField label={t("targetDays")} width={120}>
          <input
            type="number"
            min={1}
            style={inputStyle}
            value={targetDays}
            onChange={(e) => setTargetDays(Number(e.target.value) || 1)}
          />
        </FilterField>
        <FilterField label={t("reorderPoint")} width={140}>
          <input
            type="number"
            min={0}
            style={inputStyle}
            value={reorderPoint}
            onChange={(e) => setReorderPoint(Number(e.target.value) || 0)}
          />
        </FilterField>
        <FilterField label={t("view")} width={160}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, height: 34 }}>
            <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
            <span style={{ fontSize: 13 }}>{t("showAll")}</span>
          </label>
        </FilterField>
      </FilterBar>

      <KpiRow
        items={[
          { label: t("critical"), value: critical, icon: AlertOctagon, tone: "bad" },
          { label: t("low"), value: low, icon: AlertTriangle, tone: "warn" },
          { label: t("ok"), value: okCount, icon: CheckCircle2, tone: "good" },
          { label: t("toOrder"), value: toOrder, format: (v) => v.toLocaleString(), icon: ShoppingCart },
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
          {critical + low} {t("needReordering")}
        </div>
      )}

      <DataTable columns={localizedColumns} rows={shown} loading={loading} />
      <div style={{ marginTop: 10, fontSize: 12, color: "var(--odoo-text-muted)" }}>
        {shown.length.toLocaleString()} rows
      </div>

      <ExportButtons
        exporters={[
          {
            key: "csv", label: "CSV ↓", filename: "reorder.csv",
            fn: () => exportReorderCsv({ target_days: targetDays, reorder_point: reorderPoint }),
          },
          {
            key: "xlsx", label: "Excel ↓", filename: "reorder.xlsx",
            fn: () => exportReorderXlsx({ target_days: targetDays, reorder_point: reorderPoint }),
          },
        ]}
      />
    </div>
  );
}
