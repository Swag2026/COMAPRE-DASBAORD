export function FilterBar({ children, sticky = false }) {
  return (
    <div className={`filter-panel${sticky ? " is-sticky" : ""}`}>
      {children}
    </div>
  );
}

export function FilterField({ label, children, width = 220 }) {
  return (
    <div className="filter-field" style={{ width }}>
      <div className="filter-field-label">
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
