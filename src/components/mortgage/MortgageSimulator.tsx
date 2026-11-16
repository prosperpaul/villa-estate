"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";

// All estimates. Real figures vary by lender, state and deal.
const PRICE_PRESETS = [45_000_000, 65_000_000, 120_000_000, 250_000_000];
const DEPOSIT_PRESETS = [10, 20, 30, 40];
const RATE_PRESETS = [
  { label: "NHF facility", rate: 6 },
  { label: "Commercial bank", rate: 16.5 },
  { label: "Developer instalment", rate: 12 },
];
// Governor's consent + stamp duty differ by state
const JURISDICTIONS = [
  { key: "lagos", label: "Lagos State", consent: 0.03 },
  { key: "abuja", label: "Abuja FCT", consent: 0.022 },
  { key: "rivers", label: "Rivers State", consent: 0.028 },
];
const LEGAL = 0.025; // legal conveyance & title perfection
const BANK = 0.015; // bank processing & valuation

const naira = (n: number) => formatPrice(Math.max(0, Math.round(n)), "NGN");
const digits = (s: string) => Number(s.replace(/[^\d]/g, "")) || 0;
const grouped = (n: number) => Math.round(n).toLocaleString("en-GB");

export default function MortgageSimulator({ initialPrice = 65_000_000 }: { initialPrice?: number }) {
  const [price, setPrice] = useState(initialPrice);
  const [deposit, setDeposit] = useState(Math.round(initialPrice * 0.2));
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(16.5);
  const [jur, setJur] = useState(JURISDICTIONS[0]);

  const depositPct = price > 0 ? Math.round((deposit / price) * 100) : 0;
  // Changing the price keeps the same deposit percentage, like the design
  const changePrice = (p: number) => {
    setDeposit(Math.round(p * (depositPct / 100)));
    setPrice(p);
  };

  // Amortisation: M = P·r(1+r)^n / ((1+r)^n − 1)
  const calc = useMemo(() => {
    const principal = Math.max(0, price - deposit);
    const n = years * 12;
    const r = rate / 100 / 12;
    const monthly = r > 0 ? (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1) : principal / n;
    const total = monthly * n;
    const interest = Math.max(0, total - principal);
    const consent = price * jur.consent;
    const legal = price * LEGAL;
    const bank = price * BANK;
    return { principal, monthly, total, interest, consent, legal, bank, cash: deposit + consent + legal + bank };
  }, [price, deposit, years, rate, jur]);

  const interestShare = calc.total > 0 ? (calc.interest / calc.total) * 100 : 0;

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
      {/* ---------- Inputs ---------- */}
      <div className="space-y-5 lg:col-span-7">
        {/* Price */}
        <Panel>
          <div className="flex items-baseline justify-between">
            <span className="eyebrow">Property purchase price</span>
            <span className="text-[12px] text-fg-muted">Nigerian Naira (NGN)</span>
          </div>
          <MoneyInput label="Property purchase price" value={price} onChange={changePrice} />
          <div className="mt-3 flex flex-wrap gap-2">
            {PRICE_PRESETS.map((p) => (
              <Chip key={p} on={price === p} onClick={() => changePrice(p)}>₦{p / 1_000_000}M</Chip>
            ))}
          </div>
          <input
            type="range"
            aria-label="Purchase price"
            min={10_000_000}
            max={500_000_000}
            step={5_000_000}
            value={Math.min(price, 500_000_000)}
            onChange={(e) => changePrice(Number(e.target.value))}
            className="mt-4 w-full"
          />
        </Panel>

        {/* Deposit */}
        <Panel>
          <div className="flex items-baseline justify-between">
            <span className="eyebrow">Down payment (equity)</span>
            <span className="text-[12px] font-semibold text-brand">{depositPct}% of value</span>
          </div>
          <MoneyInput label="Down payment" value={deposit} onChange={(v) => setDeposit(Math.min(v, price))} />
          <div className="mt-3 grid grid-cols-4 gap-2">
            {DEPOSIT_PRESETS.map((p) => (
              <Chip key={p} wide on={depositPct === p} onClick={() => setDeposit(Math.round(price * (p / 100)))}>{p}%</Chip>
            ))}
          </div>
        </Panel>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Term */}
          <Panel>
            <div className="flex items-baseline justify-between">
              <span className="eyebrow">Loan term</span>
              <span className="font-display text-[22px] text-brand">{years} years</span>
            </div>
            <p className="pt-1 text-[12px] text-fg-muted">Length of the mortgage.</p>
            <input type="range" aria-label="Loan term in years" min={5} max={30} step={1} value={years}
              onChange={(e) => setYears(Number(e.target.value))} className="mt-4 w-full" />
            <div className="flex justify-between text-[11px] text-fg-subtle"><span>5 yrs</span><span>30 yrs</span></div>
          </Panel>

          {/* Rate */}
          <Panel>
            <label htmlFor="rate" className="eyebrow block">Interest rate</label>
            <div className="mt-2 flex items-center rounded border border-border bg-bg px-3 focus-within:border-brand">
              <input
                id="rate"
                type="number"
                step={0.5}
                min={0}
                max={40}
                value={rate}
                onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                className="w-full bg-transparent py-2 font-display text-[20px] outline-none tnum"
              />
              <span className="shrink-0 whitespace-nowrap text-fg-muted">% p.a.</span>
            </div>
            <ul className="mt-3 space-y-1">
              {RATE_PRESETS.map((p) => (
                <li key={p.label}>
                  <button
                    type="button"
                    onClick={() => setRate(p.rate)}
                    className={`flex w-full justify-between rounded px-2 py-1 text-[12px] transition-colors ${
                      rate === p.rate ? "bg-sand font-semibold" : "text-fg-muted hover:bg-sand/60"
                    }`}
                  >
                    <span>{p.label}</span>
                    <span className="tnum">{p.rate.toFixed(1)}% p.a.</span>
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        {/* Jurisdiction */}
        <Panel>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <span className="eyebrow block">State of title transfer</span>
              <p className="pt-1 text-[12px] text-fg-muted">Affects consent, stamp duty and survey levies.</p>
            </div>
            <div className="flex gap-1">
              {JURISDICTIONS.map((j) => (
                <Chip key={j.key} on={jur.key === j.key} onClick={() => setJur(j)}>{j.label}</Chip>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* ---------- Results ---------- */}
      <div className="space-y-5 lg:sticky lg:top-24 lg:col-span-5">
        <div className="rounded-lg border border-border bg-sand p-5">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Estimated monthly repayment</span>
            <span className="badge !bg-bg">Equal monthly</span>
          </div>
          <p className="pt-2 font-display text-[44px] font-medium leading-[48px] tracking-[-0.02em] text-brand tnum">
            {naira(calc.monthly)}
          </p>
          <p className="text-[12px] text-fg-muted">Principal and interest over {years * 12} monthly repayments.</p>

          <div className="mt-5 flex items-center gap-5 border-t border-fg/10 pt-5">
            <Donut share={interestShare} />
            <dl className="flex-1 space-y-1.5 text-[13px]">
              <Line dot="bg-fg" k="Amount borrowed" v={naira(calc.principal)} />
              <Line dot="bg-brand" k="Total interest" v={naira(calc.interest)} accent />
              <Line k="Total repaid" v={naira(calc.total)} muted />
            </dl>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="eyebrow !text-brand">Closing costs (estimated)</span>
            <span className="text-[11px] text-fg-muted">{jur.label}</span>
          </div>
          <dl className="mt-3 space-y-1.5 border-b border-border pb-3 text-[13px]">
            <Line k={`Consent & stamp duty (${(jur.consent * 100).toFixed(1)}%)`} v={naira(calc.consent)} />
            <Line k={`Legal conveyance (${LEGAL * 100}%)`} v={naira(calc.legal)} />
            <Line k={`Bank processing & valuation (${BANK * 100}%)`} v={naira(calc.bank)} />
            <Line k="Down payment" v={naira(deposit)} />
          </dl>
          <div className="flex items-baseline justify-between pt-3">
            <span className="font-display text-[19px]">Total cash needed upfront</span>
            <span className="font-display text-[22px] font-medium text-brand tnum">{naira(calc.cash)}</span>
          </div>
        </div>

        <a href="#advisor" className="btn btn-primary w-full">Talk to a mortgage advisor →</a>
        <p className="text-center text-[11px] leading-4 text-fg-subtle">
          Indicative only. Subject to lender underwriting and state fee schedules.
        </p>
      </div>
    </div>
  );
}

/* ---------------- Small pieces ---------------- */

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-border bg-surface p-5">{children}</div>;
}

// Text box that shows "65,000,000" but stores a number
function MoneyInput({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="mt-2 flex items-center gap-2 rounded border border-border bg-bg px-3 focus-within:border-brand">
      <span className="font-display text-[20px] text-fg-muted">₦</span>
      <input
        aria-label={label}
        inputMode="numeric"
        value={grouped(value)}
        onChange={(e) => onChange(digits(e.target.value))}
        className="w-full bg-transparent py-2.5 font-display text-[22px] outline-none tnum"
      />
    </div>
  );
}

function Chip({ on, onClick, children, wide = false }: { on: boolean; onClick: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`rounded border px-3 py-1.5 text-[12px] font-medium tracking-[0.04em] transition-colors ${wide ? "w-full" : ""} ${
        on ? "border-brand bg-brand text-bg" : "border-border bg-bg hover:bg-sand"
      }`}
    >
      {children}
    </button>
  );
}

function Line({ k, v, dot, accent, muted }: { k: string; v: string; dot?: string; accent?: boolean; muted?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-3 ${muted ? "text-fg-muted" : ""}`}>
      <dt className="flex items-center gap-2">
        {dot && <span className={`h-2 w-2 rounded-full ${dot}`} />}
        {k}
      </dt>
      <dd className={`font-medium tnum ${accent ? "text-brand" : ""}`}>{v}</dd>
    </div>
  );
}

// Doughnut: the circle's circumference is exactly 100 (r = 15.915),
// so the interest percentage can be used directly as the dash length.
function Donut({ share }: { share: number }) {
  return (
    <svg viewBox="0 0 36 36" className="h-24 w-24 shrink-0" role="img" aria-label={`Interest is ${share.toFixed(1)}% of total repaid`}>
      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#161412" strokeWidth="4" />
      {/* rotate(-90) so the interest arc starts at 12 o'clock */}
      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#b5471f" strokeWidth="4"
        strokeDasharray={`${share} ${100 - share}`} transform="rotate(-90 18 18)" />
      <text x="18" y="17" textAnchor="middle" fill="#57423b" style={{ fontSize: "3.6px", letterSpacing: "0.08em" }}>INTEREST</text>
      <text x="18" y="22.5" textAnchor="middle" fill="#b5471f" style={{ fontSize: "5.5px", fontWeight: 600 }}>
        {share.toFixed(1)}%
      </text>
    </svg>
  );
}
