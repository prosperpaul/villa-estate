"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon, { type IconName } from "./Icon";

// The tab is passed as ?intent=buy|rent|land|short-let and the listings page
// filters on it (short-let shows rentals until short lets exist as their own type).
const tabs = ["Buy", "Rent", "Land", "Short Let"] as const;

const types = ["Any type", "Villa", "Estate", "Pavilion", "Retreat", "Compound", "Townhouse"];

const beds: { label: string; min: number }[] = [
  { label: "Any size", min: 0 },
  { label: "1+ bedrooms", min: 1 },
  { label: "3+ bedrooms", min: 3 },
  { label: "4+ bedrooms", min: 4 },
  { label: "6+ bedrooms", min: 6 },
];

// Budget is in millions of the listing currency, matching the ?maxBudget
// param the residences filter already understands.
const budgets: { label: string; max: number }[] = [
  { label: "Any budget", max: 40 },
  { label: "Up to €5m", max: 5 },
  { label: "€5m to €15m", max: 15 },
  { label: "€15m to €30m", max: 30 },
];

export default function SearchBar({
  regions = [],
  listingCount,
}: {
  regions?: string[];
  listingCount?: number;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Buy");
  const [loc, setLoc] = useState("Anywhere");
  const [type, setType] = useState("Any type");
  const [bed, setBed] = useState("Any size");
  const [budget, setBudget] = useState("Any budget");

  // Build the URL from whatever the user picked, skipping the "any" defaults
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    p.set("intent", tab.toLowerCase().replace(" ", "-"));
    if (loc !== "Anywhere") p.set("region", loc);
    if (type !== "Any type") p.set("type", type);
    const b = beds.find((x) => x.label === bed);
    if (b && b.min > 0) p.set("minBeds", String(b.min));
    const m = budgets.find((x) => x.label === budget);
    if (m && m.label !== "Any budget") p.set("maxBudget", String(m.max));
    router.push(`/residences?${p.toString()}`);
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-1.5 lg:p-3">
      {/* Tabs */}
      <div role="tablist" className="flex items-center gap-1.5 border-b border-border px-2 pb-1.5">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-[12px] leading-4 tracking-[0.06em] transition-colors ${
              tab === t ? "bg-sand font-semibold text-fg" : "font-medium text-fg-muted hover:text-fg"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 items-center gap-1.5 pt-1.5 sm:grid-cols-2 lg:grid-cols-12">
        <Field className="lg:col-span-4" label="Location" icon="pin" iconClass="text-brand"
          value={loc} options={["Anywhere", ...regions]} onChange={setLoc} />
        <Field className="lg:col-span-3" label="Property type" icon="home"
          value={type} options={types} onChange={setType} />
        <Field className="lg:col-span-2" label="Scale" icon="bed"
          value={bed} options={beds.map((b) => b.label)} onChange={setBed} />
        <Field className="lg:col-span-3" label="Budget" icon="doc"
          value={budget} options={budgets.map((b) => b.label)} onChange={setBudget} />

        <div className="flex flex-col items-center justify-between gap-1.5 pt-1.5 sm:col-span-2 sm:flex-row lg:col-span-12">
          <p className="flex items-center gap-2 text-[13px] leading-5 text-fg-muted">
            <Icon name="verified" className="h-4 w-4 text-verified" />
            Every listing is physically inspected before it is published
          </p>
          <button type="submit" className="btn btn-primary w-full sm:w-auto !py-3.5">
            <Icon name="search" className="h-[18px] w-[18px]" strokeWidth={2} />
            {listingCount ? `Search ${listingCount} properties` : "Search properties"}
          </button>
        </div>
      </form>
    </div>
  );
}

// One labelled field. A real <select> sits invisibly on top, so it stays
// fully keyboard and screen-reader accessible while we style the visible part.
function Field({
  label, icon, iconClass = "text-fg-subtle", value, options, onChange, className = "",
}: {
  label: string;
  icon: IconName;
  iconClass?: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <label className={`relative block rounded border border-border bg-bg px-3 py-2 transition-colors focus-within:border-brand ${className}`}>
      <span className="eyebrow block">{label}</span>
      <span className="flex items-center gap-1.5 pt-0.5 text-fg">
        <Icon name={icon} className={`h-[18px] w-[18px] shrink-0 ${iconClass}`} />
        <span className="truncate">{value}</span>
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
