import { useEffect, useMemo, useState } from "react";
import { Truck, Package, Building2 } from "lucide-react";
import { getTransfers, exportTransfersCsv, exportTransfersXlsx } from "../api/client";
import { useAppState } from "../api/AppStateContext";
import DataTable from "../components/DataTable";
import KpiRow from "../components/KpiRow";
import ExportButtons from "../components/ExportButtons";
import HeroHeader from "../components/HeroHeader";
import { SectionTag } from "./TotalStockPage";
import { useLanguage } from "../i18n/LanguageContext";

const columns = [
  { key: "system_name", label: "System", i18nKey: "system" },
  { key: "reference", label: "Reference", i18nKey: "reference" },
  { key: "type", label: "Type", i18nKey: "type" },
  { key: "state", label: "State", i18nKey: "state" },
  { key: "from_loc", label: "From", i18nKey: "from" },
  { key: "to_loc", label: "To", i18nKey: "to" },
  { key: "model_code", label: "Model Code", i18nKey: "modelCode" },
  { key: "qty", label: "Qty", i18nKey: "totalQty", align: "right" },
  { key: "scheduled", label: "Scheduled", i18nKey: "scheduled" },
];

export default function TransfersPage() {
  const { t } = useLanguage();
  const localizedColumns = columns.map((column) => ({ ...column, label: column.i18nKey ? t(column.i18nKey) : column.label }));
  const { reloadKey } = useAppState();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTransfers()
      .then((d) => setRows(d.rows))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [reloadKey]);

  const ok = useMemo(() => rows.filter((r) => r.status === "OK"), [rows]);
  const totalQty = ok.reduce((sum, r) => sum + (r.qty || 0), 0);
  const systemsCount = new Set(ok.map((r) => r.system_name)).size;

  return (
    <div style={{ padding: "18px 24px" }}>
      <HeroHeader title={t("pendingTransfers")} subtitle={t("liveDataSubtitle")} />

      {ok.length > 0 && (
        <KpiRow
          items={[
            { label: t("total"), value: ok.length, icon: Truck },
            { label: t("totalQty"), value: totalQty, format: (v) => v.toLocaleString(), icon: Package },
            { label: t("systems"), value: systemsCount, icon: Building2 },
          ]}
        />
      )}

      <DataTable columns={localizedColumns} rows={ok} loading={loading} />
      <div style={{ marginTop: 10, fontSize: 12, color: "var(--odoo-text-muted)" }}>
        {ok.length.toLocaleString()} rows
      </div>

      <ExportButtons
        exporters={[
          { key: "csv", label: "CSV ↓", filename: "transfers.csv", fn: () => exportTransfersCsv() },
          { key: "xlsx", label: "Excel ↓", filename: "transfers.xlsx", fn: () => exportTransfersXlsx() },
        ]}
      />
    </div>
  );
}
