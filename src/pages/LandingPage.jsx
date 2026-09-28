import { useEffect } from "react";
import "../styles/landing.css";
import FloatingHeader from "../components/landing/FloatingHeader";
import HeroOrbit from "../components/landing/HeroOrbit";
import LogoMarquee from "../components/landing/LogoMarquee";
import IntroSection from "../components/landing/IntroSection";
import CaseStudyList from "../components/landing/CaseStudyList";
import ServiceCardGrid from "../components/landing/ServiceCardGrid";
import StickyCircleCTA from "../components/landing/StickyCircleCTA";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  // Reveal-on-scroll: any .lp-reveal element gets .in-view once it enters
  // the viewport. No-op (elements just render visible) under
  // prefers-reduced-motion since the CSS for that already disables the
  // transition.
  useEffect(() => {
    const els = document.querySelectorAll(".lp-reveal");
    if (!("IntersectionObserver" in window) || els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // The landing page's copy is English-only (it doesn't hook into the
  // dashboard's i18n system), but the dashboard defaults document.dir to
  // "rtl" (Arabic default). Force ltr/en on this subtree regardless of
  // that global default so punctuation, nav order and text-align render
  // correctly, without touching the dashboard's own RTL behavior.
  return (
    <div className="lp-root" dir="ltr" lang="en">
      <FloatingHeader />
      <HeroOrbit />
      <LogoMarquee />
      <IntroSection />
      <CaseStudyList />
      <ServiceCardGrid />
      <StickyCircleCTA />
      <Footer />
    </div>
  );
}
