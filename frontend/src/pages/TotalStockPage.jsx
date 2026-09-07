import { useEffect, useState } from "react";
import { getTotalStock, exportTotalCsv, exportTotalXlsx } from "../api/client";
import { useAppState } from "../api/AppStateContext";
import DataTable from "../components/DataTable";
import ExportButtons from "../components/ExportButtons";
import FileUploadSearch from "../components/FileUploadSearch";
import WhatsAppShare from "../components/WhatsAppShare";
import { ValueBySystemChart, Top10ValueChart } from "../components/TotalStockCharts";
import { FilterBar, FilterField, inputStyle } from "../components/FilterBar";

const columns = [
  { key: "system_name", label: "System" },
  { key: "model_code", label: "Model Code" },
  { key: "product", label: "Product" },
  { key: "sale_price", label: "Sale Price", align: "right", render: (r) => r.sale_price.toFixed(2) },
  { key: "on_hand", label: "On Hand", align: "right" },
];

export default function TotalStockPage() {
  const { reloadKey, lowStockThreshold } = useAppState();
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTotalStock({ codes: search })
      .then((d) => setRows(d.rows))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [search, reloadKey]);

  return (
    <div style={{ padding: "18px 24px" }}>
      <SectionTag>Total Stock</SectionTag>

      <FilterBar>
        <FilterField label="Search Model / Product" width={320}>
          <input
            style={inputStyle}
            placeholder="e.g. RVT196 (comma-separated for many)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </FilterField>
        <FilterField label="Search by Invoice PDF / Excel" width={260}>
          <FileUploadSearch onCodesExtracted={(codes) => setSearch(codes.join(","))} />
        </FilterField>
      </FilterBar>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginBottom: 14,
        }}
      >
        <ChartCard title="Stock Value by System">
          <ValueBySystemChart rows={rows} />
        </ChartCard>
        <ChartCard title="Top 10 Models by Stock Value">
          <Top10ValueChart rows={rows} />
        </ChartCard>
      </div>

      <DataTable columns={columns} rows={rows} loading={loading} lowStockThreshold={lowStockThreshold} />
      <div style={{ marginTop: 10, fontSize: 12, color: "var(--odoo-text-muted)" }}>
        {rows.length.toLocaleString()} rows
      </div>

      <ExportButtons
        exporters={[
          { key: "csv", label: "CSV ↓", filename: "total_stock.csv", fn: () => exportTotalCsv(search) },
          { key: "xlsx", label: "Excel ↓", filename: "total_stock.xlsx", fn: () => exportTotalXlsx(search) },
        ]}
      />

      <WhatsAppShare rows={rows} title="Total Stock Report" />
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div
      style={{
        background: "var(--odoo-surface)",
        border: "1px solid var(--odoo-border)",
        borderRadius: "var(--odoo-radius)",
        padding: 14,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
}

export function SectionTag({ children }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        color: "var(--odoo-purple)",
        borderLeft: "3px solid var(--odoo-purple)",
        paddingLeft: 8,
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  );
}
