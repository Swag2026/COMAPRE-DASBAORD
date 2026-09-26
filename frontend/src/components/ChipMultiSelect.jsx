import { useState } from "react";

export default function ChipMultiSelect({ options, selected, onChange, placeholder = "" }) {
  const [open, setOpen] = useState(false);
  const available = options.filter((o) => !selected.includes(o));

  return (
    <div style={{ position: "relative" }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          border: "1px solid var(--odoo-border-strong)",
          borderRadius: 9,
          padding: 6,
          minHeight: 38,
          cursor: "pointer",
          background: "#fff",
          transition: "border-color .18s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--odoo-accent)")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--odoo-border-strong)")}
      >
        {selected.map((s) => (
          <span
            key={s}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "var(--odoo-accent)",
              color: "#fff",
              borderRadius: 999,
              padding: "3px 10px",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {s}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(selected.filter((x) => x !== s));
              }}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "inherit",
                fontSize: 14,
                lineHeight: 1,
                padding: 0,
              }}
            >
              ×
            </button>
          </span>
        ))}
        {selected.length === 0 && (
          <span style={{ color: "var(--odoo-text-faint)", fontSize: 12.5, padding: "4px 2px" }}>
            {placeholder}
          </span>
        )}
      </div>
      {open && available.length > 0 && (
        <div
          style={{
            position: "absolute",
            zIndex: 30,
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid var(--odoo-border)",
            borderRadius: 11,
            marginTop: 6,
            maxHeight: 160,
            overflowY: "auto",
            boxShadow: "var(--odoo-shadow-lg)",
            padding: 4,
          }}
        >
          {available.map((o) => (
            <div
              key={o}
              onClick={() => {
                onChange([...selected, o]);
              }}
              style={{ padding: "8px 10px", fontSize: 12.5, cursor: "pointer", borderRadius: 7 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--odoo-bg)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
