import { Package, BarChart3, Building2, Truck, Tag, ChevronDown } from "lucide-react";

// Five circular accents placed around the wordmark. There's no client
// photography to crop into circles (this is an internal tool, not a
// portfolio), so each circle carries one product icon instead — same
// staggered float/rotate choreography the brief calls for, honest content.
const ACCENTS = [
  { Icon: Package, top: "10%", left: "14%", size: 96, rot: -8, delay: "0s" },
  { Icon: BarChart3, top: "18%", left: "78%", size: 118, rot: 6, delay: "1.1s" },
  { Icon: Building2, top: "62%", left: "8%", size: 84, rot: 10, delay: "2.2s" },
  { Icon: Truck, top: "70%", left: "84%", size: 100, rot: -6, delay: "0.6s" },
  { Icon: Tag, top: "40%", left: "92%", size: 70, rot: 4, delay: "1.8s" },
];

export default function HeroOrbit() {
  return (
    <section className="lp-hero">
      {ACCENTS.map((a, i) => (
        <div
          key={i}
          className="lp-hero-orbit-img"
          style={{
            top: a.top,
            left: a.left,
            width: a.size,
            height: a.size,
            animationDelay: a.delay,
            "--r": `${a.rot}deg`,
          }}
        >
          <a.Icon size={a.size * 0.32} strokeWidth={1.4} />
        </div>
      ))}

      <div className="lp-hero-word">swag</div>

      <div className="lp-hero-bottom-row">
        <div className="lp-hero-proof">Since 2010 · 5 connected systems</div>
        <div className="lp-hero-value-prop">
          One live view of stock, transfers and reorders across every SWAG group brand.
        </div>
        <div className="lp-scroll-cue">
          Scroll
          <span className="lp-scroll-cue-dot"><ChevronDown size={15} /></span>
        </div>
      </div>
    </section>
  );
}
