"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const locations = ["Anywhere", "Côte d'Azur", "Mallorca", "Lake Como", "Marrakech", "Saint-Tropez", "County Kerry"];
const types = ["Any type", "Villa", "Estate", "Pavilion", "Retreat", "Compound", "Townhouse"];

const budgets: { label: string; max: number }[] = [
  { label: "Any budget", max: 40 },
  { label: "Up to €5m", max: 5 },
  { label: "€5m – €15m", max: 15 },
  { label: "€15m – €30m", max: 30 },
  { label: "Over €30m", max: 40 },
];

export default function SearchBar({ stacked = false }: { stacked?: boolean }) {
  const router = useRouter();
  const [loc, setLoc] = useState("Anywhere");
  const [type, setType] = useState("Any type");
  const [budget, setBudget] = useState("Any budget");

  const submit = () => {
    const params = new URLSearchParams();
    if (loc !== "Anywhere") params.set("region", loc);
    if (type !== "Any type") params.set("type", type);
    const found = budgets.find((b) => b.label === budget);
    if (found && found.label !== "Any budget") params.set("maxBudget", String(found.max));
    const qs = params.toString();
    router.push(`/residences${qs ? `?${qs}` : ""}`);
  };

  return (
    <div
      className={`shadow-soft-lg flex w-full max-w-4xl items-stretch overflow-hidden rounded-2xl bg-surface ${
        stacked ? "flex-col" : "flex-col md:flex-row"
      }`}
    >
      <Field label="Where" value={loc} options={locations} onChange={setLoc} />
      <div className="hidden w-px self-stretch bg-border md:block" />
      <Field label="Type" value={type} options={types} onChange={setType} />
      <div className="hidden w-px self-stretch bg-border md:block" />
      <Field label="Budget" value={budget} options={budgets.map((b) => b.label)} onChange={setBudget} />

      <button
        onClick={submit}
        className="btn btn-primary m-2 md:my-2 md:mr-2 md:ml-0"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        Search residences
      </button>
    </div>
  );
}

function Field({
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
    <label className="relative block flex-1 px-5 py-3 transition hover:bg-surface-2">
      <div className="text-[11px] font-medium uppercase tracking-wider text-fg-subtle">
        {label}
      </div>
      <div className="mt-1 flex items-center justify-between text-[15px] text-fg">
        <span>{value}</span>
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-fg-subtle" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
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
