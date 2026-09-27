// The real connected Odoo systems stand in for "client logos" — no
// fabricated brand names, just the actual companies this dashboard already
// tracks (per the backend's system list). Sequence is duplicated once so
// the CSS-driven translateX(-50%) loop is seamless.
const SYSTEMS = ["SWAG Main", "LA ROUCHE", "Fashion Limits", "Different Clothes", "Stock"];

export default function LogoMarquee() {
  const seq = [...SYSTEMS, ...SYSTEMS];
  return (
    <section className="lp-section" style={{ paddingBlock: 48 }}>
      <div className="lp-marquee-label">Live across five connected companies</div>
      <div className="lp-marquee-mask">
        <div className="lp-marquee-track">
          {seq.map((name, i) => (
            <span className="lp-marquee-item" key={i}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
