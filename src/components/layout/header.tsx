"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeColorToggle } from "@/components/theme-color-toggle";
import { Button } from "@/components/ui/button";

const Search = dynamic(
  () => import("@/components/search").then((mod) => mod.Search),
  {
    loading: () => (
      <div className="h-9 w-9 md:w-64 bg-muted animate-pulse rounded-md border border-input" />
    )
  }
);

const navLinks = [
  { href: "/topics", label: "Topics" },
  { href: "/questions", label: "Interview Questions" }
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Main header row */}
      <div className="container mx-auto px-4 md:px-8 flex h-14 items-center justify-between">
        {/* Left: Logo + desktop nav */}
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold inline-block">Frontend Engine</span>
          </Link>
          {/* Desktop nav — hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Search + toggles + hamburger */}
        <div className="flex items-center space-x-2">
          <Search />
          {/* Theme controls — hidden on mobile to save space */}
          <div className="hidden sm:flex items-center space-x-2">
            <ThemeColorToggle />
            <ModeToggle />
          </div>
          {/* Mobile: just dark mode toggle */}
          <div className="flex sm:hidden items-center space-x-1">
            <ModeToggle />
          </div>
          {/* Hamburger — only on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/98 backdrop-blur">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {/* Theme color toggle in mobile menu */}
            <div className="flex items-center px-3 py-2.5 gap-2">
              <span className="text-xs text-muted-foreground font-medium mr-1">
                Theme:
              </span>
              <ThemeColorToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
