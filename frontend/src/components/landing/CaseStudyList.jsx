import { Shirt, Building2, Layers, ArrowRight } from "lucide-react";

// Real connected brands stand in for "case studies" — each card shows what
// the dashboard actually tracks for that company, not a fabricated project.
const CASES = [
  {
    Icon: Shirt,
    name: "Different Clothes",
    year: "Connected since 2018",
    cat: "Retail · multi-branch",
    body: "Product comparison and season-over-season stock analysis across every branch.",
  },
  {
    Icon: Building2,
    name: "LA ROUCHE",
    year: "Connected since 2020",
    cat: "Retail · reorder tracking",
    body: "Automated low-stock alerts and reorder priority scoring keep shelves full.",
  },
  {
    Icon: Layers,
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
        <div className="lp-cases-head lp-reveal">
          <span className="lp-eyebrow">Connected brands</span>
          <h2 className="lp-heading">Every company, one dashboard.</h2>
          <p>See exactly what each brand looks like inside the platform.</p>
        </div>
        <div className="lp-case-grid">
          {CASES.map((c) => (
            <div className="lp-case-card lp-reveal" key={c.name}>
              <span className="lp-case-mark"><c.Icon size={22} strokeWidth={1.7} /></span>
              <div className="lp-case-year">{c.year}</div>
              <h3 className="lp-case-name">{c.name}</h3>
              <div className="lp-case-cat">{c.cat}</div>
              <p className="lp-case-body">{c.body}</p>
              <a className="lp-case-view" href="/login">
                View in dashboard <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
