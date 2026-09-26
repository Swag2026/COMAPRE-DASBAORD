import { useEffect } from "react";
import { createPortal } from "react-dom";
import { PackageSearch, Sparkles } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

// Colorful, animated slide-over detail panel. Each field cascades in with its
// own tiny delay (accordion-style reveal) instead of popping in all at once,
// and the header/accent colors react to the row's stock status (red = zero,
// amber = low, teal/green = healthy) so it doesn't look like a flat grey box.
const TONE = {
  zero: { grad: "linear-gradient(135deg,#A93226,#7a2119)", soft: "#FBE8E4", text: "#A93226" },
  low: { grad: "linear-gradient(135deg,#B5842A,#8a5300)", soft: "#FBF0DB", text: "#8a5300" },
  ok: { grad: "linear-gradient(135deg,#1a1a1a,#3a3a3a)", soft: "#ECECEC", text: "#1a1a1a" },
};

export default function RowDetailDrawer({ row, columns, onClose, lowStockThreshold = 0 }) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!row) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [row, onClose]);

  if (!row) return null;

  const qty = row.on_hand ?? row.qty;
  const toneKey = qty === 0 ? "zero" : qty > 0 && qty <= lowStockThreshold ? "low" : "ok";
  const tone = TONE[toneKey];
  const titleValue = row.product || row.model_code || row.reference || t("details");

  // Rendered via a portal straight onto <body>. Some page (a KPI/chart
  // animation, a route transition, etc.) can wrap this component in an
  // ancestor that has ANY CSS transform on it — even an inert identity
  // transform counts — and per spec that ancestor becomes the containing
  // block for our position:fixed panel instead of the viewport. That was
  // the real cause of the earlier "ajeeb"/dimmed-grey bug: the backdrop and
  // panel rendered, just sized/positioned against that ancestor's box
  // instead of the screen. A portal sidesteps the whole class of bug.
  return createPortal(
    <>
      <div onClick={onClose} className="rdd-backdrop" />
      <div className="rdd-panel" role="dialog" aria-modal="true">
        <div className="rdd-header" style={{ background: tone.grad }}>
          <div className="rdd-header-icon">
            <Sparkles size={16} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="rdd-eyebrow">{t("details")}</div>
            <div className="rdd-title" title={titleValue}>
              {titleValue}
            </div>
          </div>
          <button onClick={onClose} className="rdd-close" aria-label="Close">
            ×
          </button>
        </div>

        <div className="rdd-body">
          {columns.map((c, i) => {
            const value = c.render ? c.render(row) : row[c.key];
            const isEmpty = value === undefined || value === null || value === "";
            return (
              <div key={c.key} className="rdd-field" style={{ animationDelay: `${70 + i * 45}ms` }}>
                <span className="rdd-field-dot" style={{ background: tone.text }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="rdd-field-label">{c.label}</div>
                  <div className="rdd-field-value">{isEmpty ? "—" : value}</div>
                </div>
              </div>
            );
          })}

          {columns.length === 0 && (
            <div className="rdd-empty">
              <PackageSearch size={28} strokeWidth={1.5} />
              <div>{t("noDataFilters")}</div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .rdd-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(17,24,39,0.42);
          backdrop-filter: blur(2px);
          z-index: 9998;
          animation: rddFade .2s ease both;
        }
        .rdd-panel {
          position: fixed;
          inset-block: 0;
          inset-inline-end: 0;
          width: 380px;
          max-width: 92vw;
          background: #fff;
          z-index: 9999;
          box-shadow: -12px 0 40px rgba(0,0,0,0.22);
          display: flex;
          flex-direction: column;
          animation: rddSlideIn .32s cubic-bezier(.2,.9,.25,1.05) both;
        }
        [dir="rtl"] .rdd-panel { box-shadow: 12px 0 40px rgba(0,0,0,0.22); }
        .rdd-header {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 22px;
          color: #fff;
          flex-shrink: 0;
        }
        .rdd-header-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: rgba(255,255,255,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .rdd-eyebrow {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: .6px;
          text-transform: uppercase;
          opacity: .8;
          margin-bottom: 2px;
        }
        .rdd-title {
          font-size: 15px;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .rdd-close {
          margin-inline-start: auto;
          border: none;
          background: rgba(255,255,255,0.16);
          color: #fff;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          flex-shrink: 0;
          transition: background .15s ease, transform .15s ease;
        }
        .rdd-close:hover { background: rgba(255,255,255,0.32); transform: scale(1.08); }
        .rdd-body {
          padding: 18px 22px 28px;
          overflow-y: auto;
          flex: 1;
        }
        .rdd-field {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 0;
          border-bottom: 1px solid #F1F2F4;
          opacity: 0;
          animation: rddFieldIn .38s ease both;
        }
        .rdd-field:last-child { border-bottom: none; }
        .rdd-field-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }
        .rdd-field-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .8px;
          text-transform: uppercase;
          color: var(--odoo-text-faint);
          margin-bottom: 3px;
        }
        .rdd-field-value {
          font-size: 14px;
          font-weight: 600;
          color: var(--odoo-text);
          word-break: break-word;
        }
        .rdd-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: var(--odoo-text-muted);
          padding: 40px 0;
        }
        @keyframes rddFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rddSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        [dir="rtl"] .rdd-panel { animation-name: rddSlideInRtl; }
        @keyframes rddSlideInRtl { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes rddFieldIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>,
    document.body
  );
}
