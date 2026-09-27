import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

// Reused across the landing page: header CTA, intro CTA, sticky orbit CTA.
// Pass `to` for internal SPA navigation (react-router Link), `href` for a
// plain anchor (hash scroll, mailto, external), or neither for a click
// handler. The label duplicates on hover via .lp-slide-label so the whole
// word slides up to reveal a second copy underneath.
export default function PillButton({ children, outline = false, onClick, href, to, type = "button", className = "" }) {
  const label = (
    <>
      <span className="lp-slide-label">
        <span data-label={children}>{children}</span>
      </span>
      <span className="lp-pill-arrow">
        <ArrowUpRight size={15} />
      </span>
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
