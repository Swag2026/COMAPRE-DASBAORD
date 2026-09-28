import HeroHeader from "../components/HeroHeader";
import { useLanguage } from "../i18n/LanguageContext";

export default function ComingSoonPage({ title }) {
  const { t } = useLanguage();
  return (
    <div style={{ padding: "18px 24px" }}>
      <HeroHeader title={title === "Season Comparison" ? t("navSeasonComparison") : title} subtitle={`${t("brandName")} · ${t("comingSoon")}`} />
      <div
        style={{
          background: "var(--odoo-surface)",
          border: "1px dashed var(--odoo-border-strong)",
          borderRadius: "var(--odoo-radius)",
          padding: 48,
          textAlign: "center",
          color: "var(--odoo-text-muted)",
        }}
      >
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ margin: "0 auto 12px" }}>
          <circle cx="28" cy="28" r="20" stroke="var(--odoo-border-strong)" strokeWidth="1.5" />
          <path d="M28 18 L28 28 L35 33" stroke="var(--odoo-border-strong)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <div>{t("underConstruction")}</div>
      </div>
    </div>
  );
}
