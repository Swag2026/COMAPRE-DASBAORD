import { useEffect, useMemo, useState } from "react";
import { getTransfers, exportTransfersCsv, exportTransfersXlsx } from "../api/client";
import { useAppState } from "../api/AppStateContext";
import DataTable from "../components/DataTable";
import KpiRow from "../components/KpiRow";
import ExportButtons from "../components/ExportButtons";
import HeroHeader from "../components/HeroHeader";
import { SectionTag } from "./TotalStockPage";

const columns = [
  { key: "system_name", label: "System" },
  { key: "reference", label: "Reference" },
  { key: "type", label: "Type" },
  { key: "state", label: "State" },
  { key: "from_loc", label: "From" },
  { key: "to_loc", label: "To" },
  { key: "model_code", label: "Model Code" },
  { key: "qty", label: "Qty", align: "right" },
  { key: "scheduled", label: "Scheduled" },
];

export default function TransfersPage() {
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
      <HeroHeader title="Pending Transfers" subtitle="SWAG Dashboard · Live Odoo Data" />

      {ok.length > 0 && (
        <KpiRow
          items={[
            { label: "Total", value: ok.length },
            { label: "Total Qty", value: totalQty, format: (v) => v.toLocaleString() },
            { label: "Systems", value: systemsCount },
          ]}
        />
      )}

      <DataTable columns={columns} rows={ok} loading={loading} />
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
