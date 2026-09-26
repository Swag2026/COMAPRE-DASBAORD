import { useEffect, useMemo, useState } from "react";
import { List, Wifi, Package, Tag, Wallet, AlertTriangle, Building2, Layers } from "lucide-react";
import {
  getSystems, getSystemsHealth, getTotalStock, getBranchStock,
  exportTotalCsv, exportTotalXlsx,
  exportBranchCsv, exportBranchXlsx, exportBranchMatrix,
} from "../api/client";
import { useAppState } from "../api/AppStateContext";
import DataTable from "../components/DataTable";
import ExportButtons from "../components/ExportButtons";
import KpiRow from "../components/KpiRow";
import ChartCard from "../components/ChartCard";
import HeroHeader from "../components/HeroHeader";
import BranchQtyChart from "../components/BranchQtyChart";
import { ValueBySystemChart, Top10ValueChart } from "../components/TotalStockCharts";
import PdfUploadPanel from "../components/PdfUploadPanel";
import ExcelUploadPanel from "../components/ExcelUploadPanel";
import StockValueDonutCard from "../components/StockValueDonutCard";
import WhatsAppShare from "../components/WhatsAppShare";
import ChipMultiSelect from "../components/ChipMultiSelect";
import SizePivotTable, { buildSizePivot } from "../components/SizePivotTable";
import Spinner from "../components/Spinner";
import { useToast } from "../api/ToastContext";
import { useLanguage } from "../i18n/LanguageContext";
import { FilterBar, FilterField, inputStyle } from "../components/FilterBar";

const ROW_CAP = 200;

const TOTAL_COLUMNS = [
  { key: "system_name", label: "System", i18nKey: "system" },
  { key: "model_code", label: "Model Code", i18nKey: "modelCode" },
  { key: "product", label: "Product", i18nKey: "product" },
  { key: "sale_price", label: "Sale Price", i18nKey: "salePrice", align: "right", render: (r) => r.sale_price.toFixed(2) },
  { key: "purchase_qty", label: "Purchase Qty", i18nKey: "purchaseQty", align: "right" },
  { key: "on_hand", label: "On Hand", i18nKey: "onHand", align: "right" },
];

const BRANCH_COLUMNS = [
  { key: "system_name", label: "System", i18nKey: "system" },
  { key: "branch", label: "Branch", i18nKey: "branchStock" },
  { key: "model_code", label: "Model Code", i18nKey: "modelCode" },
  { key: "product", label: "Product", i18nKey: "product" },
  { key: "sale_price", label: "Sale Price", i18nKey: "salePrice", align: "right", render: (r) => r.sale_price.toFixed(2) },
  { key: "on_hand", label: "On Hand", i18nKey: "onHand", align: "right" },
];

function localizedColumns(columns, t) {
  return columns.map((column) => ({ ...column, label: column.i18nKey ? t(column.i18nKey) : column.label }));
}

