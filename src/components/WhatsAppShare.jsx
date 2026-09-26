import { useMemo, useState } from "react";

export default function WhatsAppShare({ rows, title = "Stock Report" }) {
  const [open, setOpen] = useState(false);

  const message = useMemo(() => {
    const ok = rows.filter((r) => r.status === "OK");
    const lines = [`*${title}*`, `_${new Date().toLocaleDateString()}_`, ""];
    for (const r of ok.slice(0, 50)) {
      lines.push(`${r.model_code} — ${r.product} — ${r.on_hand} pcs (${r.system_name})`);
    }
    if (ok.length > 50) lines.push(`… and ${ok.length - 50} more`);
    return lines.join("\n");
  }, [rows, title]);

  const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  function downloadTxt() {
    const blob = new Blob([message], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stock_report.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      style={{
        background: "var(--odoo-surface)",
        border: "1px solid var(--odoo-border)",
        borderRadius: "var(--odoo-radius)",
        padding: 14,
        marginTop: 14,
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "transparent",
          border: "none",
          fontSize: 12.5,
          fontWeight: 700,
          color: "var(--odoo-purple)",
          padding: 0,
        }}
      >
        {open ? "▾" : "▸"} WhatsApp Share
      </button>

      {open && (
        <div style={{ marginTop: 10 }}>
          <textarea
            readOnly
            value={message}
            rows={6}
            style={{
              width: "100%",
              fontSize: 12,
              fontFamily: "monospace",
              border: "1px solid var(--odoo-border-strong)",
              borderRadius: 6,
              padding: 8,
              resize: "vertical",
            }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                textAlign: "center",
                background: "#25D366",
                color: "#0A0A0A",
                fontWeight: 600,
                fontSize: 12.5,
                padding: "9px 0",
                borderRadius: 100,
                textDecoration: "none",
              }}
            >
              WhatsApp →
            </a>
            <button
              onClick={downloadTxt}
              style={{
                flex: 1,
                background: "#fff",
                border: "1px solid var(--odoo-border-strong)",
                borderRadius: 100,
                fontSize: 12.5,
                fontWeight: 600,
              }}
            >
              Download .txt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
