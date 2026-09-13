export default function SkeletonRows({ columns, rowCount = 8 }) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  background: "var(--odoo-purple)",
                  color: "#fff",
                  padding: "12px 14px",
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  textAlign: c.align === "right" ? "right" : "left",
                  whiteSpace: "nowrap",
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, r) => (
            <tr key={r} style={{ borderBottom: "1px solid #F3F4F6" }}>
              {columns.map((c, ci) => (
                <td key={c.key} style={{ padding: "10px 14px" }}>
                  <div
                    className="skeleton-bar"
                    style={{
                      height: 12,
                      borderRadius: 4,
                      width: ci === 0 ? "60%" : `${60 + ((r * 7 + ci * 13) % 30)}%`,
                      animationDelay: `${(r * columns.length + ci) * 0.02}s`,
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <style>{`
        .skeleton-bar {
          background: linear-gradient(90deg, #EEF1F4 25%, #F7F9FA 37%, #EEF1F4 63%);
          background-size: 400% 100%;
          animation: skeletonShimmer 1.4s ease infinite;
        }
        @keyframes skeletonShimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }
      `}</style>
    </div>
  );
}
