import { Package, BarChart3 } from "lucide-react";
import PillButton from "./PillButton";

const STATS = [
  { num: "5", label: "Connected brands" },
  { num: "20+", label: "Branches tracked" },
  { num: "1", label: "Live dashboard" },
];

export default function HeroOrbit() {
  return (
    <section className="lp-hero">
      <div className="lp-hero-inner">
        <div>
          <span className="lp-eyebrow">Product Intelligence · 5 Systems</span>
          <h1 className="lp-hero-title">
            One live view of stock, <em>across every SWAG brand.</em>
          </h1>
          <p className="lp-hero-subtitle">
            Product comparison, reorder alerts and branch transfers for
            Different Clothes, LA ROUCHE, Fashion Limits and more — pulled
            from five separate Odoo databases into a single dashboard.
          </p>
          <div className="lp-hero-cta-row">
            <PillButton to="/login">Sign in to your dashboard</PillButton>
            <PillButton href="#services" outline showArrow={false}>See what it does</PillButton>
          </div>
          <div className="lp-hero-stats">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="lp-hero-stat-num">{s.num}</div>
                <div className="lp-hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lp-hero-visual" aria-hidden="true">
          <div className="lp-hero-card lp-hero-card-main">
            <div className="bar w60" />
            <div className="bar w80" />
            <div className="bar w40" />
            <div className="fill-bar" />
          </div>
          <div className="lp-hero-card lp-hero-mini-card c1">
            <span className="lp-hero-mini-icon"><Package size={17} /></span>
            <div className="lp-hero-mini-text">
              <div className="num">1,248</div>
              <div className="label">SKUs tracked</div>
            </div>
          </div>
          <div className="lp-hero-card lp-hero-mini-card c2">
            <span className="lp-hero-mini-icon"><BarChart3 size={17} /></span>
            <div className="lp-hero-mini-text">
              <div className="num">Live</div>
              <div className="label">Reorder alerts</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
