import { SectionTag } from "./TotalStockPage";

export default function ComingSoonPage({ title }) {
  return (
    <div style={{ padding: "18px 24px" }}>
      <SectionTag>{title}</SectionTag>
      <div
        style={{
          background: "var(--odoo-surface)",
          border: "1px dashed var(--odoo-border-strong)",
          borderRadius: "var(--odoo-radius)",
          padding: 40,
          textAlign: "center",
          color: "var(--odoo-text-muted)",
        }}
      >
        Yeh tab abhi Streamlit se React mein port nahi hua — Total Stock aur
        Branch Stock ke baad iska number aayega.
      </div>
    </div>
  );
}
