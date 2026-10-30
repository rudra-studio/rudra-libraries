import React from "react";

export interface LandingPageProps {
  theme?: "light" | "dark";
  brand?: string;
  eyebrow?: string;
  headline?: string;
  description?: string;
  primaryAction?: string;
  secondaryAction?: string;
}

export default function LandingPage({
  theme = "light",
  brand = "Rudra",
  eyebrow = "VISUAL APPLICATION PLATFORM",
  headline = "From idea to working application.",
  description = "Design reusable interfaces, connect real workflows, and publish production-ready experiences from one collaborative workspace.",
  primaryAction = "Start building",
  secondaryAction = "Explore the platform",
}: LandingPageProps) {
  const dark = theme === "dark";
  const colors = dark
    ? { bg: "#07101f", surface: "#0d192b", raised: "#13233a", text: "#f8fafc", muted: "#9fb0c8", border: "#263a55", accent: "#7dd3fc", accentStrong: "#38bdf8" }
    : { bg: "#f7fafc", surface: "#ffffff", raised: "#eef6ff", text: "#0f172a", muted: "#526277", border: "#d9e4f0", accent: "#0369a1", accentStrong: "#0284c7" };
  const features = [
    ["01", "Reusable by design", "Build once with Libraries and Modules, then compose consistent experiences across routes."],
    ["02", "Real workflows", "Connect APIs, data, state, and orchestration without losing visibility into runtime behavior."],
    ["03", "Ready to publish", "Preview responsive themes, validate contracts, and ship versioned application bundles."],
  ];

  return <main data-theme={theme} style={{ minHeight: "100vh", background: colors.bg, color: colors.text, fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 18, maxWidth: 1180, margin: "0 auto", padding: "22px clamp(20px, 5vw, 64px)", borderBottom: "1px solid " + colors.border }}>
      <a href="#top" style={{ color: colors.text, textDecoration: "none", fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>{brand}<span style={{ color: colors.accentStrong }}>.</span></a>
      <nav aria-label="Main navigation" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "clamp(16px, 3vw, 32px)", fontSize: 14, fontWeight: 600 }}>
        <a href="#capabilities" style={{ color: colors.muted, textDecoration: "none" }}>Capabilities</a>
        <a href="#workflow" style={{ color: colors.muted, textDecoration: "none" }}>Workflow</a>
        <a href="#contact" style={{ color: colors.muted, textDecoration: "none" }}>Contact</a>
      </nav>
    </header>

    <section id="top" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", alignItems: "center", gap: "clamp(38px, 7vw, 88px)", maxWidth: 1180, margin: "0 auto", padding: "clamp(64px, 10vw, 126px) clamp(20px, 5vw, 64px)" }}>
      <div>
        <p style={{ margin: "0 0 20px", color: colors.accent, fontSize: 13, fontWeight: 800, letterSpacing: "0.16em" }}>{eyebrow}</p>
        <h1 style={{ maxWidth: 760, margin: 0, fontSize: "clamp(44px, 7vw, 82px)", lineHeight: 0.98, letterSpacing: "-0.055em", fontWeight: 800 }}>{headline}</h1>
        <p style={{ maxWidth: 650, margin: "28px 0 34px", color: colors.muted, fontSize: "clamp(17px, 2vw, 20px)", lineHeight: 1.65 }}>{description}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          <a href="#capabilities" style={{ padding: "14px 22px", borderRadius: 999, background: colors.accentStrong, color: "#ffffff", textDecoration: "none", fontWeight: 750 }}>{primaryAction} <span aria-hidden="true">→</span></a>
          <a href="#workflow" style={{ padding: "13px 22px", borderRadius: 999, border: "1px solid " + colors.border, color: colors.text, textDecoration: "none", fontWeight: 700 }}>{secondaryAction}</a>
        </div>
      </div>
      <div aria-label="Rudra workflow preview" style={{ position: "relative", padding: "clamp(20px, 4vw, 36px)", border: "1px solid " + colors.border, borderRadius: 28, background: colors.surface, boxShadow: dark ? "0 32px 80px rgba(0,0,0,.32)" : "0 32px 80px rgba(36,70,110,.14)" }}>
        <div style={{ display: "flex", gap: 7, marginBottom: 28 }}><i style={{ width: 9, height: 9, borderRadius: 99, background: "#fb7185" }} /><i style={{ width: 9, height: 9, borderRadius: 99, background: "#fbbf24" }} /><i style={{ width: 9, height: 9, borderRadius: 99, background: "#34d399" }} /></div>
        {["Library · Design system", "Module · Product workflow", "Application · Published route"].map((label, index) => <div key={label} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: index ? 14 : 0, padding: "18px 20px", borderRadius: 16, background: index === 2 ? colors.accentStrong : colors.raised, color: index === 2 ? "#ffffff" : colors.text, fontWeight: 700 }}><span style={{ display: "grid", placeItems: "center", width: 28, height: 28, borderRadius: 9, background: index === 2 ? "rgba(255,255,255,.18)" : colors.surface, fontSize: 12 }}>{index + 1}</span>{label}</div>)}
      </div>
    </section>

    <section id="capabilities" style={{ maxWidth: 1180, margin: "0 auto", padding: "20px clamp(20px, 5vw, 64px) clamp(74px, 10vw, 120px)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 245px), 1fr))", gap: 18 }}>
        {features.map(([number, title, copy]) => <article key={number} style={{ padding: "clamp(24px, 3vw, 34px)", border: "1px solid " + colors.border, borderRadius: 22, background: colors.surface }}><span style={{ color: colors.accent, fontSize: 12, fontWeight: 800, letterSpacing: ".12em" }}>{number}</span><h2 style={{ margin: "42px 0 12px", fontSize: 23, letterSpacing: "-.025em" }}>{title}</h2><p style={{ margin: 0, color: colors.muted, lineHeight: 1.7 }}>{copy}</p></article>)}
      </div>
    </section>

    <section id="workflow" style={{ background: colors.raised, borderTop: "1px solid " + colors.border, borderBottom: "1px solid " + colors.border }}><div style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(56px, 8vw, 92px) clamp(20px, 5vw, 64px)", textAlign: "center" }}><p style={{ margin: "0 0 14px", color: colors.accent, fontWeight: 800, letterSpacing: ".12em", fontSize: 12 }}>ONE CONNECTED WORKSPACE</p><h2 style={{ maxWidth: 760, margin: "0 auto", fontSize: "clamp(32px, 5vw, 54px)", lineHeight: 1.08, letterSpacing: "-.04em" }}>Make the architecture visible. Keep the experience beautiful.</h2></div></section>
    <footer id="contact" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 18, maxWidth: 1180, margin: "0 auto", padding: "34px clamp(20px, 5vw, 64px)", color: colors.muted, fontSize: 14 }}><span>© 2026 {brand}</span><span>Built for responsive, accessible experiences.</span></footer>
  </main>;
}