export default function ProductComparisonPage() {
  const { reloadKey, lowStockThreshold, exactMatch, setLastRun } = useAppState();

  const [allSystems, setAllSystems] = useState([]); // [{key,name}]
  const [health, setHealth] = useState({}); // name -> bool
  const [selectedSystems, setSelectedSystems] = useState([]);
  const [search, setSearch] = useState("");
  const [multiMode, setMultiMode] = useState(false);
  const [activeTab, setActiveTab] = useState("total");
  const [totalRows, setTotalRows] = useState(null); // null = not compared yet
  const [branchRows, setBranchRows] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSystems()
      .then((s) => {
        setAllSystems(s);
        setSelectedSystems(s.map((x) => x.name));
      })
      .catch(() => {});
    getSystemsHealth()
      .then((h) => {
        const m = {};
        h.forEach((x) => (m[x.name] = x.online));
        setHealth(m);
      })
      .catch(() => {});
  }, []);

  const { showToast } = useToast();

  async function runCompare(overrideSearch) {
    const codesToUse = overrideSearch !== undefined ? overrideSearch : search;
    setLoading(true);
    try {
      const [t, b] = await Promise.all([
        getTotalStock({ codes: codesToUse, exact: exactMatch }),
        getBranchStock({ codes: codesToUse, exact: exactMatch }),
      ]);
      setTotalRows(t.rows);
      setBranchRows(b.rows);
      setLastRun(new Date().toLocaleTimeString());
      showToast(t("comparisonUpdated"), "success");
    } catch {
      setTotalRows([]);
      setBranchRows([]);
      showToast(t("compareFailed"), "error");
    } finally {
      setLoading(false);
    }
  }

  // Reload Data button re-runs the same comparison, only if one has already run
  useEffect(() => {
    if (totalRows !== null) runCompare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey]);

  const filteredTotal = useMemo(
    () => (totalRows || []).filter((r) => selectedSystems.includes(r.system_name)),
    [totalRows, selectedSystems]
  );
  const filteredBranch = useMemo(
    () => (branchRows || []).filter((r) => selectedSystems.includes(r.system_name)),
    [branchRows, selectedSystems]
  );

  const ok = filteredTotal.filter((r) => r.status === "OK");
  const onlineCount = allSystems.filter((s) => health[s.name]).length;
  const totalQty = ok.reduce((s, r) => s + r.on_hand, 0);
  const nonZeroPrices = ok.filter((r) => r.sale_price > 0).map((r) => r.sale_price);
  const avgPrice = nonZeroPrices.length
    ? Math.round(nonZeroPrices.reduce((a, b) => a + b, 0) / nonZeroPrices.length)
    : 0;
  const stockValue = ok.reduce((s, r) => s + r.sale_price * r.on_hand, 0);
  const zeroStockItems = ok.filter((r) => r.on_hand === 0).length;
  const lowStockItems = ok.filter((r) => r.on_hand > 0 && r.on_hand <= lowStockThreshold);

  const compared = totalRows !== null;
  const { t } = useLanguage();

  return (
    <div style={{ padding: "18px 24px" }}>
      <HeroHeader title={t("heroTitle")} subtitle={t("heroSubtitle")} />

      <FilterBar sticky>
        <FilterField label={t("companyLabel")} width={280}>
          <ChipMultiSelect
            options={allSystems.map((s) => s.name)}
            selected={selectedSystems}
            onChange={setSelectedSystems}
            placeholder={t("selectCompanies")}
          />
        </FilterField>
        <FilterField label={t("modeLabel")} width={200}>
          <div style={{ display: "flex", gap: 14, height: 34, alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5 }}>
              <input type="radio" checked={!multiMode} onChange={() => setMultiMode(false)} /> {t("singleModel")}
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5 }}>
              <input type="radio" checked={multiMode} onChange={() => setMultiMode(true)} /> {t("multipleModels")}
            </label>
          </div>
        </FilterField>
        {!multiMode ? (
          <FilterField label={t("searchLabel")} width={280}>
            <input
              style={inputStyle}
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </FilterField>
        ) : (
          <FilterField label={t("codesMany")} width={320}>
            <textarea
              style={{ ...inputStyle, height: 68, resize: "vertical", paddingTop: 6 }}
              placeholder={t("codesPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value.replace(/\n/g, ","))}
            />
          </FilterField>
        )}
      </FilterBar>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
        <PdfUploadPanel onSearch={(codes, tab) => { setSearch(codes); setActiveTab(tab); runCompare(codes); }} />
        <ExcelUploadPanel onSearch={(codes, tab) => { setSearch(codes); setActiveTab(tab); runCompare(codes); }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => runCompare()} disabled={loading} style={compareBtnStyle}>
          {loading ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Spinner size={15} color="#fff" /> {t("comparing")}
            </span>
          ) : (
            <>{t("compareBtn")} <span className="rtl-flip">→</span></>
          )}
        </button>
        <div style={{ display: "flex", gap: 14, fontSize: 12 }}>
          {allSystems.map((s) => (
            <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: health[s.name] ? "var(--odoo-success)" : "var(--odoo-text-faint)",
                }}
              />
              <span style={{ color: "var(--odoo-text-muted)" }}>{s.name}</span>
              <span style={{ fontWeight: 600, color: health[s.name] ? "var(--odoo-success)" : "var(--odoo-danger)" }}>
                {health[s.name] ? t("online") : t("offline")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {!compared && !loading && (
        <div
          style={{
            padding: 40,
            textAlign: "center",
            color: "var(--odoo-text-muted)",
            background: "var(--odoo-surface)",
            border: "2px dashed var(--odoo-border-strong)",
            borderRadius: "var(--odoo-radius)",
          }}
        >
        {t("readyHint")} <b>{t("compareBtn")} →</b>.
        </div>
      )}

      {compared && (
        <>
          {lowStockItems.length > 0 && (
            <div
              style={{
                background: "#FFFBEB",
                border: "1px solid #F0D8A8",
                borderRadius: "var(--odoo-radius)",
                padding: "10px 16px",
                marginBottom: 14,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 13, color: "#92400E", marginBottom: 4 }}>
                {t("lowStockAlert")} — {lowStockItems.length} {t("items")} ≤ {lowStockThreshold}
              </div>
              {lowStockItems.slice(0, 5).map((r) => (
                <div key={r.system_name + r.model_code} style={{ fontSize: 12, color: "#92400E" }}>
                  {r.model_code} {t("at")} {r.system_name} ({r.on_hand})
                </div>
              ))}
            </div>
          )}

          <KpiRow
            items={[
              { label: t("kpiTotalRows"), value: filteredTotal.length, format: (v) => v.toLocaleString(), icon: List },
              { label: t("kpiSystemsOnline"), value: onlineCount, format: (v) => `${v}/${allSystems.length}`, icon: Wifi, tone: "good" },
              { label: t("kpiTotalQty"), value: totalQty, format: (v) => v.toLocaleString(), icon: Package },
              { label: `${t("kpiAvgPrice")} (SAR)`, value: avgPrice, format: (v) => v.toLocaleString(), icon: Tag },
              { label: `${t("kpiStockValue")} (SAR)`, value: stockValue, format: (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toFixed(0)), icon: Wallet },
              { label: t("kpiZeroStock"), value: zeroStockItems, icon: AlertTriangle, tone: zeroStockItems > 0 ? "bad" : "default" },
            ]}
          />

          {/* Tab strip */}
          <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--odoo-border)", marginBottom: 16 }}>
            {[
              { key: "total", label: t("totalStock") },
              { key: "branch", label: t("branchStock") },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "10px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === tab.key ? "2px solid var(--odoo-purple)" : "2px solid transparent",
                  color: activeTab === tab.key ? "var(--odoo-purple)" : "var(--odoo-text-muted)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "total" && (
            <TotalStockTab rows={filteredTotal} loading={loading} search={search} lowStockThreshold={lowStockThreshold} />
          )}
          {activeTab === "branch" && (
            <BranchStockTab rows={filteredBranch} loading={loading} search={search} lowStockThreshold={lowStockThreshold} />
          )}
        </>
      )}
    </div>
  );
}

