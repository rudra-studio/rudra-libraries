import React from "react";

export interface AppSidebarProps { isDarkMode?: boolean; onThemeChange?: (theme: "light" | "dark") => void }

export default function AppSidebar({ isDarkMode = false, onThemeChange }: AppSidebarProps) {
  return <aside style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 220, padding: 24, background: isDarkMode ? "#0f172a" : "#f8fafc", color: isDarkMode ? "#f8fafc" : "#0f172a" }}>
    <a href="#home">Home</a><a href="#features">Features</a><a href="#contact">Contact</a>
    <button type="button" onClick={() => onThemeChange?.(isDarkMode ? "light" : "dark")}>Use {isDarkMode ? "light" : "dark"} theme</button>
  </aside>;
}