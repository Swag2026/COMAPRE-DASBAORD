import PillButton from "./PillButton";

export default function StickyCircleCTA() {
  return (
    <section className="lp-cta lp-reveal" id="contact">
      <div className="lp-cta-content">
        <h2 className="lp-heading">Ready to see every branch in one place?</h2>
        <p>Sign in with your SWAG account to open the live dashboard.</p>
        <PillButton to="/login">Sign in to your dashboard</PillButton>
      </div>
    </section>
  );
}
