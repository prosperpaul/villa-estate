"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import PropertyCard from "./PropertyCard";
import type { Residence } from "@/lib/residences";

const sortOptions = [
  { label: "Newest", key: "newest" },
  { label: "Price (low → high)", key: "price-asc" },
  { label: "Price (high → low)", key: "price-desc" },
  { label: "Largest interior", key: "area-desc" },
];

export default function ResidencesFilter({ residences }: { residences: Residence[] }) {
  const regions = useMemo(
    () => ["All regions", ...Array.from(new Set(residences.map((r) => r.location.region)))],
    [residences],
  );
  const types = useMemo(
    () => ["All types", ...Array.from(new Set(residences.map((r) => r.type)))],
    [residences],
  );

  const sp = useSearchParams();
  const [region, setRegion] = useState("All regions");
  const [type, setType] = useState("All types");
  const [minBeds, setMinBeds] = useState(0);
  const [maxBudget, setMaxBudget] = useState(40); // millions EUR
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const r = sp.get("region");
    const t = sp.get("type");
    const b = sp.get("maxBudget");
    const beds = sp.get("minBeds");
    if (r && regions.includes(r)) setRegion(r);
    if (t && types.includes(t)) setType(t);
    if (b && !Number.isNaN(Number(b))) setMaxBudget(Number(b));
    if (beds && !Number.isNaN(Number(beds))) setMinBeds(Number(beds));
  }, [sp, regions, types]);

  const results = useMemo(() => {
    const filtered = residences.filter((r) => {
      if (region !== "All regions" && r.location.region !== region) return false;
      if (type !== "All types" && r.type !== type) return false;
      if (r.beds < minBeds) return false;
      if (r.price > maxBudget * 1_000_000) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "area-desc") return b.interiorArea - a.interiorArea;
      return 0;
    });
  }, [region, type, minBeds, maxBudget, sort, residences]);

  const activeChips = [
    region !== "All regions" && { k: "region", label: region, reset: () => setRegion("All regions") },
    type !== "All types" && { k: "type", label: type, reset: () => setType("All types") },
    minBeds > 0 && { k: "beds", label: `${minBeds}+ beds`, reset: () => setMinBeds(0) },
    maxBudget < 40 && { k: "budget", label: `≤ €${maxBudget}m`, reset: () => setMaxBudget(40) },
  ].filter(Boolean) as { k: string; label: string; reset: () => void }[];

  return (
    <>
      {/* Filter bar */}
      <div className="sticky top-[72px] z-30 border-y border-border bg-bg/85 backdrop-blur-xl">
        <div className="container-x flex flex-wrap items-center gap-3 py-4">
          <Select label="Region" value={region} options={regions} onChange={setRegion} />
          <Select label="Type" value={type} options={types} onChange={setType} />
          <Select
            label="Bedrooms"
            value={minBeds === 0 ? "Any" : `${minBeds}+`}
            options={["Any", "2+", "4+", "6+", "8+"]}
            onChange={(v) => setMinBeds(v === "Any" ? 0 : parseInt(v))}
          />

          <div className="hidden items-center gap-3 rounded-full border border-border bg-surface px-4 py-2 md:flex">
            <span className="text-xs font-medium uppercase tracking-wider text-fg-subtle">Budget</span>
            <span className="text-sm text-fg tnum">≤ €{maxBudget}m</span>
            <input
              type="range"
              min={5}
              max={40}
              step={1}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-32"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-fg-muted tnum">{results.length} of {residences.length}</span>
            <Select label="Sort" value={sortOptions.find((s) => s.key === sort)?.label || "Newest"} options={sortOptions.map((s) => s.label)} onChange={(label) => setSort(sortOptions.find((s) => s.label === label)?.key || "newest")} />
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="container-x flex flex-wrap items-center gap-2 pb-4">
            <span className="text-xs uppercase tracking-wider text-fg-subtle">Active</span>
            {activeChips.map((c) => (
              <button
                key={c.k}
                onClick={c.reset}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-sm text-fg hover:border-fg"
              >
                {c.label}
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            ))}
            <button
              onClick={() => {
                setRegion("All regions");
                setType("All types");
                setMinBeds(0);
                setMaxBudget(40);
              }}
              className="text-sm text-fg-muted hover:text-fg underline-offset-4 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="container-x py-12">
        {results.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-16 text-center">
            <div className="font-display text-3xl">No residences match your filters.</div>
            <p className="mt-3 text-fg-muted">Try widening the search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {results.map((r) => (
              <PropertyCard key={r.slug} r={r} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="relative inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 hover:border-fg">
      <span className="text-xs font-medium uppercase tracking-wider text-fg-subtle">{label}</span>
      <span className="text-sm text-fg">{value}</span>
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-fg-subtle" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 9l6 6 6-6" />
      </svg>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
