"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import Icon from "@/components/Icon";

const INCOME_PRESETS = [900_000, 1_800_000, 3_500_000, 6_000_000];
// Typical upfront costs on top of the first year's rent (estimates)
const MOVE_IN = [
  { label: "Estimated service charge (estates)", rate: 0.222 },
  { label: "Caution deposit (refundable, 10%)", rate: 0.1 },
  { label: "Agency fee (10%)", rate: 0.1 },
  { label: "Legal / tenancy agreement (5%)", rate: 0.05 },
];

const naira = (n: number) => formatPrice(Math.max(0, Math.round(n)), "NGN");
const digits = (s: string) => Number(s.replace(/[^\d]/g, "")) || 0;
const short = (n: number) => (n >= 1_000_000 ? `₦${n / 1_000_000}M` : `₦${n / 1000}k`);

function ratioTag(pct: number) {
  if (pct <= 20) return "Strict";
  if (pct < 30) return "Conservative";
  if (pct < 35) return "Moderate";
  return "Lagos urban standard";
}

// How much rent can a household afford, and what does moving in really cost?
export default function RentEstimator() {
  const [income, setIncome] = useState(1_800_000); // monthly, net
  const [ratio, setRatio] = useState(25); // % of income for rent

  const monthly = income * (ratio / 100);
  const annual = monthly * 12; // Nigerian rents are usually paid a year upfront
  const extras = MOVE_IN.map((m) => ({ ...m, amount: annual * m.rate }));
  const total = annual + extras.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
      <div className="space-y-5 lg:col-span-7">
        <div className="rounded-lg border border-border bg-surface p-5">
          <span className="eyebrow block">Step 1</span>
          <h2 className="headline-sm">Monthly net household income</h2>
          <div className="mt-3 flex items-center gap-2 rounded border border-border bg-bg px-3 focus-within:border-brand">
            <span className="font-display text-[20px] text-fg-muted">₦</span>
            <input
              aria-label="Monthly net household income"
              inputMode="numeric"
              value={Math.round(income).toLocaleString("en-GB")}
              onChange={(e) => setIncome(digits(e.target.value))}
              className="w-full bg-transparent py-2.5 font-display text-[22px] outline-none tnum"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {INCOME_PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={income === p}
                onClick={() => setIncome(p)}
                className={`rounded border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  income === p ? "border-brand bg-brand text-bg" : "border-border bg-bg hover:bg-sand"
                }`}
              >
                {short(p)}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="ratio" className="eyebrow">Step 2 · Share of income for rent</label>
            <span className="text-[13px] font-semibold text-brand">{ratio}% ({ratioTag(ratio)})</span>
          </div>
          <input id="ratio" type="range" min={20} max={40} step={5} value={ratio}
            onChange={(e) => setRatio(Number(e.target.value))} className="mt-4 w-full" />
          <div className="flex justify-between text-[11px] text-fg-subtle"><span>20%</span><span>40%</span></div>

          <div className="mt-5 flex gap-3 rounded border border-brand/30 bg-brand-soft p-4">
            <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
            <p className="text-[13px] leading-5 text-fg">
              In high-demand areas like Ikoyi, Victoria Island and Ikeja GRA, landlords usually ask for a full
              year upfront plus caution and agency fees. Never budget on the rent alone.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 lg:sticky lg:top-24 lg:col-span-5">
        <div className="rounded-lg border border-border bg-sand p-5">
          <span className="eyebrow block">Recommended maximum annual rent</span>
          <p className="pt-2 font-display text-[44px] font-medium leading-[48px] tracking-[-0.02em] text-brand tnum">{naira(annual)}</p>
          <p className="text-[12px] text-fg-muted">About {naira(monthly)} a month from your income.</p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5">
          <span className="eyebrow !text-brand block">Full move-in cash (estimated)</span>
          <dl className="mt-3 space-y-1.5 border-b border-border pb-3 text-[13px]">
            <div className="flex justify-between gap-3"><dt>First year&apos;s rent (paid upfront)</dt><dd className="font-medium tnum">{naira(annual)}</dd></div>
            {extras.map((e) => (
              <div key={e.label} className="flex justify-between gap-3">
                <dt className="text-fg-muted">{e.label}</dt>
                <dd className="font-medium tnum">{naira(e.amount)}</dd>
              </div>
            ))}
          </dl>
          <div className="flex items-baseline justify-between pt-3">
            <span className="font-display text-[19px]">Total to move in</span>
            <span className="font-display text-[22px] font-medium text-brand tnum">{naira(total)}</span>
          </div>
        </div>

        <Link href="/residences" className="btn btn-primary w-full">
          Browse verified residences →
        </Link>
        <p className="text-center text-[11px] leading-4 text-fg-subtle">Indicative only. Fees vary by landlord and estate.</p>
      </div>
    </div>
  );
}
