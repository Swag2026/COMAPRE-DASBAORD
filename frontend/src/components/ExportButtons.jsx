import { useState } from "react";
import { downloadFile } from "../utils/download";

export default function ExportButtons({ exporters }) {
  const [busy, setBusy] = useState(null);

  async function run(key, fn, fallbackName) {
    setBusy(key);
    try {
      await downloadFile(fn(), fallbackName);
    } catch (e) {
      alert("Download fail ho gaya, dobara try karo.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
      {exporters.map((exp) => (
        <button
          key={exp.key}
          onClick={() => run(exp.key, exp.fn, exp.filename)}
          disabled={busy === exp.key}
          style={{
            height: 32,
            padding: "0 14px",
            border: "1px solid var(--odoo-purple)",
            background: busy === exp.key ? "var(--odoo-purple-pale)" : "#fff",
            color: "var(--odoo-purple)",
            borderRadius: 6,
            fontSize: 12.5,
            fontWeight: 600,
          }}
        >
          {busy === exp.key ? "…" : exp.label}
        </button>
      ))}
    </div>
  );
}
