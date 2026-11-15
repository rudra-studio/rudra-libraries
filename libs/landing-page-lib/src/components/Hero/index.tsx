import React from "react";

export interface HeroProps { theme?: string }

export default function Hero({ theme = "light" }: HeroProps) {
  return <section style={{ padding: "clamp(72px, 12vw, 152px) clamp(20px, 7vw, 96px)", textAlign: "center", background: theme === "dark" ? "#0f172a" : "#eff6ff", color: theme === "dark" ? "#f8fafc" : "#0f172a" }}>
    <p style={{ color: "#2563eb", fontWeight: 700 }}>RUDRA NO-CODE PLATFORM</p>
    <h1 style={{ maxWidth: 900, margin: "16px auto", fontSize: "clamp(40px, 7vw, 76px)", lineHeight: 1.05 }}>Build applications without writing code</h1>
    <p style={{ maxWidth: 680, margin: "0 auto 32px", fontSize: 20, lineHeight: 1.6 }}>Create responsive, accessible applications from reusable visual building blocks.</p>
    <a href="#features" style={{ display: "inline-block", padding: "14px 24px", borderRadius: 12, background: "#2563eb", color: "white", fontWeight: 700 }}>Get started</a>
  </section>;
}