function TotalStockTab({ rows, loading, search, lowStockThreshold }) {
  const { t } = useLanguage();
  const totalColumns = useMemo(() => localizedColumns(TOTAL_COLUMNS, t), [t]);
  const [sizeView, setSizeView] = useState(false);
  const [subSystems, setSubSystems] = useState(null); // null = not initialized yet
  const [subSearch, setSubSearch] = useState("");
  const [sortBy, setSortBy] = useState("—");
  const [qtyRange, setQtyRange] = useState(null);

  const allSubSystems = useMemo(() => [...new Set(rows.map((r) => r.system_name))].sort(), [rows]);
  // initialize sub-filter to "all" the first time rows show up
  const effectiveSubSystems = subSystems === null ? allSubSystems : subSystems;

  const preRange = useMemo(() => {
    let out = rows.filter((r) => effectiveSubSystems.includes(r.system_name));
    if (subSearch.trim()) {
      const q = subSearch.trim().toLowerCase();
      out = out.filter((r) => r.model_code.toLowerCase().includes(q) || r.product.toLowerCase().includes(q));
    }
    return out;
  }, [rows, effectiveSubSystems, subSearch]);

  const qtyBounds = useMemo(() => {
    if (preRange.length === 0) return [0, 0];
    const vals = preRange.map((r) => r.on_hand);
    return [Math.min(...vals), Math.max(...vals)];
  }, [preRange]);

  const rangeFiltered = useMemo(() => {
    if (!qtyRange) return preRange;
    const [lo, hi] = qtyRange;
    return preRange.filter((r) => r.on_hand >= lo && r.on_hand <= hi);
  }, [preRange, qtyRange]);

  const sortableCols = TOTAL_COLUMNS.map((c) => c.key);
  const filtered = useMemo(() => {
    if (sortBy === "—") return rangeFiltered;
    const copy = [...rangeFiltered];
    copy.sort((a, b) => {
      const av = a[sortBy], bv = b[sortBy];
      if (typeof av === "number" && typeof bv === "number") return av - bv;
      return String(av).localeCompare(String(bv));
    });
    return copy;
  }, [rangeFiltered, sortBy]);

  const displayRows = filtered.slice(0, ROW_CAP);
  const sizePivot = useMemo(() => (sizeView ? buildSizePivot(filtered) : null), [sizeView, filtered]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, cursor: "pointer", fontWeight: 600 }}>
          <input type="checkbox" checked={sizeView} onChange={(e) => setSizeView(e.target.checked)} />
          {t("sizeView")}
        </label>
      </div>

      <FilterBar>
        <FilterField label={t("company")} width={240}>
          <ChipMultiSelect
            options={allSubSystems}
            selected={effectiveSubSystems}
            onChange={setSubSystems}
            placeholder={t("selectCompanies")}
          />
        </FilterField>
        <FilterField label={t("searchModelProduct")} width={240}>
          <input
            style={inputStyle}
            placeholder="e.g. XP6013"
            value={subSearch}
            onChange={(e) => setSubSearch(e.target.value)}
          />
        </FilterField>
        {!sizeView && (
        <FilterField label={t("sortBy")} width={160}>
            <select style={inputStyle} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="—">—</option>
              {sortableCols.map((c) => (
                <option key={c} value={c}>
                  {totalColumns.find((tc) => tc.key === c)?.label}
                </option>
              ))}
            </select>
          </FilterField>
        )}
      </FilterBar>

      {!sizeView && qtyBounds[1] > qtyBounds[0] && (
        <FilterBar>
          <FilterField label={t("qtyRangeMin")} width={140}>
            <input
              type="number"
              style={inputStyle}
              min={qtyBounds[0]}
              max={qtyBounds[1]}
              value={qtyRange ? qtyRange[0] : qtyBounds[0]}
              onChange={(e) => setQtyRange([Number(e.target.value) || 0, qtyRange ? qtyRange[1] : qtyBounds[1]])}
            />
          </FilterField>
          <FilterField label={t("qtyRangeMax")} width={140}>
            <input
              type="number"
              style={inputStyle}
              min={qtyBounds[0]}
              max={qtyBounds[1]}
              value={qtyRange ? qtyRange[1] : qtyBounds[1]}
              onChange={(e) => setQtyRange([qtyRange ? qtyRange[0] : qtyBounds[0], Number(e.target.value) || 0])}
            />
          </FilterField>
        </FilterBar>
      )}

      {!sizeView && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
          <ChartCard title={t("stockValueBySystem")}>
            <ValueBySystemChart rows={filtered} />
          </ChartCard>
          <ChartCard title={t("top10Models")}>
            <Top10ValueChart rows={filtered} />
          </ChartCard>
          <ChartCard title={t("stockValueSplit")}>
            <StockValueDonutCard rows={filtered} title="" />
          </ChartCard>
        </div>
      )}

      {sizeView ? (
        <SizePivotTable pivot={sizePivot} threshold={lowStockThreshold} />
      ) : (
        <>
          <DataTable columns={totalColumns} rows={displayRows} loading={loading} lowStockThreshold={lowStockThreshold} />
          <div style={{ marginTop: 10, fontSize: 12, color: "var(--odoo-text-muted)" }}>
            {t("showing")} {Math.min(filtered.length, ROW_CAP).toLocaleString()} / {filtered.length.toLocaleString()} {t("rows")}
          </div>
        </>
      )}

      <ExportButtons
        exporters={[
          { key: "csv", label: "CSV ↓", filename: "total_stock.csv", fn: () => exportTotalCsv(search) },
          { key: "xlsx", label: "Excel ↓", filename: "total_stock.xlsx", fn: () => exportTotalXlsx(search) },
        ]}
      />

      {!sizeView && <WhatsAppShare rows={filtered} title="Total Stock Report" />}
    </div>
  );
}

