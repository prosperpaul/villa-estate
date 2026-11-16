"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import Icon from "./Icon";
import { useFavorites } from "@/lib/useFavorites";

const links = [
  { label: "Residences", href: "/residences" },
  { label: "Agents", href: "/agents" },
  { label: "Mortgage", href: "/mortgage" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
];

// `transparent` is accepted so older pages that pass it still compile,
// but the Haven header is always solid cream with a hairline (no glass blur).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Nav({ transparent = false }: { transparent?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { count } = useFavorites();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-bg">
      <div className="container-x flex h-20 items-center justify-between gap-6">
        <Logo />

        {/* Desktop links: uppercase label style, terracotta underline when active */}
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`border-b pb-0.5 text-[12px] font-medium uppercase leading-4 tracking-[0.06em] transition-colors ${
                  active
                    ? "border-brand font-semibold text-brand"
                    : "border-transparent text-fg-muted hover:text-brand"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          <Link
            href="/saved"
            aria-label="Saved residences"
            className="relative p-2 text-fg-muted transition-colors hover:text-brand"
          >
            <Icon name="heart" className="h-[22px] w-[22px]" />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold leading-none text-bg">
                {count}
              </span>
            )}
          </Link>
          <Link
            href="/signin"
            className="hidden text-[14px] font-semibold tracking-[0.04em] text-fg transition-colors hover:text-brand sm:inline-block"
          >
            Sign in
          </Link>
          <Link href="/list-property" className="btn btn-primary hidden !px-5 !py-2.5 sm:inline-flex">
            List a property
          </Link>

          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-fg lg:hidden"
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {/* Mobile menu: flat cream panel, links separated by hairlines */}
      {open && (
        <div className="border-t border-border bg-bg lg:hidden">
          <nav className="container-x flex flex-col divide-y divide-border py-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3.5 text-[12px] font-medium uppercase tracking-[0.06em] text-fg-muted hover:text-brand"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/signin"
              onClick={() => setOpen(false)}
              className="py-3.5 text-[12px] font-medium uppercase tracking-[0.06em] text-fg-muted hover:text-brand"
            >
              Sign in
            </Link>
            <div className="py-4">
              <Link href="/list-property" onClick={() => setOpen(false)} className="btn btn-primary w-full">
                List a property
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
