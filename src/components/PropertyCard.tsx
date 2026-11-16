"use client";

import Image from "next/image";
import Link from "next/link";
import type { Residence } from "@/lib/residences";
import { formatPrice } from "@/lib/format";
import { isRent, specLine } from "@/lib/listing";
import { useFavorites } from "@/lib/useFavorites";
import Icon from "./Icon";

// Three layouts from the Haven design:
//  - "standard": compact card, used in every grid (default)
//  - "lead":     big hero card, first listing on the home page
//  - "wide":     horizontal photo + dossier strip
type Variant = "standard" | "lead" | "wide";

export default function PropertyCard({
  r,
  priority = false,
  variant = "standard",
}: {
  r: Residence;
  priority?: boolean;
  variant?: Variant;
}) {
  const { has, toggle, hydrated } = useFavorites();
  const saved = hydrated && has(r.slug);
  const wide = variant === "wide";
  const lead = variant === "lead";

  const place = [r.location.town, r.location.region, r.location.country].filter(Boolean).join(", ");
  const specs = specLine(r, { pool: true });

  return (
    <Link
      href={`/residences/${r.slug}`}
      className={`group flex h-full overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-brand/50 ${
        wide ? "flex-col md:flex-row" : "flex-col"
      }`}
    >
      {/* ---- Photo ---- */}
      <div
        className={`relative shrink-0 overflow-hidden bg-sand ${
          wide ? "h-[260px] md:h-auto md:w-5/12" : lead ? "h-[320px] sm:h-[400px]" : "h-[240px]"
        }`}
      >
        {r.cover ? (
          <Image
            src={r.cover}
            alt={r.name}
            fill
            priority={priority}
            sizes={lead ? "(min-width:1024px) 58vw, 100vw" : wide ? "(min-width:768px) 42vw, 100vw" : "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="eyebrow absolute inset-0 flex items-center justify-center">No image</div>
        )}

        {/* Max two badges per listing, per the design system */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="badge !bg-surface/95">{r.status}</span>
          <span className="badge">{r.type}</span>
        </div>

        {!wide && (
          <button
            type="button"
            aria-label={saved ? "Remove from saved" : "Save"}
            aria-pressed={saved}
            onClick={(e) => {
              e.preventDefault(); // don't follow the card link
              e.stopPropagation();
              toggle(r.slug);
            }}
            className={`absolute right-4 top-4 flex items-center justify-center rounded-full bg-surface/90 transition-colors hover:text-brand ${
              lead ? "h-9 w-9" : "h-8 w-8"
            } ${saved ? "text-brand" : "text-fg"}`}
          >
            <Icon name="heart" filled={saved} className="h-[18px] w-[18px]" />
          </button>
        )}

        {lead && (
          <span className="absolute bottom-3 left-4 rounded bg-fg/70 px-2.5 py-1 text-[11px] font-semibold uppercase leading-[14px] tracking-[0.08em] text-bg">
            {r.location.region} · {r.type}
          </span>
        )}
      </div>

      {/* ---- Dossier ---- */}
      <div className={`flex flex-grow flex-col justify-between ${lead || wide ? "gap-3 p-5" : "gap-1.5 p-3"}`}>
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="price-display text-brand">{formatPrice(r.price, r.currency)}{isRent(r) && <span className="pl-1 font-sans text-[13px] font-normal tracking-normal text-fg-muted">/ yr</span>}</span>
            {(lead || wide) && <span className="eyebrow">{r.issueNumber}</span>}
          </div>

          <h3
            className={`pt-1 text-fg transition-colors group-hover:text-brand ${
              lead || wide ? "headline-md" : "headline-sm line-clamp-1"
            }`}
          >
            {r.name}
          </h3>

          <p
            className={`flex items-center gap-1 pt-1 text-fg-muted ${
              lead || wide ? "" : "truncate text-[13px] leading-5"
            }`}
          >
            {(lead || wide) && <Icon name="pin" className="h-4 w-4 shrink-0 text-brand" />}
            <span className="truncate">{place}</span>
          </p>

          {wide && r.abstract && <p className="max-w-xl pt-2 text-fg-muted line-clamp-3">{r.abstract}</p>}
        </div>

        <div className="border-t border-border pt-1.5 text-[13px] leading-5">
          <p className={`font-medium text-fg ${lead ? "pb-1.5" : "pb-1"}`}>{specs.join(" · ")}</p>
          {r.tagline && (
            <p className={`text-fg-muted ${lead ? "" : "line-clamp-1 text-xs leading-tight"}`}>{r.tagline}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
