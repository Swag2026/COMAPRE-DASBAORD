import { useRef, useState } from "react";
import { uploadTablePreview, uploadTableExtract } from "../api/client";
import { useToast } from "../api/ToastContext";
import Spinner from "./Spinner";
import { useLanguage } from "../i18n/LanguageContext";

export default function ExcelUploadPanel({ onSearch }) {
  const { t } = useLanguage();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // {columns, guessed_column, preview_rows, total_rows}
  const [column, setColumn] = useState("");
  const [extracted, setExtracted] = useState(null); // {codes, total_rows, unique_count}
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { showToast } = useToast();

  async function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setBusy(true);
    setPreview(null);
    setExtracted(null);
    try {
      const p = await uploadTablePreview(f);
      setPreview(p);
      setColumn(p.guessed_column);
      await runExtract(f, p.guessed_column);
    } catch (err) {
      showToast(err?.response?.status === 422 ? t("fileEmpty") : t("errorFile"), "error");
    } finally {
      setBusy(false);
    }
  }

  async function runExtract(f, col) {
    try {
      const ex = await uploadTableExtract(f, col);
      setExtracted(ex);
    } catch {
      setExtracted(null);
    }
  }

  async function handleColumnChange(col) {
    setColumn(col);
    setBusy(true);
    await runExtract(file, col);
    setBusy(false);
  }

  function pick(tab) {
    onSearch(extracted.codes.join(","), tab);
    showToast(`${extracted.codes.length} ${t("codesFound")} ${tab === "total" ? t("totalStock") : t("branchStock")}.`, "success");
  }

  return (
    <div style={{ background: "var(--odoo-surface)", border: "1px solid var(--odoo-border)", borderRadius: "var(--odoo-radius)", padding: 16 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--odoo-heading)", marginBottom: 8 }}>
        {t("uploadExcel")}
      </div>
      <div className="alert-item" style={{ marginBottom: 10 }}>
        {t("excelHint")}
      </div>

      <label className="dropzone" style={{ display: "block", marginBottom: 10, padding: "16px" }}>
        <div className="dz-label">{busy ? t("reading") : (file ? file.name : "Click or drop Excel / CSV file")}</div>
        <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} disabled={busy} />
      </label>

      {busy && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--odoo-text-muted)" }}>
          <Spinner size={14} /> {t("reading")}
        </div>
      )}

      {preview && (
        <div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, marginBottom: 4 }}>{t("modelCodeColumn")}</div>
            <select
              value={column}
              onChange={(e) => handleColumnChange(e.target.value)}
              style={{ width: "100%", maxWidth: 280, height: 32, border: "1px solid var(--odoo-border-strong)", borderRadius: 6, fontSize: 12.5, padding: "0 8px" }}
            >
              {preview.columns.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {extracted && (
            <>
              <div style={{ display: "flex", gap: 20, marginBottom: 10 }}>
                <Metric label={t("totalRowsFile")} value={extracted.total_rows} />
                <Metric label={t("uniqueExactCodes")} value={extracted.unique_count} />
              </div>

              <button
                onClick={() => setExpanded((x) => !x)}
                style={{ background: "none", border: "none", color: "var(--odoo-accent)", fontSize: 12, fontWeight: 600, padding: 0, marginBottom: 8 }}
              >
                {expanded ? "▾" : "▸"} {t("previewCodes")} ({extracted.unique_count})
              </button>
              {expanded && (
                <div style={{ maxHeight: 160, overflowY: "auto", border: "1px solid var(--odoo-border)", borderRadius: 6, marginBottom: 8 }}>
                  <table style={{ width: "100%", fontSize: 11.5 }}>
                    <tbody>
                      {extracted.codes.map((c, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                          <td style={{ padding: "4px 10px", color: "var(--odoo-text-muted)", width: 40 }}>{i + 1}</td>
                          <td style={{ padding: "4px 10px", fontFamily: "monospace" }}>{c}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {extracted.unique_count === 0 ? (
                <div style={{ fontSize: 12, color: "var(--odoo-warning)" }}>{t("noCodesColumn")}</div>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn" style={{ flex: 1, justifyContent: "center" }} onClick={() => pick("total")}>
                    {t("totalStock")} ({extracted.unique_count})
                  </button>
                  <button className="btn secondary" style={{ flex: 1, justifyContent: "center" }} onClick={() => pick("branch")}>
                    {t("branchWise")} ({extracted.unique_count})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 9.5, letterSpacing: 1, textTransform: "uppercase", color: "var(--odoo-text-muted)" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
