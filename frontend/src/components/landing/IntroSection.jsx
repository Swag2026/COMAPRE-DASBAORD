import PillButton from "./PillButton";

const LEFT_LINKS = ["Product comparison", "Reorder alerts", "Branch transfers"];
const RIGHT_LINKS = ["Season comparison", "Excel & PDF import", "WhatsApp sharing"];

export default function IntroSection() {
  return (
    <section className="lp-section" id="work">
      <div className="lp-container lp-intro-grid">
        <div className="lp-intro-social lp-reveal">
          {LEFT_LINKS.map((l) => (
            <a href="#services" key={l}>{l}</a>
          ))}
        </div>

        <div className="lp-reveal">
          <h2 className="lp-intro-heading">
            Five brands. One warehouse view. Built for the way SWAG actually moves stock.
          </h2>
          <p className="lp-intro-copy">
            SWAG Trading Company runs Different Clothes, LA ROUCHE, Fashion Limits and
            more, each on its own Odoo database. This dashboard pulls every branch and
            every company into one live, comparable view — so nobody has to check five
            systems to answer one question.
          </p>
          <div className="lp-intro-cta-wrap">
            <PillButton href="#services">See what it does</PillButton>
          </div>
        </div>

        <div className="lp-intro-social end lp-reveal">
          {RIGHT_LINKS.map((l) => (
            <a href="#services" key={l}>{l}</a>
          ))}
        </div>
      </div>
    </section>
  );
}
