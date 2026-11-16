"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Agent } from "@/lib/agents";
import type { Currency } from "@/lib/residences";
import { formatPriceShort } from "@/lib/format";
import Icon from "./Icon";

/** Listing stats for one agent, worked out on the server from real residences. */
export type AgentStats = { count: number; min?: number; max?: number; currency?: Currency };

const ALL = "All";

export default function AgentsDirectory({ agents, stats }: { agents: Agent[]; stats: Record<string, AgentStats> }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState(ALL);
  const [area, setArea] = useState(ALL);

  // Filter chips come straight from the data
  const cities = useMemo(() => [ALL, ...new Set(agents.map((a) => a.basedIn))], [agents]);
  const areas = useMemo(() => [ALL, ...new Set(agents.flatMap((a) => a.expertise))], [agents]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return agents.filter((a) => {
      if (city !== ALL && a.basedIn !== city) return false;
      if (area !== ALL && !a.expertise.includes(area)) return false;
      if (!q) return true;
      // Search across everything a visitor might type
      return [a.name, a.role, a.basedIn, ...a.expertise, ...a.languages].some((t) => t.toLowerCase().includes(q));
    });
  }, [agents, query, city, area]);

  return (
    <>
      {/* Search + chips */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 focus-within:border-brand">
          <Icon name="search" className="h-5 w-5 text-fg-subtle" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by agent name, office or area"
            aria-label="Search agents"
            className="w-full bg-transparent py-3 outline-none"
          />
        </label>
        <ChipRow label="Office" options={cities} value={city} onChange={setCity} strong />
        <ChipRow label="Area" options={areas} value={area} onChange={setArea} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-4">
        <span className="eyebrow flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-fg" />
          Showing {results.length} of {agents.length} advisors
        </span>
        <span className="eyebrow flex items-center gap-1.5 !text-brand">
          <Icon name="shield" className="h-4 w-4" />
          Background-checked
        </span>
      </div>

      {results.length === 0 ? (
        <p className="py-16 text-center text-fg-muted">
          No advisors match.{" "}
          <button type="button" onClick={() => { setQuery(""); setCity(ALL); setArea(ALL); }} className="link-editorial">
            Clear filters
          </button>
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 pt-5 md:grid-cols-2">
          {results.map((a) => <AgentCard key={a.slug} a={a} s={stats[a.slug] ?? { count: 0 }} />)}
        </div>
      )}
    </>
  );
}

function AgentCard({ a, s }: { a: Agent; s: AgentStats }) {
  const range =
    s.count > 0 && s.min != null && s.max != null && s.currency
      ? s.min === s.max
        ? formatPriceShort(s.min, s.currency)
        : `${formatPriceShort(s.min, s.currency)} – ${formatPriceShort(s.max, s.currency)}`
      : null;
  const [first, second, ...restAreas] = a.expertise;
  const wa = a.phone.replace(/\D/g, "");

  return (
    <article className="flex flex-col rounded-lg border border-border bg-surface p-4 transition-colors hover:border-brand/50">
      <div className="flex gap-4">
        <Link href={`/agents/${a.slug}`} className="relative h-24 w-20 shrink-0 overflow-hidden rounded bg-sand">
          {a.photo ? (
            <Image src={a.photo} alt={a.name} fill sizes="80px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center font-display text-[28px]">{a.initials}</span>
          )}
          {a.accreditation && (
            <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-verified text-bg">
              <Icon name="check" className="h-3 w-3" strokeWidth={2.5} />
            </span>
          )}
        </Link>
        <div className="min-w-0">
          {a.accreditation && (
            <span className="badge badge-verified mb-1 !px-2 !py-0.5 !text-[10px]">
              <Icon name="verified" className="h-3 w-3" />
              {a.accreditation}
            </span>
          )}
          <h2 className="truncate font-display text-[24px] leading-8">
            <Link href={`/agents/${a.slug}`} className="hover:text-brand">{a.name}</Link>
          </h2>
          <p className="truncate text-[13px] text-fg-muted">{a.role} · {a.basedIn}</p>
          <p className="pt-0.5 text-[12px] text-fg-subtle">Speaks {a.languages.join(", ")}</p>
        </div>
      </div>

      <div className="mt-4 rounded border border-border bg-bg p-3">
        <div className="flex flex-wrap gap-1.5">
          {[first, second].filter(Boolean).map((e) => (
            <span key={e} className="badge !normal-case !tracking-[0.02em]">{e}</span>
          ))}
        </div>
        <p className="mt-2 flex items-start gap-1.5 text-[13px] leading-5 text-fg-muted">
          <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="truncate">{restAreas.length ? restAreas.join(", ") : `Based in ${a.basedIn}`}</span>
        </p>
        <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-border pt-3">
          <span className="eyebrow">{s.count} active listing{s.count === 1 ? "" : "s"}</span>
          {range && <span className="font-display text-[20px] font-medium text-brand tnum">{range}</span>}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary flex-1 !px-3 !py-2 text-[12px]">
          <Icon name="chat" className="h-4 w-4 text-verified" /> WhatsApp
        </a>
        <a href={`tel:${a.phone.replace(/\s/g, "")}`} className="btn btn-primary flex-1 !px-3 !py-2 text-[12px]">
          <Icon name="phone" className="h-4 w-4" /> Direct call
        </a>
        <Link href={`/agents/${a.slug}`} aria-label={`View ${a.name}'s profile`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-fg-muted hover:bg-sand hover:text-fg">
          <Icon name="more" className="h-5 w-5" strokeWidth={3} />
        </Link>
      </div>
    </article>
  );
}

// Horizontally scrolling chip row (scrolls sideways on phones)
function ChipRow({
  label, options, value, onChange, strong = false,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  strong?: boolean;
}) {
  return (
    <div role="group" aria-label={label} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
      {options.map((o) => {
        const on = value === o;
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-[12px] font-medium tracking-[0.04em] transition-colors ${
              on
                ? strong ? "bg-brand text-bg" : "bg-fg text-bg"
                : "bg-sand/70 text-fg hover:bg-sand"
            }`}
          >
            {o === ALL ? `All ${label === "Office" ? "offices" : "areas"}` : o}
          </button>
        );
      })}
    </div>
  );
}
