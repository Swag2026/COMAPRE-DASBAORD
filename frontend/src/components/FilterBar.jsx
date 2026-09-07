export function FilterBar({ children }) {
  return (
    <div
      style={{
        background: "var(--odoo-surface)",
        border: "1px solid var(--odoo-border)",
        borderRadius: "var(--odoo-radius)",
        padding: "14px 16px",
        marginBottom: 14,
        display: "flex",
        gap: 20,
        flexWrap: "wrap",
        alignItems: "flex-end",
      }}
    >
      {children}
    </div>
  );
}

export function FilterField({ label, children, width = 220 }) {
  return (
    <div style={{ width }}>
      <div
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: "var(--odoo-purple)",
          marginBottom: 5,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

export const inputStyle = {
  width: "100%",
  height: 34,
  padding: "0 10px",
  border: "1px solid var(--odoo-border-strong)",
  borderRadius: "var(--odoo-radius)",
  fontSize: 13,
  background: "#fff",
  color: "var(--odoo-text)",
};
