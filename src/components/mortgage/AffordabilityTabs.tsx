"use client";

import { useState } from "react";
import MortgageSimulator from "./MortgageSimulator";
import RentEstimator from "./RentEstimator";

type Tab = "mortgage" | "rent";

// Switches between the mortgage simulator and the rent estimator.
// Both stay simple client components; only one is shown at a time.
export default function AffordabilityTabs({ initialTab = "mortgage", initialPrice }: { initialTab?: Tab; initialPrice?: number }) {
  const [tab, setTab] = useState<Tab>(initialTab);

  return (
    <>
      <div role="tablist" aria-label="Calculator" className="flex gap-8 border-b border-border">
        {([
          ["mortgage", "Mortgage simulator", "Buying"],
          ["rent", "Rent affordability", "Renting"],
        ] as const).map(([k, label, tag]) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`-mb-px flex items-center gap-2 border-b-2 pb-3 text-[14px] tracking-[0.04em] transition-colors ${
              tab === k ? "border-brand font-semibold text-brand" : "border-transparent text-fg-muted hover:text-fg"
            }`}
          >
            {label}
            <span className="badge !px-2 !py-0.5 !text-[10px]">{tag}</span>
          </button>
        ))}
      </div>

      <div className="pt-10" role="tabpanel">
        {tab === "mortgage" ? <MortgageSimulator initialPrice={initialPrice} /> : <RentEstimator />}
      </div>
    </>
  );
}
