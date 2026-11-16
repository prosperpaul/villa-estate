"use client";

import { useState } from "react";
import type { Residence } from "@/lib/residences";
import PropertyCard from "./PropertyCard";

// "Active listings" vs "Sold" for one agent. Tabs only appear when there's something to switch to.
export default function AgentListingsTabs({ active, sold, firstName }: { active: Residence[]; sold: Residence[]; firstName: string }) {
  const [tab, setTab] = useState<"active" | "sold">("active");
  const shown = tab === "active" ? active : sold;

  return (
    <section>
      <div role="tablist" aria-label="Listings" className="inline-flex rounded-full border border-border bg-sand/60 p-1">
        {([
          ["active", `Active listings (${active.length})`],
          ["sold", `Sold (${sold.length})`],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`rounded-full px-4 py-1.5 text-[12px] font-medium tracking-[0.06em] transition-colors ${
              tab === k ? "bg-bg text-fg" : "text-fg-muted hover:text-fg"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="mt-6 rounded-lg border border-border bg-surface p-8 text-center text-fg-muted">
          {tab === "active" ? `${firstName} has no active listings right now.` : "No sold listings recorded yet."}
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {shown.map((r, i) => <PropertyCard key={r.slug} r={r} priority={i < 2} />)}
        </div>
      )}
    </section>
  );
}
