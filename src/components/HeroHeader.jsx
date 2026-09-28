export default function HeroHeader({ title, subtitle, live = "Live" }) {
  return (
    <div className="hero-header">
      <div className="hero-orb" />
      <div className="hero-mark">●</div>
      <span className="hero-live">
        <span className="hero-live-dot" /> {live}
      </span>
      <div className="hero-title">
        {title}
      </div>
      {subtitle && <div className="hero-subtitle">{subtitle}</div>}
    </div>
  );
}
