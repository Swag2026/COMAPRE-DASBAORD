import { Link } from "react-router-dom";

const ITEMS = [
  { label: "Stock", r: 0 },
  { label: "Reorder", r: 72 },
  { label: "Transfers", r: 144 },
  { label: "Compare", r: 216 },
  { label: "Seasons", r: 288 },
];

export default function StickyCircleCTA() {
  return (
    <section className="lp-sticky-scene" id="contact">
      <div className="lp-sticky-inner">
        <h2
          className="lp-heading"
          style={{ position: "absolute", top: "14%", textAlign: "center", width: "100%", fontSize: "clamp(1.6rem,4vw,2.4rem)", padding: "0 20px" }}
        >
          Ready to see every branch in one place?
        </h2>
        <div className="lp-orbit-ring">
          {ITEMS.map((it) => (
            <div className="lp-orbit-item" key={it.label} style={{ "--r": `${it.r}deg` }}>
              <span>{it.label}</span>
            </div>
          ))}
        </div>
        <Link className="lp-orbit-cta" to="/login">
          <span>Sign in</span>
          <span>to your dashboard</span>
        </Link>
      </div>
    </section>
  );
}
