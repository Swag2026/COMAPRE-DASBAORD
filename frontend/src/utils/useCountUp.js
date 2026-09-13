import { useEffect, useRef, useState } from "react";

/**
 * Animates from 0 (or the previous value) to `target` over `duration` ms.
 * Only animates when target is a finite number — string values (like
 * "3/5" or "1.1K") pass through unchanged.
 */
export default function useCountUp(target, duration = 700) {
  const isNumeric = typeof target === "number" && Number.isFinite(target);
  const [display, setDisplay] = useState(isNumeric ? 0 : target);
  const startRef = useRef(null);
  const fromRef = useRef(0);

  useEffect(() => {
    if (!isNumeric) {
      setDisplay(target);
      return;
    }
    fromRef.current = 0;
    startRef.current = null;
    let raf;

    function step(ts) {
      if (startRef.current === null) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(fromRef.current + (target - fromRef.current) * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, isNumeric]);

  return display;
}