function BranchStockTab({ rows, loading, search, lowStockThreshold }) {
  const { t } = useLanguage();
  const branchColumns = useMemo(() => localizedColumns(BRANCH_COLUMNS, t), [t]);
  const [selBranches, setSelBranches] = useState([]);
  const [minQty, setMinQty] = useState(0);

  const branchOptions = useMemo(() => [...new Set(rows.map((r) => r.branch))].sort(), [rows]);

  const filtered = useMemo(() => {
    let out = rows;
    if (selBranches.length) out = out.filter((r) => selBranches.includes(r.branch));
    if (minQty > 0) out = out.filter((r) => r.on_hand >= minQty);
    return out;
  }, [rows, selBranches, minQty]);

  const displayRows = filtered.slice(0, ROW_CAP);
  const totalUnits = filtered.reduce((s, r) => s + r.on_hand, 0);
  const modelsCount = new Set(filtered.map((r) => r.model_code)).size;

  return (
    <div>
      <FilterBar>
        <FilterField label={t("selectBranches")} width={260}>
          <BranchPicker options={branchOptions} selected={selBranches} onChange={setSelBranches} />
        </FilterField>
        <FilterField label={t("minQty")} width={110}>
          <input
            type="number"
            min={0}
            style={inputStyle}
            value={minQty}
            onChange={(e) => setMinQty(Number(e.target.value) || 0)}
          />
        </FilterField>
      </FilterBar>

      {selBranches.length > 0 && filtered.length > 0 && (
        <KpiRow
          items={[
            { label: t("branches"), value: selBranches.length, icon: Building2 },
            { label: t("totalUnits"), value: totalUnits, format: (v) => v.toLocaleString(), icon: Package },
            { label: t("models"), value: modelsCount, format: (v) => v.toLocaleString(), icon: Layers },
          ]}
        />
      )}

      <DataTable columns={branchColumns} rows={displayRows} loading={loading} lowStockThreshold={lowStockThreshold} />
      <div style={{ marginTop: 10, fontSize: 12, color: "var(--odoo-text-muted)" }}>
        {t("showing")} {Math.min(filtered.length, ROW_CAP).toLocaleString()} / {filtered.length.toLocaleString()} {t("rows")}
      </div>

      <ExportButtons
        exporters={[
          { key: "csv", label: "CSV ↓", filename: "branch_stock.csv", fn: () => exportBranchCsv(search) },
          { key: "xlsx", label: "Excel ↓", filename: "branch_stock.xlsx", fn: () => exportBranchXlsx(search) },
          { key: "matrix", label: "Matrix ↓", filename: "branch_matrix.xlsx", fn: () => exportBranchMatrix(search) },
        ]}
      />

      <div style={{ marginTop: 14 }}>
        <ChartCard title={t("qtyByBranch")}>
          <BranchQtyChart rows={rows} />
        </ChartCard>
      </div>
    </div>
  );
}

function BranchPicker({ options, selected, onChange }) {
  const { t } = useLanguage();
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
        <div style={{ fontSize: 12, color: "var(--odoo-text-faint)", padding: 4 }}>{t("allBranches")}</div>
      )}
      {options.map((opt) => (
        <label key={opt} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, padding: "3px 4px", cursor: "pointer" }}>
          <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{opt}</span>
        </label>
      ))}
    </div>
  );
}

const compareBtnStyle = {
  background: "var(--odoo-purple)",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "11px 28px",
  fontSize: 13.5,
  fontWeight: 700,
};
