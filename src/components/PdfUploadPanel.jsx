import { useRef, useState } from "react";
import { uploadPdf } from "../api/client";
import { useToast } from "../api/ToastContext";
import Spinner from "./Spinner";
import { useLanguage } from "../i18n/LanguageContext";

export default function PdfUploadPanel({ onSearch }) {
  const { t } = useLanguage();
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
        err?.response?.status === 422 ? t("noPdfCodes") : t("errorPdf"),
        "error"
      );
    } finally {
      setBusy(false);
    }
  }

  function pick(tab) {
    onSearch(result.codes.join(","), tab);
    showToast(`${result.codes.length} ${t("codesFound")} ${tab === "total" ? t("totalStock") : t("branchStock")}.`, "success");
  }

  return (
    <div style={{ background: "var(--odoo-surface)", border: "1px solid var(--odoo-border)", borderRadius: "var(--odoo-radius)", padding: 16 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--odoo-heading)", marginBottom: 8 }}>{t("uploadInvoicePdf")}</div>
      <div className="alert-item warn" style={{ marginBottom: 10 }}>
        {t("pdfWarning")}
      </div>

      <label className="dropzone" style={{ display: "block", marginBottom: 10, padding: "16px" }}>
        <div className="dz-label">{busy ? t("parsingPdf") : (result ? result.raw_count + " codes" : "Click or drop invoice PDF")}</div>
        <input ref={inputRef} type="file" accept=".pdf" onChange={handleFile} disabled={busy} />
      </label>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
          <input type="radio" name="pdfmode" checked={mode === "main"} onChange={() => setMode("main")} /> {t("mainModels")}
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
          <input type="radio" name="pdfmode" checked={mode === "sizes"} onChange={() => setMode("sizes")} /> {t("withSizes")}
        </label>
      </div>

      {busy && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--odoo-text-muted)" }}>
          <Spinner size={14} /> {t("parsingPdf")}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 6 }}>
          <div style={{ display: "flex", gap: 20, marginBottom: 10 }}>
            <Metric label={t("rawCodes")} value={result.raw_count} />
            <Metric label={t("uniqueModels")} value={result.unique_count} />
          </div>

          <button
            onClick={() => setExpanded((x) => !x)}
            style={{ background: "none", border: "none", color: "var(--odoo-accent)", fontSize: 12, fontWeight: 600, padding: 0, marginBottom: 8 }}
          >
            {expanded ? "▾" : "▸"} {result.unique_count} {t("codesFound")}
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
            <button className="btn" style={{ flex: 1, justifyContent: "center" }} onClick={() => pick("total")}>{t("totalStock")}</button>
            <button className="btn secondary" style={{ flex: 1, justifyContent: "center" }} onClick={() => pick("branch")}>{t("branchWise")}</button>
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
