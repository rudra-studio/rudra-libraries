import React from "react";

export interface FeatureCardProps { title?: string; description?: string; icon?: string }

export default function FeatureCard({ title = "Reusable building blocks", description = "Compose polished experiences quickly.", icon = "✦" }: FeatureCardProps) {
  return <article style={{ height: "100%", padding: 28, borderRadius: 18, border: "1px solid var(--rudra-color-border, #e2e8f0)", background: "var(--rudra-color-surface, #ffffff)", color: "var(--rudra-color-text, #0f172a)", boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)" }}>
    <span aria-hidden="true" style={{ display: "inline-grid", placeItems: "center", width: 44, height: 44, borderRadius: 12, background: "#dbeafe", color: "#1d4ed8", fontSize: 24 }}>{icon}</span>
    <h2 style={{ margin: "20px 0 10px", fontSize: 22 }}>{title}</h2>
    <p style={{ margin: 0, lineHeight: 1.65, color: "var(--rudra-color-muted, #475569)" }}>{description}</p>
  </article>;
}