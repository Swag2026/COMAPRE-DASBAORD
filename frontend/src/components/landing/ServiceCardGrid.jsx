import { BarChart3, RefreshCw, Bell, Truck, FileSpreadsheet, MessageCircle } from "lucide-react";

const SERVICES = [
  { Icon: BarChart3, title: "Product comparison", body: "Compare stock, price and performance across branches and companies side by side." },
  { Icon: Bell, title: "Reorder alerts", body: "Automatic low-stock and critical-priority flags before you run out." },
  { Icon: Truck, title: "Branch transfers", body: "Track stock moving between branches from request through receipt." },
  { Icon: RefreshCw, title: "Season comparison", body: "See how this season's stock and sales stack up against last season's." },
  { Icon: FileSpreadsheet, title: "Excel & PDF import", body: "Bring in vendor and branch data straight from the files you already use." },
  { Icon: MessageCircle, title: "WhatsApp sharing", body: "Send any report straight to a branch manager's WhatsApp in one tap." },
];

export default function ServiceCardGrid() {
  return (
    <section className="lp-services" id="services">
      <div className="lp-container lp-section">
        <div className="lp-services-head lp-reveal">
          <span className="lp-eyebrow">What it does</span>
          <h2 className="lp-heading">Every module, one dashboard.</h2>
          <p>Six tools, one login, five connected brands.</p>
        </div>
        <div className="lp-service-grid">
          {SERVICES.map((s) => (
            <div className="lp-service-card lp-reveal" key={s.title}>
              <span className="lp-service-icon"><s.Icon size={20} strokeWidth={1.7} /></span>
              <h4 className="lp-service-title">{s.title}</h4>
              <p className="lp-service-desc">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
