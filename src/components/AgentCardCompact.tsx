import Link from "next/link";
import type { Agent } from "@/lib/agents";

export default function AgentCardCompact({ a, listings = 0 }: { a: Agent; listings?: number }) {
  return (
    <Link
      href={`/agents/${a.slug}`}
      className="group block rounded-2xl border border-border bg-surface p-6 lift hover:border-fg/30"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-lg font-medium text-brand">
          {a.initials}
        </div>
        <div className="min-w-0">
          <div className="truncate font-display text-lg text-fg">{a.name}</div>
          <div className="truncate text-sm text-fg-muted">{a.role} · {a.basedIn}</div>
        </div>
      </div>

      <p className="mt-5 line-clamp-3 text-[14px] leading-relaxed text-fg-muted">
        “{a.letter}”
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm">
        <span className="text-fg-muted">{listings} residences</span>
        <span className="text-fg group-hover:text-brand">View profile →</span>
      </div>
    </Link>
  );
}
