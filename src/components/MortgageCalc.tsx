"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { Currency } from "@/lib/residences";

// Indicative closing costs. These vary by state and deal, so they are labelled as estimates.
const CLOSING = [
  { label: "Transfer duties & consent (est. 3%)", rate: 0.03 },
  { label: "Legal & title verification (est. 2.5%)", rate: 0.025 },
];

type Mode = "mortgage" | "outright" | "instalments";

// Payment structures: mortgage amortisation, outright purchase, or a vendor instalment plan.
export default function MortgageCalc({
  price,
  currency,
  label = "Acquisition modelling",
}: {
  price: number;
  currency: Currency;
  label?: string; // eyebrow text, e.g. the dossier chapter number
}) {
  const [mode, setMode] = useState<Mode>("mortgage");
  const [deposit, setDeposit] = useState(30); // %
  const [years, setYears] = useState(15);
  // Nigerian mortgage rates run far higher than European ones, so default by currency
  const [rate, setRate] = useState(currency === "NGN" ? 16 : 4.8);
  const [months, setMonths] = useState<12 | 24>(12);

  const closing = CLOSING.map((c) => ({ ...c, amount: price * c.rate }));
  const closingTotal = closing.reduce((sum, c) => sum + c.amount, 0);
  const depositAmount = price * (deposit / 100);

  // Standard amortisation: M = P·r / (1 − (1+r)^−n)
  const mortgage = useMemo(() => {
    const loan = price - depositAmount;
    const n = years * 12;
    const r = rate / 100 / 12;
    const monthly = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
    return { loan, monthly, interest: monthly * n - loan };
  }, [price, depositAmount, years, rate]);

  const instalment = (price - depositAmount) / months;

  const headline =
    mode === "mortgage" ? mortgage.monthly : mode === "instalments" ? instalment : price + closingTotal;
  const headlineLabel =
    mode === "outright" ? "Total acquisition cost" : mode === "mortgage" ? "Estimated debt service" : "Monthly instalment";

  return (
    <section className="rounded-lg border border-border bg-surface p-5 md:p-8">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <span className="eyebrow !text-brand tracking-widest">{label}</span>
          <h2 className="headline-md pt-1">Payment structures</h2>
        </div>
        <div className="inline-flex rounded-full border border-border bg-bg p-1" role="tablist" aria-label="Payment structure">
          {([
            ["mortgage", "Mortgage"],
            ["outright", "Outright"],
            ["instalments", "Instalments"],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={mode === k}
              onClick={() => setMode(k)}
              className={`rounded-full px-3.5 py-1 text-[12px] font-medium tracking-[0.06em] transition-colors ${
                mode === k ? "bg-fg text-bg" : "text-fg-muted hover:text-fg"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="pt-2 text-[13px] leading-5 text-fg-muted">
        Indicative figures for guidance only, subject to lender underwriting and vendor agreement.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5">
          <div>
            <span className="eyebrow block">Acquisition price</span>
            <span className="font-display text-[22px]">{formatPrice(price, currency)}</span>
          </div>

          {mode !== "outright" && (
            <Slider
              label="Down payment"
              value={deposit}
              display={`${deposit}% (${formatPrice(depositAmount, currency)})`}
              min={10}
              max={90}
              step={5}
              onChange={setDeposit}
            />
          )}

          {mode === "mortgage" && (
            <>
              <Slider label="Loan term" value={years} display={`${years} years`} min={5} max={30} step={1} onChange={setYears} />
              <Slider label="Interest rate" value={rate} display={`${rate.toFixed(1)}% p.a.`} min={1} max={30} step={0.5} onChange={setRate} />
            </>
          )}

          {mode === "instalments" && (
            <div>
              <span className="eyebrow mb-2 block">Schedule</span>
              <div className="grid grid-cols-2 gap-1 rounded border border-border bg-bg p-1">
                {([12, 24] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={months === m}
                    onClick={() => setMonths(m)}
                    className={`rounded-sm py-1.5 text-[12px] font-medium tracking-[0.06em] ${months === m ? "bg-brand text-bg" : "hover:bg-sand"}`}
                  >
                    {m} months
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === "outright" && (
            <p className="text-[13px] leading-5 text-fg-muted">
              Full payment on completion. Funds are held in escrow until the deed of assignment is
              executed and the keys are handed over.
            </p>
          )}
        </div>

        {/* Output */}
        <div className="flex flex-col justify-between rounded-lg border border-border bg-bg p-5">
          <div>
            <span className="eyebrow block">{headlineLabel}</span>
            <p className="pt-1 font-display text-[36px] font-medium leading-[40px] tracking-[-0.02em] text-brand tnum">
              {formatPrice(headline, currency)}
              {mode !== "outright" && <span className="pl-1 font-sans text-[13px] font-normal tracking-normal text-fg-muted">/ month</span>}
            </p>
            <p className="pt-2 text-[12px] leading-[18px] text-fg-muted">
              {mode === "mortgage" &&
                `Principal and interest on ${formatPrice(mortgage.loan, currency)} financed over ${years} years. Total interest ${formatPrice(mortgage.interest, currency)}.`}
              {mode === "instalments" &&
                `${formatPrice(depositAmount, currency)} on signing, then ${months} equal payments.`}
              {mode === "outright" && "Purchase price plus estimated closing costs."}
            </p>
          </div>

          <dl className="mt-5 space-y-1.5 border-t border-border pt-4 text-[13px] leading-5">
            {closing.map((c) => (
              <div key={c.label} className="flex justify-between gap-4">
                <dt className="text-fg-muted">{c.label}</dt>
                <dd className="font-medium tnum">{formatPrice(c.amount, currency)}</dd>
              </div>
            ))}
          </dl>

          <a href="#book" className="btn btn-primary mt-5 w-full">
            Request a formal proposal
          </a>
          {/* The full calculator works in Naira, so only link it for ₦ listings */}
          {currency === "NGN" && (
            <a href={`/mortgage?price=${Math.round(price)}`} className="link-editorial mt-3 block text-center text-[12px] font-medium tracking-[0.04em]">
              Open the full affordability calculator
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function Slider({
  label, value, display, min, max, step, onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="eyebrow">{label}</span>
        <span className="text-[13px] font-semibold text-brand tnum">{display}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full" />
    </label>
  );
}
