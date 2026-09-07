import { useEffect, useMemo, useState } from "react";
import { getBranchStock } from "../api/client";
import DataTable from "../components/DataTable";
import { FilterBar, FilterField, inputStyle } from "../components/FilterBar";
import { SectionTag } from "./TotalStockPage";

const columns = [
  { key: "system_name", label: "System" },
  { key: "branch", label: "Branch" },
  { key: "model_code", label: "Model Code" },
  { key: "product", label: "Product" },
  { key: "sale_price", label: "Sale Price", align: "right", render: (r) => r.sale_price.toFixed(2) },
  { key: "on_hand", label: "On Hand", align: "right" },
];

export default function BranchStockPage() {
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selSystems, setSelSystems] = useState([]);
  const [selBranches, setSelBranches] = useState([]);
  const [minQty, setMinQty] = useState(0);

  useEffect(() => {
    setLoading(true);
    getBranchStock({})
      .then((d) => {
        setAllRows(d.rows);
        setSelSystems([...new Set(d.rows.map((r) => r.system_name))]);
      })
      .catch(() => setAllRows([]))
      .finally(() => setLoading(false));
  }, []);

  const allSystems = useMemo(
    () => [...new Set(allRows.map((r) => r.system_name))].sort(),
    [allRows]
  );
  const branchOptions = useMemo(
    () =>
      [...new Set(
        allRows.filter((r) => selSystems.includes(r.system_name)).map((r) => r.branch)
      )].sort(),
    [allRows, selSystems]
  );

  const filtered = useMemo(() => {
    let rows = allRows.filter((r) => selSystems.includes(r.system_name));
    if (selBranches.length) rows = rows.filter((r) => selBranches.includes(r.branch));
    if (minQty > 0) rows = rows.filter((r) => r.on_hand >= minQty);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          r.model_code.toLowerCase().includes(q) ||
          r.product.toLowerCase().includes(q) ||
          r.branch.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [allRows, selSystems, selBranches, minQty, search]);

  return (
    <div style={{ padding: "18px 24px" }}>
      <SectionTag>Branch-wise Stock</SectionTag>

      <FilterBar>
        <FilterField label="Company" width={240}>
          <MultiPicker
            options={allSystems}
            selected={selSystems}
            onChange={(v) => {
              setSelSystems(v);
              setSelBranches([]); // reset branch filter when company changes
            }}
          />
        </FilterField>
        <FilterField label="Select Branch(es)" width={260}>
          <MultiPicker
            options={branchOptions}
            selected={selBranches}
            onChange={setSelBranches}
            placeholder="Leave empty = All"
          />
        </FilterField>
        <FilterField label="Min Qty" width={110}>
          <input
            type="number"
            min={0}
            style={inputStyle}
            value={minQty}
            onChange={(e) => setMinQty(Number(e.target.value) || 0)}
          />
        </FilterField>
        <FilterField label="Search Model / Product" width={280}>
          <input
            style={inputStyle}
            placeholder="e.g. RVT196"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </FilterField>
      </FilterBar>

      <DataTable columns={columns} rows={filtered} loading={loading} />
      <div style={{ marginTop: 10, fontSize: 12, color: "var(--odoo-text-muted)" }}>
        Showing {filtered.length.toLocaleString()} / {allRows.length.toLocaleString()} rows
      </div>
    </div>
  );
}

function MultiPicker({ options, selected, onChange, placeholder = "" }) {
  const toggle = (opt) => {
    if (selected.includes(opt)) onChange(selected.filter((s) => s !== opt));
    else onChange([...selected, opt]);
  };
  return (
    <div
      style={{
        border: "1px solid var(--odoo-border-strong)",
        borderRadius: "var(--odoo-radius)",
        background: "#fff",
        maxHeight: 120,
        overflowY: "auto",
        padding: 6,
      }}
    >
      {options.length === 0 && (
        <div style={{ fontSize: 12, color: "var(--odoo-text-faint)", padding: 4 }}>
          {placeholder || "No options"}
        </div>
      )}
      {options.map((opt) => (
        <label
          key={opt}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12.5,
            padding: "3px 4px",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
          />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{opt}</span>
        </label>
      ))}
    </div>
  );
}
