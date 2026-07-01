"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import { useSession } from "./SessionProvider";
import { signOutAction } from "@/app/signin/actions";

const navGroups = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", href: "/admin", icon: "grid" },
      { label: "Residences", href: "/admin/residences", icon: "home" },
      { label: "Agents", href: "/admin/agents", icon: "users" },
      { label: "Inbox", href: "/admin/inbox", icon: "mail", badge: 4 },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Journal", href: "/admin/journal", icon: "book" },
      { label: "Media library", href: "/admin/media", icon: "image" },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Team", href: "/admin/team", icon: "users" },
      { label: "Settings", href: "/admin/settings", icon: "settings" },
    ],
  },
];

const icons: Record<string, string> = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  home: "M3 11l9-8 9 8M5 9v11h14V9",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M17 3.13a4 4 0 0 1 0 7.75",
  mail: "M3 7h18v12H3zM3 7l9 7 9-7",
  book: "M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4zM4 4v12",
  image: "M3 4h18v16H3zM8 12l3 3 5-5 5 5",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.6 1.6 0 0 0 .3 1.7l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.7-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.7.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.7 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.7.3h.1a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.7-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.7v.1a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z",
};

export default function AdminShell({ children, breadcrumb }: { children: React.ReactNode; breadcrumb: string }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const user = useSession();

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[260px] -translate-x-full border-r border-border bg-surface transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : ""
        }`}
      >
        <div className="flex h-[64px] items-center border-b border-border px-6">
          <Logo />
        </div>

        <nav className="px-3 py-5">
          {navGroups.map((g) => (
            <div key={g.label} className="mt-5 first:mt-0">
              <div className="px-3 text-[11px] font-medium uppercase tracking-wider text-fg-subtle">
                {g.label}
              </div>
              <ul className="mt-2 space-y-px">
                {g.items.map((it) => {
                  const active = pathname === it.href;
                  return (
                    <li key={it.href}>
                      <Link
                        href={it.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                          active
                            ? "bg-brand-soft text-brand"
                            : "text-fg-muted hover:bg-surface-2 hover:text-fg"
                        }`}
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d={icons[it.icon] || icons.grid} />
                        </svg>
                        <span className="flex-1">{it.label}</span>
                        {"badge" in it && it.badge ? (
                          <span className="rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-medium text-white">
                            {it.badge}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="absolute inset-x-3 bottom-4 rounded-xl border border-border bg-surface-2 p-4">
          <div className="relative flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-sm font-medium text-brand">
              {user?.initials ?? "—"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-fg">{user?.name ?? "Studio"}</div>
              <div className="truncate text-xs text-fg-muted">{user?.email ?? ""}</div>
            </div>
            <button
              onClick={() => setUserMenuOpen((o) => !o)}
              className="text-fg-muted hover:text-fg"
              aria-label="Account menu"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 5v.01M12 12v.01M12 19v.01" />
              </svg>
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute bottom-full right-0 z-40 mb-2 w-52 overflow-hidden rounded-lg border border-border bg-surface text-sm shadow-soft-lg">
                  <div className="border-b border-border px-3 py-2">
                    <div className="text-xs text-fg-subtle">Signed in as</div>
                    <div className="truncate font-medium text-fg">{user?.email}</div>
                    <div className="mt-1 inline-block rounded-full bg-brand-soft px-2 py-0.5 text-[10px] uppercase tracking-wider text-brand">
                      {user?.role}
                    </div>
                  </div>
                  <Link href="/admin/settings" className="block px-3 py-2 text-fg-muted hover:bg-surface-2 hover:text-fg">
                    Settings
                  </Link>
                  <Link href="/admin/team" className="block px-3 py-2 text-fg-muted hover:bg-surface-2 hover:text-fg">
                    Team
                  </Link>
                  <form action={signOutAction} className="border-t border-border">
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-fg-muted hover:bg-surface-2 hover:text-fg"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                      </svg>
                      Sign out
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex h-[64px] items-center justify-between gap-4 border-b border-border bg-bg/85 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-fg-muted hover:bg-surface-2 lg:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 8h16M4 16h16" />
              </svg>
            </button>
            <span className="text-sm text-fg-muted">Admin</span>
            <span className="text-fg-subtle">/</span>
            <span className="text-sm font-medium text-fg">{breadcrumb}</span>
          </div>

          <div className="hidden flex-1 items-center md:flex md:max-w-md md:mx-auto">
            <label className="relative w-full">
              <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                placeholder="Search residences, agents, inbox… (⌘ K)"
                className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm placeholder:text-fg-subtle focus:border-brand focus:outline-none"
              />
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-fg-muted hover:bg-surface-2 hover:text-fg">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
              </svg>
            </button>
            <button className="btn btn-primary text-sm">+ New residence</button>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
