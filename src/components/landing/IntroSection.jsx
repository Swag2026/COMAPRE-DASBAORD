import PillButton from "./PillButton";

const STATS = [
  { num: "5", label: "Companies" },
  { num: "20+", label: "Branches" },
  { num: "6", label: "Modules" },
];

export default function IntroSection() {
  return (
    <section className="lp-intro" id="work">
      <div className="lp-container lp-section lp-intro-grid">
        <div className="lp-reveal">
          <span className="lp-eyebrow">About the platform</span>
          <h2 className="lp-intro-heading" style={{ marginTop: 14 }}>
            Built for the way SWAG actually moves stock.
          </h2>
          <p className="lp-intro-copy">
            SWAG Trading Company runs Different Clothes, LA ROUCHE, Fashion
            Limits and more, each on its own Odoo database. This dashboard
            pulls every branch and every company into one live, comparable
            view — so nobody has to check five systems to answer one
            question.
          </p>
          <PillButton href="#services" outline showArrow={false}>Explore the modules</PillButton>
        </div>

        <div className="lp-intro-stats lp-reveal">
          {STATS.map((s) => (
            <div className="lp-intro-stat" key={s.label}>
              <div className="num">{s.num}</div>
              <div className="label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
