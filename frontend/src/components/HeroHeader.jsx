export default function HeroHeader({ title, subtitle }) {
  return (
    <div className="hero-header">
      <div className="hero-orb" />
      <div className="hero-title">
        {title}
      </div>
      {subtitle && <div className="hero-subtitle">{subtitle}</div>}
    </div>
  );
}
