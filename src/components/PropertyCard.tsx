"use client";

import Image from "next/image";
import Link from "next/link";
import type { Residence } from "@/lib/residences";
import { formatArea, formatPrice } from "@/lib/format";
import { useFavorites } from "@/lib/useFavorites";

export default function PropertyCard({ r, priority = false }: { r: Residence; priority?: boolean }) {
  const { has, toggle, hydrated } = useFavorites();
  const saved = hydrated && has(r.slug);

  return (
    <Link
      href={`/residences/${r.slug}`}
      className="group block lift"
    >
      <div className="photo relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-2">
        {r.cover ? (
          <Image
            src={r.cover}
            alt={r.name}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
            priority={priority}
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-wider text-fg-subtle">
            No image
          </div>
        )}

        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-fg shadow-soft">
            {r.status}
          </span>
        </div>

        <button
          aria-label={saved ? "Remove from saved" : "Save"}
          aria-pressed={saved}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(r.slug);
          }}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-fg shadow-soft transition hover:scale-110"
        >
          <svg
            viewBox="0 0 24 24"
            className={`h-4 w-4 transition-colors ${saved ? "text-brand" : "text-fg"}`}
            fill={saved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M19 14l-7 7-7-7a4.5 4.5 0 1 1 7-5.5 4.5 4.5 0 1 1 7 5.5z" />
          </svg>
        </button>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent p-4 text-white">
          <div className="text-[12px] uppercase tracking-wider text-white/80">
            {r.location.town}, {r.location.country}
          </div>
          <div className="mt-1 font-display text-2xl leading-tight">{r.name}</div>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wider text-fg-subtle">
            Guide price
          </div>
          <div className="mt-0.5 font-display text-xl text-fg tnum">
            {formatPrice(r.price, r.currency)}
          </div>
        </div>
        <ul className="flex items-center gap-4 text-sm text-fg-muted">
          <li className="flex items-center gap-1.5">
            <Icon path="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 14h18M7 9V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
            {r.beds}
          </li>
          <li className="flex items-center gap-1.5">
            <Icon path="M4 11h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3ZM7 11V6a2 2 0 0 1 4 0v1" />
            {r.baths}
          </li>
          <li className="hidden items-center gap-1.5 sm:flex">
            <Icon path="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" />
            {formatArea(r.interiorArea)}
          </li>
        </ul>
      </div>
    </Link>
  );
}

function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-fg-subtle" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d={path} />
    </svg>
  );
}
