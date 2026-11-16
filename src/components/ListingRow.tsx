"use client";

import Image from "next/image";
import Link from "next/link";
import type { Residence } from "@/lib/residences";
import type { Agent } from "@/lib/agents";
import { formatPrice } from "@/lib/format";
import { isRent, specLine } from "@/lib/listing";
import { useFavorites } from "@/lib/useFavorites";
import Icon from "./Icon";

// Horizontal listing card for the search results feed:
// photo on the left (5 cols), dossier on the right (7 cols),
// agent + WhatsApp/Call along the bottom.
export default function ListingRow({
  r,
  agent,
  active = false,
  onHover,
  priority = false,
}: {
  r: Residence;
  agent?: Agent;
  active?: boolean; // highlighted because its map pin is selected
  onHover?: (slug: string | null) => void;
  priority?: boolean;
}) {
  const { has, toggle, hydrated } = useFavorites();
  const saved = hydrated && has(r.slug);
  const href = `/residences/${r.slug}`;
  const photos = r.gallery?.length || (r.cover ? 1 : 0);
  const place = [r.location.town, r.location.region, r.location.country].filter(Boolean).join(", ");
  const specs = specLine(r, { reception: true });
  const phoneDigits = agent?.phone.replace(/\D/g, "");

  return (
    <article
      id={`listing-${r.slug}`}
      onMouseEnter={() => onHover?.(r.slug)}
      onMouseLeave={() => onHover?.(null)}
      className={`group scroll-mt-28 rounded-lg border bg-surface p-4 transition-colors md:p-5 ${
        active ? "border-brand" : "border-border hover:border-brand/80"
      }`}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {/* Photo */}
        <Link href={href} className="relative block aspect-[4/3] overflow-hidden rounded bg-sand md:col-span-5">
          {r.cover && (
            <Image
              src={r.cover}
              alt={r.name}
              fill
              priority={priority}
              sizes="(min-width:1024px) 24vw, (min-width:768px) 40vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          )}
          <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1">
            <span className="badge !bg-surface/95 !px-2.5 !py-0.5">{r.status}</span>
            <span className="badge !px-2.5 !py-0.5">{r.tenure}</span>
          </div>
          {photos > 0 && (
            <span className="absolute bottom-2.5 right-2.5 rounded bg-fg/80 px-2 py-0.5 text-[11px] font-semibold text-bg">
              1/{photos}
            </span>
          )}
        </Link>

        {/* Dossier */}
        <div className="flex flex-col justify-between md:col-span-7">
          <div>
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span className="price-display text-fg">{formatPrice(r.price, r.currency)}{isRent(r) && <span className="pl-1 font-sans text-[13px] font-normal tracking-normal text-fg-muted">/ yr</span>}</span>
              <button
                type="button"
                aria-label={saved ? "Remove from saved" : "Save"}
                aria-pressed={saved}
                onClick={() => toggle(r.slug)}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border transition-colors hover:border-brand hover:text-brand ${
                  saved ? "text-brand" : "text-fg"
                }`}
              >
                <Icon name="heart" filled={saved} className="h-4 w-4" />
              </button>
            </div>

            <h3 className="mb-1 font-display text-[21px] font-medium leading-snug">
              <Link href={href} className="transition-colors group-hover:text-brand">
                {r.name}
              </Link>
            </h3>
            <p className="mb-3 flex items-center gap-1 text-[13px] leading-5 text-fg-muted">
              <Icon name="pin" className="h-4 w-4 shrink-0 text-brand" />
              {place}
            </p>

            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-border py-2 text-[12px] font-medium tracking-[0.06em]">
              {specs.map((s, i) => (
                <span key={s} className="flex items-center gap-3">
                  {i > 0 && <span className="text-border">·</span>}
                  {s}
                </span>
              ))}
            </p>

            {r.tagline && (
              <p className="mt-2.5 flex items-start gap-1.5 text-[13px] leading-5 text-fg-muted">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                {r.tagline}
              </p>
            )}
          </div>

          {/* Agent + direct actions */}
          {agent && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
              <Link href={`/agents/${agent.slug}`} className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sand text-[11px] font-semibold">
                  {agent.initials}
                </span>
                <span>
                  <span className="block text-[11px] font-semibold leading-[14px] tracking-[0.04em] text-fg">{agent.name}</span>
                  <span className="block text-[10px] leading-[14px] text-fg-muted">{agent.role}</span>
                </span>
              </Link>
              <div className="flex items-center gap-1.5">
                <a
                  href={`https://wa.me/${phoneDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary !gap-1 !px-3.5 !py-1.5 text-[12px] !tracking-[0.06em]"
                >
                  <Icon name="chat" className="h-[15px] w-[15px]" />
                  WhatsApp
                </a>
                <a href={`tel:${agent.phone.replace(/\s/g, "")}`} className="btn btn-secondary !gap-1 !px-3 !py-1.5 text-[12px] !tracking-[0.06em]">
                  <Icon name="phone" className="h-[15px] w-[15px]" />
                  Call
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
