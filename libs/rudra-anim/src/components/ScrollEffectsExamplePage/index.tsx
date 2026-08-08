
import  TwoDScrollExample  from "../TwoDScrollExample";
import ThreeDModelScrollExample from "../ThreeDModelScrollExample";

const sectionStyle: React.CSSProperties = {
  minHeight: "70vh",
  display: "grid",
  placeItems: "center",
  padding: "6rem 1.5rem",
  background: "#030507",
  color: "white",
  textAlign: "center",
};

export default function ScrollEffectsExamplePage() {
  return (
    <main
      style={{
        margin: 0,
        background: "#030507",
        fontFamily:
          "Inter, system-ui, sans-serif",
      }}
    >
      <TwoDScrollExample />

      <section style={sectionStyle}>
        <div>
          <p
            style={{
              margin: "0 0 12px",
              color: "rgba(255,255,255,0.55)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontSize: 13,
            }}
          >
            Approach comparison
          </p>

          <h2
            style={{
              maxWidth: 900,
              margin: 0,
              fontSize:
                "clamp(2.4rem, 6vw, 5rem)",
              lineHeight: 1,
              letterSpacing: "-0.05em",
            }}
          >
            The same scroll engine can power both
            rendering approaches.
          </h2>
        </div>
      </section>

      <ThreeDModelScrollExample />
    </main>
  );
}