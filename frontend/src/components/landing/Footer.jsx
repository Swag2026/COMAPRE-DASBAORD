import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer-top">
          <div className="lp-footer-brand">
            <span className="lp-logo-badge">S</span>
            <div>
              <div style={{ fontFamily: "var(--lp-display)", fontWeight: 800, fontSize: 15 }}>SWAG</div>
              <p className="lp-footer-tag">
                One live view of stock, transfers and reorders across every group brand.
              </p>
            </div>
          </div>
          <nav className="lp-footer-nav">
            <a href="#work">Brands</a>
            <a href="#services">Modules</a>
            <a href="#contact">Contact</a>
            <Link to="/login">Sign in</Link>
          </nav>
        </div>
        <div className="lp-footer-bottom">
          <span>© {new Date().getFullYear()} SWAG Trading Company</span>
          <button
            className="lp-back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
