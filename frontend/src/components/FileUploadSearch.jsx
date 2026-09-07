import { useRef, useState } from "react";
import { extractCodes } from "../api/client";

export default function FileUploadSearch({ onCodesExtracted }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [lastCount, setLastCount] = useState(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    setLastCount(null);
    try {
      const data = await extractCodes(file);
      onCodesExtracted(data.codes);
      setLastCount(data.count);
    } catch (err) {
      setError(
        err?.response?.status === 422
          ? "File mein koi model code nahi mila."
          : "File padhne mein error aaya — PDF/Excel/CSV try karo."
      );
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.xlsx,.xls,.csv"
        onChange={handleFile}
        disabled={busy}
        style={{ fontSize: 12, width: "100%" }}
      />
      {busy && (
        <div style={{ fontSize: 11.5, color: "var(--odoo-text-muted)", marginTop: 4 }}>
          Padh raha hoon…
        </div>
      )}
      {lastCount != null && !busy && (
        <div style={{ fontSize: 11.5, color: "var(--odoo-success)", marginTop: 4 }}>
          {lastCount} model codes mile, search mein daal diye.
        </div>
      )}
      {error && (
        <div style={{ fontSize: 11.5, color: "var(--odoo-danger)", marginTop: 4 }}>{error}</div>
      )}
    </div>
  );
}
