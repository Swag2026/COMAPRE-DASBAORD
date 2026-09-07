import { useEffect, useMemo, useState } from "react";
import { getBranchStock, exportBranchCsv, exportBranchXlsx, exportBranchMatrix } from "../api/client";
import { useAppState } from "../api/AppStateContext";
import DataTable from "../components/DataTable";
import ExportButtons from "../components/ExportButtons";
import KpiRow from "../components/KpiRow";
import BranchQtyChart from "../components/BranchQtyChart";
import { FilterBar, FilterField, inputStyle } from "../components/FilterBar";
import { SectionTag } from "./TotalStockPage";

const ROW_CAP = 200; // same cap the original Streamlit table used — keeps the table snappy

const columns = [
  { key: "system_name", label: "System" },
  { key: "branch", label: "Branch" },
  { key: "model_code", label: "Model Code" },
  { key: "product", label: "Product" },
  { key: "sale_price", label: "Sale Price", align: "right", render: (r) => r.sale_price.toFixed(2) },
  { key: "on_hand", label: "On Hand", align: "right" },
];

export default function BranchStockPage() {
  const { reloadKey, lowStockThreshold } = useAppState();
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selSystems, setSelSystems] = useState([]);
  const [selBranches, setSelBranches] = useState([]);
  const [minQty, setMinQty] = useState(0);
  const [qtyRange, setQtyRange] = useState(null); // [min, max] or null = no range filter applied yet

  useEffect(() => {
    setLoading(true);
    getBranchStock({})
      .then((d) => {
        setAllRows(d.rows);
        setSelSystems([...new Set(d.rows.map((r) => r.system_name))]);
        setQtyRange(null);
      })
      .catch(() => setAllRows([]))
      .finally(() => setLoading(false));
  }, [reloadKey]);

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

  // Filters applied before the qty-range slider bounds are computed
  // (Company / Branch / Min Qty / search) — mirrors the original's two-stage filtering.
  const preRange = useMemo(() => {
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

  const qtyBounds = useMemo(() => {
    if (preRange.length === 0) return [0, 0];
    const vals = preRange.map((r) => r.on_hand);
    return [Math.min(...vals), Math.max(...vals)];
  }, [preRange]);

  const filtered = useMemo(() => {
    if (!qtyRange) return preRange;
    const [lo, hi] = qtyRange;
    return preRange.filter((r) => r.on_hand >= lo && r.on_hand <= hi);
  }, [preRange, qtyRange]);

  const displayRows = filtered.slice(0, ROW_CAP);

  const branchesSelectedCount = selBranches.length;
  const totalUnits = filtered.reduce((sum, r) => sum + r.on_hand, 0);
  const modelsCount = new Set(filtered.map((r) => r.model_code)).size;

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
              setSelBranches([]);
              setQtyRange(null);
            }}
          />
        </FilterField>
        <FilterField label="Select Branch(es)" width={260}>
          <MultiPicker
            options={branchOptions}
            selected={selBranches}
            onChange={(v) => {
              setSelBranches(v);
              setQtyRange(null);
            }}
            placeholder="Leave empty = All"
          />
        </FilterField>
        <FilterField label="Min Qty" width={110}>
          <input
            type="number"
            min={0}
            style={inputStyle}
            value={minQty}
            onChange={(e) => {
              setMinQty(Number(e.target.value) || 0);
              setQtyRange(null);
            }}
          />
        </FilterField>
        <FilterField label="Search Model / Product" width={280}>
          <input
            style={inputStyle}
            placeholder="e.g. RVT196"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setQtyRange(null);
            }}
          />
        </FilterField>
      </FilterBar>

      {qtyBounds[1] > qtyBounds[0] && (
        <FilterBar>
          <FilterField label="Qty Range — min" width={140}>
            <input
              type="number"
              style={inputStyle}
              min={qtyBounds[0]}
              max={qtyBounds[1]}
              value={qtyRange ? qtyRange[0] : qtyBounds[0]}
              onChange={(e) =>
                setQtyRange([Number(e.target.value) || 0, qtyRange ? qtyRange[1] : qtyBounds[1]])
              }
            />
          </FilterField>
          <FilterField label="Qty Range — max" width={140}>
            <input
              type="number"
              style={inputStyle}
              min={qtyBounds[0]}
              max={qtyBounds[1]}
              value={qtyRange ? qtyRange[1] : qtyBounds[1]}
              onChange={(e) =>
                setQtyRange([qtyRange ? qtyRange[0] : qtyBounds[0], Number(e.target.value) || 0])
              }
            />
          </FilterField>
        </FilterBar>
      )}

      {branchesSelectedCount > 0 && filtered.length > 0 && (
        <KpiRow
          items={[
            { label: "Branches", value: branchesSelectedCount },
            { label: "Total Units", value: totalUnits.toLocaleString() },
            { label: "Models", value: modelsCount.toLocaleString() },
          ]}
        />
      )}

      <DataTable columns={columns} rows={displayRows} loading={loading} lowStockThreshold={lowStockThreshold} />
      <div style={{ marginTop: 10, fontSize: 12, color: "var(--odoo-text-muted)" }}>
        Showing {Math.min(filtered.length, ROW_CAP).toLocaleString()} / {filtered.length.toLocaleString()} rows
      </div>

      <ExportButtons
        exporters={[
          { key: "csv", label: "CSV ↓", filename: "branch_stock.csv", fn: () => exportBranchCsv(search) },
          { key: "xlsx", label: "Excel ↓", filename: "branch_stock.xlsx", fn: () => exportBranchXlsx(search) },
          { key: "matrix", label: "Matrix ↓", filename: "branch_matrix.xlsx", fn: () => exportBranchMatrix(search) },
        ]}
      />

      <div
        style={{
          background: "var(--odoo-surface)",
          border: "1px solid var(--odoo-border)",
          borderRadius: "var(--odoo-radius)",
          padding: 14,
          marginTop: 14,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Qty by Branch</div>
        <BranchQtyChart rows={preRange} />
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
