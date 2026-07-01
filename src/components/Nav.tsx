"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { useFavorites } from "@/lib/useFavorites";

const links = [
  { label: "Residences", href: "/residences" },
  { label: "Agents", href: "/agents" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
];

export default function Nav({ transparent = false }: { transparent?: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count } = useFavorites();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overlayMode = transparent && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        overlayMode
          ? "bg-transparent"
          : "bg-bg/85 backdrop-blur-xl border-b border-border"
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between">
        <Logo light={overlayMode} />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname.startsWith(l.href) && l.href !== "/";
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  overlayMode
                    ? "text-white/85 hover:text-white"
                    : active
                      ? "text-fg"
                      : "text-fg-muted hover:text-fg"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/saved"
            aria-label="Saved residences"
            className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
              overlayMode ? "text-white/85 hover:bg-white/15" : "text-fg-muted hover:bg-surface-2 hover:text-fg"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M19 14l-7 7-7-7a4.5 4.5 0 1 1 7-5.5 4.5 4.5 0 1 1 7 5.5z" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-medium text-white">
                {count}
              </span>
            )}
          </Link>
          <Link
            href="/signin"
            className={`text-sm ${overlayMode ? "text-white/80 hover:text-white" : "text-fg-muted hover:text-fg"}`}
          >
            Sign in
          </Link>
          <Link
            href="#contact"
            className={`btn ${overlayMode ? "bg-white text-fg hover:bg-brand-soft" : "btn-primary"}`}
          >
            Book a viewing
          </Link>
        </div>

        <button
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
          className={`md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border ${
            overlayMode ? "border-white/30 text-white" : "border-border text-fg"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-bg/95 backdrop-blur-xl">
          <nav className="container-x flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-fg-muted hover:bg-surface-2 hover:text-fg"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/signin"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-lg border-t border-border px-3 py-3 text-fg-muted hover:bg-surface-2 hover:text-fg"
            >
              Sign in
            </Link>
            <Link
              href="#contact"
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-2"
            >
              Book a viewing
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
