"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavorites } from "@/lib/useFavorites";
import Icon, { type IconName } from "./Icon";

const tabs: { label: string; href: string; icon: IconName }[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Residences", href: "/residences", icon: "search" },
  { label: "Saved", href: "/saved", icon: "heart" },
  { label: "Mortgage", href: "/mortgage", icon: "doc" },
  { label: "Agents", href: "/agents", icon: "user" },
];

// Bottom navigation for phones and tablets. Hidden on desktop, where the top nav is enough.
export default function MobileTabBar() {
  const pathname = usePathname();
  const { count } = useFavorites();

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {tabs.map((t) => {
          const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] ${
                  active ? "text-brand" : "text-fg-muted"
                }`}
              >
                <Icon name={t.icon} className="h-5 w-5" filled={t.icon === "heart" && active} />
                {t.label}
                {t.href === "/saved" && count > 0 && (
                  <span className="absolute right-[calc(50%-18px)] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] text-bg">
                    {count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
