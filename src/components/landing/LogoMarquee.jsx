const SYSTEMS = ["SWAG Main", "LA ROUCHE", "Fashion Limits", "Different Clothes", "Stock"];

export default function LogoMarquee() {
  const seq = [...SYSTEMS, ...SYSTEMS];
  return (
    <section className="lp-section" style={{ paddingBlock: 40 }}>
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
