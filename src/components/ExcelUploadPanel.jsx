import { useRef, useState } from "react";
import { uploadTablePreview, uploadTableExtract } from "../api/client";
import { useToast } from "../api/ToastContext";
import Spinner from "./Spinner";

export default function ExcelUploadPanel({ onSearch }) {
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
      showToast(err?.response?.status === 422 ? "The file is empty." : "Error reading the file.", "error");
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
    showToast(`Searching ${extracted.codes.length} codes in ${tab === "total" ? "Total Stock" : "Branch Stock"}.`, "success");
  }

  return (
    <div style={{ background: "var(--odoo-surface)", border: "1px solid var(--odoo-border)", borderRadius: "var(--odoo-radius)", padding: 16 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--odoo-purple)", marginBottom: 8 }}>
        ✅ Upload Excel/CSV — Exact Models (Recommended)
      </div>
      <div style={{ background: "var(--odoo-purple-pale)", color: "var(--odoo-purple)", fontSize: 11.5, padding: "8px 10px", borderRadius: 6, marginBottom: 10 }}>
        Best for accuracy — reads the exact text from your chosen column. No pattern matching, no missed codes.
      </div>

      <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} disabled={busy} style={{ fontSize: 12, marginBottom: 10 }} />

      {busy && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--odoo-text-muted)" }}>
          <Spinner size={14} /> Reading…
        </div>
      )}

      {preview && (
        <div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, marginBottom: 4 }}>Which column has the model codes?</div>
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
                <Metric label="Total rows in file" value={extracted.total_rows} />
                <Metric label="Unique exact codes" value={extracted.unique_count} />
              </div>

              <button
                onClick={() => setExpanded((x) => !x)}
                style={{ background: "none", border: "none", color: "var(--odoo-purple)", fontSize: 12, fontWeight: 600, padding: 0, marginBottom: 8 }}
              >
                {expanded ? "▾" : "▸"} Preview all {extracted.unique_count} codes exactly as read
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
                <div style={{ fontSize: 12, color: "var(--odoo-warning)" }}>No codes found in that column. Try a different column.</div>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => pick("total")} style={btnStyle(true)}>
                    Total Stock ({extracted.unique_count} codes)
                  </button>
                  <button onClick={() => pick("branch")} style={btnStyle(false)}>
                    Branch-wise ({extracted.unique_count} codes)
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

function btnStyle(primary) {
  return {
    flex: 1,
    height: 34,
    borderRadius: 6,
    fontSize: 12.5,
    fontWeight: 600,
    border: primary ? "none" : "1px solid var(--odoo-purple)",
    background: primary ? "var(--odoo-purple)" : "#fff",
    color: primary ? "#fff" : "var(--odoo-purple)",
  };
}
