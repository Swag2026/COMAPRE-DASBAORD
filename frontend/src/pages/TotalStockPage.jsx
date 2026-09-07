import { useEffect, useState } from "react";
import { getTotalStock } from "../api/client";
import DataTable from "../components/DataTable";
import { FilterBar, FilterField, inputStyle } from "../components/FilterBar";

const columns = [
  { key: "system_name", label: "System" },
  { key: "model_code", label: "Model Code" },
  { key: "product", label: "Product" },
  { key: "sale_price", label: "Sale Price", align: "right", render: (r) => r.sale_price.toFixed(2) },
  { key: "on_hand", label: "On Hand", align: "right" },
];

export default function TotalStockPage() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTotalStock({ codes: search })
      .then((d) => setRows(d.rows))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div style={{ padding: "18px 24px" }}>
      <SectionTag>Total Stock</SectionTag>

      <FilterBar>
        <FilterField label="Search Model / Product" width={320}>
          <input
            style={inputStyle}
            placeholder="e.g. RVT196"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </FilterField>
      </FilterBar>

      <DataTable columns={columns} rows={rows} loading={loading} />
      <div style={{ marginTop: 10, fontSize: 12, color: "var(--odoo-text-muted)" }}>
        {rows.length.toLocaleString()} rows
      </div>
    </div>
  );
}

function SectionTag({ children }) {
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

export { SectionTag };
