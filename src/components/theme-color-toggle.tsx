"use client";

import * as React from "react";
import { useEffect, useState } from "react";

const themes = [
  { name: "default", color: "bg-red-500" },
  { name: "zinc", color: "bg-zinc-500" },
  { name: "blue", color: "bg-blue-500" },
  { name: "violet", color: "bg-violet-500" },
  { name: "rose", color: "bg-rose-500" }
];

export function ThemeColorToggle() {
  const [mounted, setMounted] = useState(false);
  const [activeTheme, setActiveTheme] = useState("default");

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme-color") || "default";
    setActiveTheme(savedTheme);
    if (savedTheme !== "default") {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  const setThemeColor = (themeName: string) => {
    setActiveTheme(themeName);
    localStorage.setItem("theme-color", themeName);
    if (themeName === "default") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", themeName);
    }
  };

  return (
    <div className="flex items-center space-x-2 border rounded-full px-2 py-1 bg-background/50">
      {themes.map((t) => (
        <button
          key={t.name}
          onClick={() => setThemeColor(t.name)}
          className={`h-4 w-4 rounded-full transition-all ${t.color} ${
            activeTheme === t.name
              ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
              : "hover:scale-110 opacity-70"
          }`}
          aria-label={`Switch to ${t.name} theme`}
        />
      ))}
    </div>
  );
}
