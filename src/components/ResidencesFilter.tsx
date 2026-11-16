"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PropertyCard from "./PropertyCard";
import ListingRow from "./ListingRow";
import ResidenceMap from "./ResidenceMap";
import Icon from "./Icon";
import type { Residence } from "@/lib/residences";
import type { Agent } from "@/lib/agents";
import { formatPrice } from "@/lib/format";
import { isLand, isRent } from "@/lib/listing";

// Buy / Rent / Land, as chosen on the home page search tabs (?intent=...)
type Intent = "all" | "buy" | "rent" | "land";
const INTENTS: { key: Intent; label: string }[] = [
  { key: "all", label: "All" },
  { key: "buy", label: "Buy" },
  { key: "rent", label: "Rent" },
  { key: "land", label: "Land" },
];

const ALL_REGIONS = "All regions";
const ALL_TYPES = "All types";
const PAGE_SIZE = 6;

const sortOptions = [
  { label: "Newest listed", key: "newest" },
  { label: "Price: low to high", key: "price-asc" },
  { label: "Price: high to low", key: "price-desc" },
  { label: "Largest interior", key: "area-desc" },
];

type View = "split" | "grid" | "map";

export default function ResidencesFilter({
  residences,
  agents,
}: {
  residences: Residence[];
  agents: Agent[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  /* ---------- Options derived from the real data ---------- */
  const regions = useMemo(
    () => [ALL_REGIONS, ...new Set(residences.map((r) => r.location.region).filter(Boolean))],
    [residences],
  );
  const types = useMemo(() => [ALL_TYPES, ...new Set(residences.map((r) => r.type))], [residences]);

  // Most common currency. The price filter works in this currency only,
  // because ₦45M and €45M can't be compared as plain numbers.
  const currency = useMemo(() => {
    const counts = new Map<Residence["currency"], number>();
    residences.forEach((r) => counts.set(r.currency, (counts.get(r.currency) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "EUR";
  }, [residences]);
  const priced = useMemo(() => residences.filter((r) => r.currency === currency).map((r) => r.price), [residences, currency]);
  // Slider runs from the cheapest to the dearest listing in that currency
  const priceFloor = priced.length ? Math.min(...priced) : 0;
  const priceCeil = priced.length ? Math.max(...priced) : 1;

  // Amenities: "Pool" plus the most common features across listings
  const amenityOptions = useMemo(() => {
    const counts = new Map<string, number>();
    residences.forEach((r) => r.features?.forEach((f) => counts.set(f, (counts.get(f) ?? 0) + 1)));
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7).map(([f]) => f);
    return residences.some((r) => r.pool) ? ["Pool", ...top.filter((f) => f !== "Pool")] : top;
  }, [residences]);

  /* ---------- Filter state ---------- */
  const [intent, setIntent] = useState<Intent>("all");
  const [region, setRegion] = useState(ALL_REGIONS);
  const [type, setType] = useState(ALL_TYPES);
  const [minBeds, setMinBeds] = useState(0);
  const [minBaths, setMinBaths] = useState(0);
  const [maxPrice, setMaxPrice] = useState<number | null>(null); // null = no cap
  const [amenities, setAmenities] = useState<string[]>([]);
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState<View>("split");
  const [page, setPage] = useState(1);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [refineOpen, setRefineOpen] = useState(true);

  // Read filters from the URL (links from the home page search land here)
  useEffect(() => {
    // "short-let" has no separate data yet, so it shows rentals
    const it = sp.get("intent");
    if (it === "buy" || it === "rent" || it === "land") setIntent(it);
    else if (it === "short-let") setIntent("rent");
    const r = sp.get("region");
    const t = sp.get("type");
    const beds = Number(sp.get("minBeds"));
    const baths = Number(sp.get("minBaths"));
    const maxP = Number(sp.get("maxPrice"));
    const maxB = Number(sp.get("maxBudget")); // in millions, from the home page
    const v = sp.get("view");
    if (r && regions.includes(r)) setRegion(r);
    if (t && types.includes(t)) setType(t);
    if (beds > 0) setMinBeds(beds);
    if (baths > 0) setMinBaths(baths);
    if (maxP > 0) setMaxPrice(maxP);
    else if (maxB > 0 && maxB < 40) setMaxPrice(maxB * 1_000_000);
    if (v === "grid" || v === "map" || v === "split") setView(v);
  }, [sp, regions, types]);

  /* ---------- Apply filters + sort ---------- */
  const results = useMemo(() => {
    const filtered = residences.filter((r) => {
      if (intent === "buy" && (isRent(r) || isLand(r))) return false;
      if (intent === "rent" && !isRent(r)) return false;
      if (intent === "land" && !isLand(r)) return false;
      if (region !== ALL_REGIONS && r.location.region !== region) return false;
      if (type !== ALL_TYPES && r.type !== type) return false;
      if (r.beds < minBeds) return false;
      if (r.baths < minBaths) return false;
      // Price cap only applies to listings priced in the slider's currency
      if (maxPrice !== null && r.currency === currency && r.price > maxPrice) return false;
      for (const a of amenities) {
        if (a === "Pool" ? !r.pool : !r.features?.includes(a)) return false;
      }
      return true;
    });
    return [...filtered].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "area-desc") return b.interiorArea - a.interiorArea;
      return 0;
    });
  }, [residences, intent, region, type, minBeds, minBaths, maxPrice, amenities, sort, currency]);

  // Any filter change sends you back to page 1
  useEffect(() => setPage(1), [intent, region, type, minBeds, minBaths, maxPrice, amenities, sort]);

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const agentBySlug = useMemo(() => new Map(agents.map((a) => [a.slug, a])), [agents]);

  const resetAll = () => {
    setIntent("all");
    setRegion(ALL_REGIONS);
    setType(ALL_TYPES);
    setMinBeds(0);
    setMinBaths(0);
    setMaxPrice(null);
    setAmenities([]);
    router.replace(pathname, { scroll: false });
  };

  // "Update" writes the current filters into the URL so the search is shareable
  const writeUrl = (e?: React.FormEvent) => {
    e?.preventDefault();
    const p = new URLSearchParams();
    if (intent !== "all") p.set("intent", intent);
    if (region !== ALL_REGIONS) p.set("region", region);
    if (type !== ALL_TYPES) p.set("type", type);
    if (minBeds) p.set("minBeds", String(minBeds));
    if (minBaths) p.set("minBaths", String(minBaths));
    if (maxPrice !== null) p.set("maxPrice", String(maxPrice));
    if (view !== "split") p.set("view", view);
    const qs = p.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  // Clicking a map pin: highlight it and scroll its listing into view
  const selectFromMap = (slug: string) => {
    setActiveSlug(slug);
    if (view !== "split") return;
    const idx = results.findIndex((r) => r.slug === slug);
    if (idx >= 0) setPage(Math.floor(idx / PAGE_SIZE) + 1);
    requestAnimationFrame(() =>
      document.getElementById(`listing-${slug}`)?.scrollIntoView({ behavior: "smooth", block: "center" }),
    );
  };

  const chips = [
    intent !== "all" && { k: "intent", label: intent === "rent" ? "For rent" : intent === "buy" ? "For sale" : "Land", reset: () => setIntent("all") },
    region !== ALL_REGIONS && { k: "region", label: region, reset: () => setRegion(ALL_REGIONS) },
    type !== ALL_TYPES && { k: "type", label: type, reset: () => setType(ALL_TYPES) },
    minBeds > 0 && { k: "beds", label: `${minBeds}+ beds`, reset: () => setMinBeds(0) },
    minBaths > 0 && { k: "baths", label: `${minBaths}+ baths`, reset: () => setMinBaths(0) },
    maxPrice !== null && { k: "price", label: `Up to ${formatPrice(maxPrice, currency)}`, reset: () => setMaxPrice(null) },
    ...amenities.map((a) => ({ k: `a-${a}`, label: a, reset: () => setAmenities((s) => s.filter((x) => x !== a)) })),
  ].filter(Boolean) as { k: string; label: string; reset: () => void }[];

  const filterCount = chips.length;
  const noun = intent === "land" ? (results.length === 1 ? "plot" : "plots") : results.length === 1 ? "property" : "properties";
  const forWhat = intent === "rent" ? " for rent" : intent === "buy" ? " for sale" : "";
  const heading = `${results.length} ${noun}${forWhat} ${
    region !== ALL_REGIONS ? `in ${region}` : "in the portfolio"
  }`;

  return (
    <>
      {/* ============ BREADCRUMB ============ */}
      <section className="border-b border-border bg-bg">
        <div className="container-x flex flex-wrap items-center justify-between gap-y-2 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[12px] font-medium tracking-[0.06em] text-fg-muted">
            <Link href="/" className="hover:text-brand">Home</Link>
            <span className="text-border">/</span>
            {region === ALL_REGIONS ? (
              <span className="font-semibold text-fg">Residences</span>
            ) : (
              <>
                <button type="button" onClick={() => setRegion(ALL_REGIONS)} className="hover:text-brand">Residences</button>
                <span className="text-border">/</span>
                <span className="font-semibold text-fg">{region}</span>
              </>
            )}
          </nav>
          <div className="eyebrow flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-verified" />
            Every listing physically inspected
          </div>
        </div>
      </section>

      {/* ============ SEARCH CONTROL STRIP ============ */}
      <section className="border-b border-border bg-surface">
        <form onSubmit={writeUrl} className="container-x grid grid-cols-1 items-end gap-3 py-5 md:grid-cols-2 lg:grid-cols-12">
          <StripSelect className="lg:col-span-4" label="Location" icon="pin" value={region} options={regions} onChange={setRegion} />
          <StripSelect className="lg:col-span-3" label="Property type" value={type} options={types} onChange={setType} />
          <StripSelect
            className="lg:col-span-2"
            label="Bedrooms"
            value={minBeds ? `${minBeds}+ bedrooms` : "Any"}
            options={["Any", "1+ bedrooms", "2+ bedrooms", "3+ bedrooms", "4+ bedrooms", "5+ bedrooms", "6+ bedrooms"]}
            onChange={(v) => setMinBeds(v === "Any" ? 0 : parseInt(v))}
          />
          <StripSelect
            className="lg:col-span-2"
            label="Budget"
            value={maxPrice === null ? "Any budget" : `Up to ${formatPrice(maxPrice, currency)}`}
            options={["Any budget", ...budgetSteps(priceFloor, priceCeil).map((b) => `Up to ${formatPrice(b, currency)}`)]}
            onChange={(v) => {
              if (v === "Any budget") return setMaxPrice(null);
              const step = budgetSteps(priceFloor, priceCeil).find((b) => `Up to ${formatPrice(b, currency)}` === v);
              setMaxPrice(step ?? null);
            }}
          />
          <button type="submit" className="btn btn-primary !py-2.5 lg:col-span-1">
            Update
          </button>
        </form>
      </section>

      {/* ============ HEADER, VIEW SWITCH, SORT, ACTIVE CHIPS ============ */}
      <section className="border-b border-border bg-bg">
        <div className="container-x py-10">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="eyebrow mb-1.5 flex items-center gap-2 !text-brand tracking-widest">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                The Haven register
              </div>
              <h1 className="headline-lg mb-1.5 lg:!text-[56px] lg:!leading-[64px]">{heading}</h1>
              <p className="text-[18px] leading-7 text-fg-muted">
                Every residence is physically inspected, with its title checked before publication.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex rounded-full border border-border bg-sand/60 p-1" role="group" aria-label="View">
                {([
                  ["split", "Split"],
                  ["grid", "Grid"],
                  ["map", "Map"],
                ] as const).map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={view === k}
                    onClick={() => setView(k)}
                    className={`rounded-full px-3.5 py-1 text-[12px] font-medium tracking-[0.06em] transition-colors ${
                      view === k ? "bg-bg text-brand" : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {/* On phones the map column is hidden, so "Split" is really a list */}
                    {k === "split" ? (
                      <>
                        <span className="lg:hidden">List</span>
                        <span className="hidden lg:inline">{label}</span>
                      </>
                    ) : (
                      label
                    )}
                  </button>
                ))}
              </div>

              <label className="relative flex items-center rounded-full border border-border bg-bg px-4 py-1.5">
                <span className="eyebrow mr-2">Sort</span>
                <span className="pr-5 text-[12px] font-medium tracking-[0.06em]">
                  {sortOptions.find((s) => s.key === sort)?.label}
                </span>
                <Chevron />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  aria-label="Sort"
                >
                  {sortOptions.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </label>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-3">
              <span className="eyebrow mr-1">Active criteria</span>
              {chips.map((c) => (
                <button key={c.k} type="button" onClick={c.reset} className="badge !normal-case !tracking-[0.04em] hover:!text-brand">
                  {c.label}
                  <Icon name="close" className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              ))}
              <button type="button" onClick={resetAll} className="link-editorial ml-2 text-[11px] font-semibold tracking-[0.08em]">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============ MAIN CANVAS ============ */}
      <div className="container-x py-10">
        {view === "map" ? (
          <ResidenceMap residences={results} activeSlug={activeSlug} onSelect={selectFromMap} tall />
        ) : (
          <div className={`grid grid-cols-1 items-start gap-10 ${view === "split" ? "lg:grid-cols-12" : ""}`}>
            {/* LEFT: chips, refine panel, feed */}
            <div className={`flex flex-col gap-10 ${view === "split" ? "lg:col-span-7" : ""}`}>
              {/* Region quick chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                {regions.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRegion(r)}
                    className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-[12px] font-medium tracking-[0.06em] transition-colors ${
                      region === r ? "border-fg bg-fg text-bg" : "border-border bg-surface text-fg hover:bg-sand"
                    }`}
                  >
                    {r === ALL_REGIONS ? "All regions" : r}
                  </button>
                ))}
              </div>

              {/* Refine panel */}
              <div className="rounded-lg border border-border bg-surface p-5">
                <button
                  type="button"
                  onClick={() => setRefineOpen((o) => !o)}
                  aria-expanded={refineOpen}
                  className="flex w-full items-center justify-between"
                >
                  <span className="headline-sm flex items-center gap-2">
                    <Icon name="search" className="h-5 w-5 text-brand" />
                    Refine your search
                  </span>
                  <span className="text-[12px] font-medium tracking-[0.06em] text-fg-muted">
                    {filterCount ? `${filterCount} active` : "No filters"} {refineOpen ? "▴" : "▾"}
                  </span>
                </button>

                {refineOpen && (
                  <div className="mt-5 space-y-5 border-t border-border pt-5">
                    {/* Price band */}
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="eyebrow">Price band</span>
                        <span className="font-display text-[17px] font-medium text-brand">
                          {formatPrice(priceFloor, currency)} to {formatPrice(maxPrice ?? priceCeil, currency)}
                        </span>
                      </div>
                      <input
                        type="range"
                        aria-label="Maximum price"
                        min={priceFloor}
                        max={priceCeil}
                        step={Math.max(1, Math.round((priceCeil - priceFloor) / 100))}
                        value={maxPrice ?? priceCeil}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setMaxPrice(v >= priceCeil ? null : v);
                        }}
                        className="w-full cursor-pointer"
                      />
                      <div className="mt-1 flex justify-between text-[13px] text-fg-muted">
                        <span>From {formatPrice(priceFloor, currency)}</span>
                        <span>Up to {formatPrice(priceCeil, currency)}</span>
                      </div>
                    </div>

                    {/* Listing type */}
                    <div>
                      <span className="eyebrow mb-2 block">Listing</span>
                      <div className="grid grid-cols-4 gap-1 rounded border border-border bg-bg p-1">
                        {INTENTS.map((i) => (
                          <button
                            key={i.key}
                            type="button"
                            aria-pressed={intent === i.key}
                            onClick={() => setIntent(i.key)}
                            className={`rounded-sm py-1 text-[12px] font-medium tracking-[0.06em] transition-colors ${
                              intent === i.key ? "bg-brand text-bg" : "hover:bg-sand"
                            }`}
                          >
                            {i.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Beds + baths segmented controls */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <Segmented label="Bedrooms" options={[0, 1, 2, 3, 4, 5]} value={minBeds} onChange={setMinBeds} />
                      <Segmented label="Bathrooms" options={[0, 2, 3, 4, 5]} value={minBaths} onChange={setMinBaths} />
                    </div>

                    {/* Amenities */}
                    {amenityOptions.length > 0 && (
                      <fieldset>
                        <legend className="eyebrow mb-2">Amenities</legend>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                          {amenityOptions.map((a) => (
                            <label key={a} className="flex cursor-pointer items-center gap-2 text-[13px] leading-5">
                              <input
                                type="checkbox"
                                className="h-4 w-4"
                                checked={amenities.includes(a)}
                                onChange={(e) =>
                                  setAmenities((s) => (e.target.checked ? [...s, a] : s.filter((x) => x !== a)))
                                }
                              />
                              {a}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    )}
                  </div>
                )}
              </div>

              {/* Feed */}
              {results.length === 0 ? (
                <BriefCard empty onReset={resetAll} />
              ) : (
                <>
                  {view === "split" ? (
                    <div className="space-y-10">
                      {pageItems.map((r, i) => (
                        <ListingRow
                          key={r.slug}
                          r={r}
                          agent={agentBySlug.get(r.agentSlug)}
                          active={activeSlug === r.slug}
                          onHover={(s) => s && setActiveSlug(s)}
                          priority={i < 2}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                      {pageItems.map((r, i) => (
                        <PropertyCard key={r.slug} r={r} priority={i < 3} />
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-5 sm:flex-row">
                    <span className="text-[13px] text-fg-muted">
                      Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, results.length)} of{" "}
                      {results.length} residences
                    </span>
                    {pageCount > 1 && (
                      <nav aria-label="Pagination" className="flex items-center gap-1">
                        <PageBtn disabled={page === 1} onClick={() => setPage(page - 1)}>‹ Previous</PageBtn>
                        {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                          <PageBtn key={n} current={n === page} onClick={() => setPage(n)}>{n}</PageBtn>
                        ))}
                        <PageBtn disabled={page === pageCount} onClick={() => setPage(page + 1)}>Next ›</PageBtn>
                      </nav>
                    )}
                  </div>

                  <BriefCard onReset={resetAll} />
                </>
              )}
            </div>

            {/* RIGHT: sticky map (split view, desktop only) */}
            {view === "split" && (
              <aside className="sticky top-24 hidden lg:col-span-5 lg:block">
                <ResidenceMap residences={results} activeSlug={activeSlug} onSelect={selectFromMap} />
              </aside>
            )}
          </div>
        )}
      </div>
    </>
  );
}

/* ---------------- Small pieces ---------------- */

// Budget presets: four even steps between the cheapest and dearest listing
function budgetSteps(min: number, max: number) {
  if (max <= min) return [];
  const round = (n: number) => {
    const mag = 10 ** Math.max(0, Math.floor(Math.log10(n)) - 1);
    return Math.ceil(n / mag) * mag;
  };
  return [0.25, 0.5, 0.75].map((f) => round(min + (max - min) * f));
}

function StripSelect({
  label, value, options, onChange, icon, className = "",
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  icon?: "pin";
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="eyebrow tracking-widest">{label}</span>
      <label className="relative flex items-center rounded border border-border bg-bg px-3 py-2 transition-colors focus-within:border-brand">
        {icon && <Icon name={icon} className="mr-2 h-5 w-5 shrink-0 text-brand" />}
        <span className="truncate pr-6">{value}</span>
        <Chevron />
        <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className="absolute inset-0 cursor-pointer opacity-0">
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </label>
    </div>
  );
}

function Segmented({
  label, options, value, onChange,
}: {
  label: string;
  options: number[];
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <span className="eyebrow mb-2 block">{label}</span>
      <div className="grid gap-1 rounded border border-border bg-bg p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))` }}>
        {options.map((n, i) => {
          const on = value === n;
          const text = n === 0 ? "Any" : i === options.length - 1 ? `${n}+` : String(n);
          return (
            <button
              key={n}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(n)}
              className={`rounded-sm py-1 text-[12px] font-medium tracking-[0.06em] transition-colors ${
                on ? "bg-brand text-bg" : "hover:bg-sand"
              }`}
            >
              {text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PageBtn({
  children, onClick, current = false, disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  current?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-current={current ? "page" : undefined}
      className={`min-w-8 rounded-full border px-3 py-1 text-[12px] font-medium tracking-[0.06em] transition-colors disabled:opacity-40 ${
        current ? "border-brand bg-brand text-bg" : "border-border hover:bg-sand"
      }`}
    >
      {children}
    </button>
  );
}

// "Can't find it?" card, doubles as the empty state
function BriefCard({ empty = false, onReset }: { empty?: boolean; onReset: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-sand/60 p-5 md:p-10">
      {/* Adire-style chevron watermark, single hairline strokes */}
      <svg aria-hidden viewBox="0 0 200 200" className="pointer-events-none absolute -bottom-8 -right-8 h-56 w-56 text-brand/20" fill="none" stroke="currentColor" strokeWidth="1">
        {[0, 20, 40, 60, 80].map((o) => (
          <path key={o} d={`M${o} 200 L${100 + o / 2} ${100 + o / 2} L200 ${o}`} />
        ))}
        <circle cx="100" cy="100" r="60" />
      </svg>
      <div className="relative max-w-xl">
        <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-brand/40 text-brand">
          <Icon name="search" />
        </span>
        <h2 className="headline-sm">
          {empty ? "No residences match these filters." : "Can't find exactly what you need?"}
        </h2>
        <p className="pt-2 text-fg-muted">
          Many of the best homes change hands privately before they are ever listed. Send us a brief
          and our team will search off-market on your behalf.
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-5">
          <a href="#contact" className="btn btn-primary">Submit a private brief</a>
          <button type="button" onClick={onReset} className="link-editorial text-[12px] font-medium tracking-[0.06em]">
            Reset current filters
          </button>
        </div>
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-2.5 h-4 w-4 text-fg-subtle" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
