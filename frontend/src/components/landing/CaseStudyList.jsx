import { Shirt, Building2, Layers, ArrowUpRight } from "lucide-react";

// Real connected brands stand in for "case studies" — each row shows what
// the dashboard actually tracks for that company, not a fabricated project.
const CASES = [
  {
    Icon: Shirt,
    mark: "dc",
    name: "Different Clothes",
    year: "Connected since 2018",
    cat: "Retail · multi-branch",
    body: "Product comparison and season-over-season stock analysis across every branch.",
  },
  {
    Icon: Building2,
    mark: "lr",
    name: "LA ROUCHE",
    year: "Connected since 2020",
    cat: "Retail · reorder tracking",
    body: "Automated low-stock alerts and reorder priority scoring keep shelves full.",
  },
  {
    Icon: Layers,
    mark: "fl",
    name: "Fashion Limits",
    year: "Connected since 2021",
    cat: "Retail · transfers",
    body: "Branch-to-branch transfer visibility, from request to receipt, in one timeline.",
  },
];

export default function CaseStudyList() {
  return (
    <section className="lp-section">
      <div className="lp-container">
        <div className="lp-cases lp-reveal">
          <h2 className="lp-cases-heading">Connected brands</h2>
          {CASES.map((c, i) => (
            <div className={`lp-case-row${i % 2 ? " reverse" : ""}`} key={c.name}>
              <div className="lp-case-image">
                <span className="lp-case-image-mark">{c.mark}</span>
                <c.Icon size={44} strokeWidth={1.3} color="#fff" style={{ position: "relative", zIndex: 1 }} />
              </div>
              <div className="lp-case-info">
                <div className="lp-case-year">{c.year}</div>
                <h3 className="lp-case-name">{c.name}</h3>
                <div className="lp-case-cat">{c.cat}</div>
                <p style={{ color: "rgba(255,255,255,.7)", fontSize: 14, maxWidth: 420 }}>{c.body}</p>
                <span className="lp-case-view">
                  View in dashboard
                  <span className="lp-case-view-dot"><ArrowUpRight size={13} /></span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
