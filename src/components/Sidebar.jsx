import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Languages, RefreshCw, ShieldCheck } from "lucide-react";
import { useAppState } from "../api/AppStateContext";
import { useToast } from "../api/ToastContext";
import { useLanguage } from "../i18n/LanguageContext";
import { FLAT_NAV } from "./MegaMenu";
import Spinner from "./Spinner";

const NAV_LABEL_KEYS = {
  "Product Comparison": "navProductComparison",
  "Branch Stock": "navBranchStock",
  "Reorder Suggestions": "navReorder",
  "Pending Transfers": "navTransfers",
  "Season Comparison": "navSeasonComparison",
};

export default function Sidebar() {
  const {
    triggerReload,
    lowStockThreshold, setLowStockThreshold,
    exactMatch, setExactMatch,
    lastRun,
  } = useAppState();
  const [reloading, setReloading] = useState(false);
  const { showToast } = useToast();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t, lang, toggleLanguage } = useLanguage();

  async function handleReload() {
    setReloading(true);
    try {
      await triggerReload();
      showToast("Data cache cleared, refetching…", "info");
    } finally {
      setReloading(false);
    }
  }

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="logo-badge">
          <svg width="22" height="22" viewBox="0 0 100 88">
            <path d="M13 51 L50 65 L87 51 L87 58 L50 72 L13 58 Z" fill="#A87F9D" />
            <rect x="24" y="30" width="15" height="30" fill="#714B67" />
            <rect x="41" y="12" width="16" height="48" fill="#8B5E7E" />
            <rect x="59" y="32" width="15" height="28" fill="#F1E6EE" />
          </svg>
        </div>
        <div className="brand-text">
          <b>{t("brandName")}</b>
          <span>{t("brandSub")}</span>
        </div>
      </div>

      {/* Flat nav tabs */}
      <nav className="tabs">
        {FLAT_NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to;
          return (
            <button
              key={item.to}
              onClick={() => navigate(item.to)}
              className={`nav-tab-btn${active ? " active" : ""}`}
            >
              <Icon size={18} />
              <span>{t(NAV_LABEL_KEYS[item.label]) || item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Snapshot card */}
      <div className="sidebar-snapshot">
        <div className="snap-title">{t("sessionTitle")}</div>
        <SnapRow label={t("lowStockLabel")} value={lowStockThreshold} />
        <div className="snap-row-wrap">
          <SnapRow label={t("lastRunLabel")} value={lastRun || "—"} />
        </div>
      </div>

      {/* Settings */}
      <div className="sidebar-settings">
        <label>
          <input type="checkbox" checked={exactMatch} onChange={(e) => setExactMatch(e.target.checked)} />
          {t("exactMatchLabel")}
        </label>
        <div className="threshold-row">
          <span>{t("thresholdLabel")}</span>
          <input
            type="number"
            min={0}
            value={lowStockThreshold}
            onChange={(e) => setLowStockThreshold(Number(e.target.value) || 0)}
          />
          <button className="icon-btn compact" onClick={handleReload} disabled={reloading} title={t("reloadData")}>
            {reloading ? <Spinner size={12} /> : <RefreshCw size={13} />}
          </button>
          <button className="icon-btn compact" onClick={toggleLanguage} title={lang === "en" ? "العربية" : "English"}>
            <Languages size={13} />
          </button>
        </div>
      </div>

      <div className="sidebar-footer">
        <ShieldCheck size={15} />
        <span>{t("footerSecure")}</span>
      </div>
    </aside>
  );
}

function SnapRow({ label, value }) {
  return (
    <div className="snap-row">
      <span>{label}</span>
      <span className="snap-value">{value}</span>
    </div>
  );
}
