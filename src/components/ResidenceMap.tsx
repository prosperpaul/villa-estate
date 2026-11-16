"use client";

import Image from "next/image";
import Link from "next/link";
import type { Residence } from "@/lib/residences";
import { formatPriceShort } from "@/lib/format";
import { specLine } from "@/lib/listing";

// A flat, architectural "plan" map. No tiles or map library:
// each pin is placed by its real lat/lng, scaled into the box.
export default function ResidenceMap({
  residences,
  activeSlug,
  onSelect,
  tall = false,
}: {
  residences: Residence[];
  activeSlug: string | null;
  onSelect: (slug: string) => void;
  tall?: boolean;
}) {
  const pts = residences.filter((r) => r.location?.lat != null && r.location?.lng != null);

  // Bounding box of all pins
  const lats = pts.map((r) => r.location.lat);
  const lngs = pts.map((r) => r.location.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);

  // lat/lng -> % position, keeping a 12% margin so pins never touch the edge.
  // If every pin shares one coordinate (range 0), centre it.
  const placed: { slug: string; x: number; y: number }[] = [];
  for (const r of pts) {
    const x = maxLng === minLng ? 50 : 12 + ((r.location.lng - minLng) / (maxLng - minLng)) * 76;
    let y = maxLat === minLat ? 50 : 12 + ((maxLat - r.location.lat) / (maxLat - minLat)) * 76;
    // Nudge down while this pin would sit on top of one already placed
    while (placed.some((p) => Math.abs(p.x - x) < 12 &&Math.abs(p.y - y) < 5)) y += 5;
    placed.push({ slug: r.slug, x, y });
  }
  const pos = (r: Residence) => {
    const p = placed.find((q) => q.slug === r.slug)!;
    return { left: `${p.x}%`, top: `${p.y}%` };
  };

  const active = pts.find((r) => r.slug === activeSlug);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-[12px] font-medium tracking-[0.06em]">Residence plan</span>
        <span className="eyebrow">N ↑</span>
      </div>

      <div
        className={`relative w-full bg-sand/50 ${tall ? "h-[70vh]" : "h-[min(560px,calc(100vh-14rem))]"}`}
        style={{
          // Hairline survey grid
          backgroundImage:
            "linear-gradient(#e2d9cc 1px, transparent 1px), linear-gradient(90deg, #e2d9cc 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        {pts.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-fg-muted">No locations to show.</p>
        )}

        {pts.map((r) => {
          const isActive = r.slug === activeSlug;
          return (
            <button
              key={r.slug}
              type="button"
              onClick={() => onSelect(r.slug)}
              style={pos(r)}
              aria-label={`${r.name}, ${formatPriceShort(r.price, r.currency)}`}
              className={`absolute -translate-x-1/2 -translate-y-full rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-[14px] tracking-[0.04em] transition-colors ${
                isActive
                  ? "z-20 border-brand bg-brand text-bg"
                  : "z-10 border-fg/30 bg-bg text-fg hover:border-brand hover:text-brand"
              }`}
            >
              {formatPriceShort(r.price, r.currency)}
            </button>
          );
        })}

        {/* Mini card for the selected pin, anchored to the bottom of the map */}
        {active && (
          <Link
            href={`/residences/${active.slug}`}
            className="absolute inset-x-3 bottom-3 z-30 flex gap-3 rounded-lg border border-border bg-bg p-2 transition-colors hover:border-brand"
          >
            <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded bg-sand">
              {active.cover && <Image src={active.cover} alt="" fill sizes="80px" className="object-cover" />}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-[17px] leading-tight">{active.name}</span>
              <span className="block truncate text-[12px] text-fg-muted">
                {active.location.town}, {active.location.country}
              </span>
              <span className="block text-[12px] text-fg-muted">
                {specLine(active).slice(0, 2).join(" · ")}
                <span className="ml-2 font-semibold text-brand">Dossier ›</span>
              </span>
            </span>
          </Link>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[12px] text-fg-muted">
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand" />Selected</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full border border-fg/40 bg-bg" />Listing</span>
        </span>
        <span>{pts.length} mapped</span>
      </div>
    </div>
  );
}
