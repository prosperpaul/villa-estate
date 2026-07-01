"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { Currency } from "@/lib/residences";

export default function MortgageCalc({ price, currency }: { price: number; currency: Currency }) {
  const [deposit, setDeposit] = useState(40);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(4.8);

  const { loan, monthly, total, totalInterest } = useMemo(() => {
    const loan = price * (1 - deposit / 100);
    const n = years * 12;
    const r = rate / 100 / 12;
    const monthly = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
    const total = monthly * n;
    return { loan, monthly, total, totalInterest: total - loan };
  }, [price, deposit, years, rate]);

  return (
    <section className="rounded-3xl border border-border bg-surface p-8 md:p-12">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-3xl tracking-tight">Mortgage calculator</h3>
        <span className="text-sm text-fg-muted">Indicative — for guidance only</span>
      </div>
      <p className="mt-2 max-w-xl text-fg-muted">
        Adjust the figures to estimate monthly repayments. We&apos;ll introduce you to our partner counsel for a formal proposal.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="space-y-7">
          <Slider label="Deposit" suffix="%" value={deposit} min={10} max={90} step={1} onChange={setDeposit} sub={formatPrice(price * (deposit / 100), currency)} />
          <Slider label="Term" suffix=" years" value={years} min={5} max={30} step={1} onChange={setYears} />
          <Slider label="Interest rate" suffix="% p.a." value={rate} min={1} max={9} step={0.1} onChange={setRate} />
        </div>

        <div className="rounded-2xl bg-surface-2 p-6 md:p-8">
          <div className="flex items-baseline justify-between text-sm text-fg-muted">
            <span>Monthly repayment</span>
            <span>{years} years</span>
          </div>
          <div className="mt-2 font-display text-5xl tracking-tight text-fg tnum">
            {formatPrice(monthly, currency)}
          </div>

          <dl className="mt-8 space-y-3 border-t border-border pt-5 text-sm tnum">
            <Row label="Property price" value={formatPrice(price, currency)} />
            <Row label={`Deposit (${deposit}%)`} value={formatPrice(price * (deposit / 100), currency)} />
            <Row label="Loan amount" value={formatPrice(loan, currency)} />
            <Row label="Total payable" value={formatPrice(total, currency)} />
            <Row label="Total interest" value={formatPrice(totalInterest, currency)} muted />
          </dl>

          <button className="btn btn-primary mt-7 w-full">
            Request a formal proposal
          </button>
        </div>
      </div>
    </section>
  );
}

function Slider({
  label,
  suffix,
  value,
  min,
  max,
  step,
  onChange,
  sub,
}: {
  label: string;
  suffix: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  sub?: string;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-fg">{label}</span>
        <span className="font-display text-2xl text-fg tnum">
          {value.toFixed(step < 1 ? 1 : 0)}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full"
      />
      <div className="mt-1 flex items-center justify-between text-xs text-fg-subtle tnum">
        <span>{min}{suffix}</span>
        {sub && <span>{sub}</span>}
        <span>{max}{suffix}</span>
      </div>
    </label>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between ${muted ? "text-fg-muted" : "text-fg"}`}>
      <dt>{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
