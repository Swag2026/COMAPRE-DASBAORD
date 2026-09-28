import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Animated ring/donut chart. Ported from a shadcn+Tailwind component to
 * plain React + inline styles so it drops into this project (no
 * Tailwind/shadcn/TypeScript here) without a framework migration.
 *
 * data: [{ value, color, label }]
 */
export default function DonutChart({
  data,
  totalValue: propTotalValue,
  size = 200,
  strokeWidth = 20,
  animationDuration = 1,
  animationDelayPerSegment = 0.05,
  centerContent,
  onSegmentHover,
}) {
  const [hovered, setHovered] = useState(null);

  const total = useMemo(
    () => propTotalValue || data.reduce((sum, s) => sum + s.value, 0),
    [data, propTotalValue]
  );

  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    onSegmentHover?.(hovered);
  }, [hovered, onSegmentHover]);

  let cumulative = 0;

  return (
    <div
      style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: size, height: size }}
      onMouseLeave={() => setHovered(null)}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: "visible", transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(226,232,240,0.6)"
          strokeWidth={strokeWidth}
        />
        <AnimatePresence>
          {data.map((segment, i) => {
            if (segment.value === 0) return null;
            const pct = total === 0 ? 0 : (segment.value / total) * 100;
            const dash = `${(pct / 100) * circumference} ${circumference}`;
            const offset = (cumulative / 100) * circumference;
            const isActive = hovered?.label === segment.label;
            cumulative += pct;

            return (
              <motion.circle
                key={segment.label ?? i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={dash}
                strokeLinecap="round"
                initial={{ opacity: 0, strokeDashoffset: circumference }}
                animate={{ opacity: 1, strokeDashoffset: -offset }}
                transition={{
                  opacity: { duration: 0.3, delay: i * animationDelayPerSegment },
                  strokeDashoffset: { duration: animationDuration, delay: i * animationDelayPerSegment, ease: "easeOut" },
                }}
                style={{
                  cursor: "pointer",
                  transformOrigin: "center",
                  filter: isActive ? `drop-shadow(0px 0px 6px ${segment.color}) brightness(1.1)` : "none",
                  transform: isActive ? "scale(1.03)" : "scale(1)",
                  transition: "filter 0.2s ease-out, transform 0.2s ease-out",
                }}
                onMouseEnter={() => setHovered(segment)}
              />
            );
          })}
        </AnimatePresence>
      </svg>

      {centerContent && (
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            width: size - strokeWidth * 2.5,
            height: size - strokeWidth * 2.5,
          }}
        >
          {centerContent}
        </div>
      )}
    </div>
  );
}
