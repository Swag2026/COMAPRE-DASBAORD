import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Reused across the landing page: header CTA, hero CTA, banner CTA.
// Pass `to` for internal SPA navigation (react-router Link), `href` for a
// plain anchor (hash scroll, mailto, external), or neither for a click
// handler.
export default function PillButton({ children, outline = false, onClick, href, to, type = "button", className = "", showArrow = true }) {
  const label = (
    <>
      <span className="lp-slide-label">{children}</span>
      {showArrow && (
        <span className="lp-pill-arrow">
          <ArrowRight size={16} />
        </span>
      )}
    </>
  );

  const cls = `lp-pill${outline ? " outline" : ""} ${className}`;

  if (to) {
    return (
      <Link className={cls} to={to} onClick={onClick}>
        {label}
      </Link>
    );
  }
  if (href) {
    return (
      <a className={cls} href={href} onClick={onClick}>
        {label}
      </a>
    );
  }
  return (
    <button className={cls} type={type} onClick={onClick}>
      {label}
    </button>
  );
}
