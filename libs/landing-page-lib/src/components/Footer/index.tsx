import React from "react";

export interface FooterProps { theme?: string }

export default function Footer({ theme = "dark" }: FooterProps) {
  const dark = theme === "dark";
  return <footer id="contact" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 20, padding: "32px clamp(20px, 5vw, 72px)", background: dark ? "#020617" : "#f8fafc", color: dark ? "#cbd5e1" : "#334155" }}>
    <span>© 2026 Rudra. All rights reserved.</span>
    <nav aria-label="Footer navigation" style={{ display: "flex", gap: 18 }}><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav>
  </footer>;
}