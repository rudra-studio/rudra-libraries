import React from "react";

export interface NavbarProps { brand?: string }

export default function Navbar({ brand = "Rudra" }: NavbarProps) {
  return <nav aria-label="Main navigation" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px clamp(20px, 5vw, 72px)", background: "var(--rudra-color-surface, #ffffff)", color: "var(--rudra-color-text, #0f172a)", borderBottom: "1px solid var(--rudra-color-border, #e2e8f0)" }}>
    <strong style={{ fontSize: 22 }}>{brand}</strong>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
      <a href="#features">Features</a><a href="#about">About</a><a href="#contact">Contact</a>
    </div>
  </nav>;
}