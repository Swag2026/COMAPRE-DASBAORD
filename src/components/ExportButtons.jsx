import { useState } from "react";
import { downloadFile } from "../utils/download";
import { useToast } from "../api/ToastContext";
import Spinner from "./Spinner";
import { useLanguage } from "../i18n/LanguageContext";

export default function ExportButtons({ exporters }) {
  const { t } = useLanguage();
  const [busy, setBusy] = useState(null);
  const { showToast } = useToast();

  async function run(key, fn, fallbackName) {
    setBusy(key);
    try {
      await downloadFile(fn(), fallbackName);
      showToast(`${fallbackName} downloaded.`, "success");
    } catch (e) {
      showToast(t("downloadFailed"), "error");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
      {exporters.map((exp) => (
        <button
          key={exp.key}
          className="btn secondary small"
          onClick={() => run(exp.key, exp.fn, exp.filename)}
          disabled={busy === exp.key}
        >
          {busy === exp.key ? <Spinner size={13} /> : null}
          {busy === exp.key ? t("downloading") : exp.label}
        </button>
      ))}
    </div>
  );
}
