import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import PillButton from "./PillButton";

const NAV_LINKS = [
  { href: "#work", label: "Brands" },
  { href: "#services", label: "Modules" },
  { href: "#contact", label: "Contact" },
];

export default function FloatingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="lp-header">
        <Link className="lp-header-brand" to="/">
          <span className="lp-logo-badge">S</span>
          <span className="lp-header-brand-name">SWAG</span>
        </Link>

        <nav className="lp-nav-shell" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>

        <div className="lp-header-actions">
          <PillButton to="/login" showArrow={false}>Sign in</PillButton>
          <button
            className="lp-menu-btn"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <div className={`lp-mobile-menu${open ? " open" : ""}`} role="dialog" aria-modal="true" aria-hidden={!open}>
        <div className="lp-mobile-menu-top">
          <span className="lp-logo-badge">S</span>
          <button className="lp-menu-btn" aria-label="Close menu" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <nav>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <Link to="/login" onClick={() => setOpen(false)}>Sign in →</Link>
        </nav>
      </div>
    </>
  );
}
