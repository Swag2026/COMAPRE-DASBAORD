import { useRef, useState } from "react";
import { uploadPdf } from "../api/client";
import { useToast } from "../api/ToastContext";
import Spinner from "./Spinner";

export default function PdfUploadPanel({ onSearch }) {
  const inputRef = useRef(null);
  const [mode, setMode] = useState("main");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null); // {raw_count, unique_count, codes, sequenced}
  const [expanded, setExpanded] = useState(false);
  const { showToast } = useToast();

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setResult(null);
    try {
      const data = await uploadPdf(file, mode);
      setResult(data);
    } catch (err) {
      showToast(
        err?.response?.status === 422 ? "No model codes found in the PDF." : "Error reading the PDF.",
        "error"
      );
    } finally {
      setBusy(false);
    }
  }

  function pick(tab) {
    onSearch(result.codes.join(","), tab);
    showToast(`Searching ${result.codes.length} codes in ${tab === "total" ? "Total Stock" : "Branch Stock"}.`, "success");
  }

  return (
    <div style={{ background: "var(--odoo-surface)", border: "1px solid var(--odoo-border)", borderRadius: "var(--odoo-radius)", padding: 16 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--odoo-purple)", marginBottom: 8 }}>Upload Invoice PDF</div>
      <div style={{ background: "#FFFBEB", color: "#92400E", fontSize: 11.5, padding: "8px 10px", borderRadius: 6, marginBottom: 10 }}>
        ⚠️ PDF extraction may miss codes with unusual formatting — use Excel upload for 100% exact match
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
        <input ref={inputRef} type="file" accept=".pdf" onChange={handleFile} disabled={busy} style={{ fontSize: 12 }} />
        <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
          <input type="radio" name="pdfmode" checked={mode === "main"} onChange={() => setMode("main")} /> Main models
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
          <input type="radio" name="pdfmode" checked={mode === "sizes"} onChange={() => setMode("sizes")} /> With sizes
        </label>
      </div>

      {busy && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--odoo-text-muted)" }}>
          <Spinner size={14} /> Parsing PDF…
        </div>
      )}

      {result && (
        <div style={{ marginTop: 6 }}>
          <div style={{ display: "flex", gap: 20, marginBottom: 10 }}>
            <Metric label="Raw codes" value={result.raw_count} />
            <Metric label="Unique models" value={result.unique_count} />
          </div>

          <button
            onClick={() => setExpanded((x) => !x)}
            style={{ background: "none", border: "none", color: "var(--odoo-purple)", fontSize: 12, fontWeight: 600, padding: 0, marginBottom: 8 }}
          >
            {expanded ? "▾" : "▸"} {result.unique_count} codes found
          </button>
          {expanded && (
            <pre
              style={{
                background: "#F9FAFB", border: "1px solid var(--odoo-border)", borderRadius: 6,
                padding: 10, fontSize: 11.5, maxHeight: 160, overflowY: "auto", marginBottom: 8,
              }}
            >
              {result.sequenced.map((it) => `${String(it.sequence).padStart(3)}. ${it.code}`).join("\n")}
            </pre>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => pick("total")} style={btnStyle(true)}>Total Stock</button>
            <button onClick={() => pick("branch")} style={btnStyle(false)}>Branch-wise</button>
          </div>
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
