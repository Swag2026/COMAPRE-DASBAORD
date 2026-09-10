export default function HeroHeader({ title, subtitle }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1A7A82 0%, #145F66 50%, #0D4A50 100%)",
        borderRadius: 16,
        padding: "26px 30px",
        marginBottom: 18,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-50%",
          right: "-8%",
          width: 260,
          height: 260,
          background: "rgba(255,255,255,0.05)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: "#fff",
          marginBottom: 4,
          position: "relative",
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            fontSize: 10.5,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            fontWeight: 600,
            position: "relative",
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}
