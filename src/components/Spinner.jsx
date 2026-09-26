export default function Spinner({ size = 20, color = "var(--odoo-purple)" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: "swagSpin 0.8s linear infinite" }}
    >
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.5" opacity="0.2" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <style>{`
        @keyframes swagSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </svg>
  );
}
