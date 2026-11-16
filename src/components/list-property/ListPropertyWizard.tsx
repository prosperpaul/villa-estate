"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { RESIDENCE_TYPES } from "@/lib/listing";
import { formatArea, formatPrice, formatPriceShort } from "@/lib/format";
import {
  CURRENCIES, STEPS, annualServiceCharge, emptyDraft, rentTotals, validateStep, type ListingDraft,
} from "@/lib/listing-draft";
import { submitListingAction } from "@/lib/listing-submit";
import Icon from "@/components/Icon";

const STORAGE_KEY = "haven-listing-draft-v1";

export default function ListPropertyWizard() {
  const [d, setD] = useState<ListingDraft>(emptyDraft);
  const [step, setStep] = useState(0);
  const [visited, setVisited] = useState(0); // furthest step reached
  const [showErrors, setShowErrors] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [pending, start] = useTransition();
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [doneRef, setDoneRef] = useState<string | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const top = useRef<HTMLDivElement>(null);

  // Restore a saved draft after the page loads (browser only, so no hydration mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setD({ ...emptyDraft, ...saved.draft });
        setStep(saved.step ?? 0);
        setVisited(saved.visited ?? 0);
        setSavedAt(saved.at ?? null);
      }
    } catch {
      /* storage blocked or corrupted: start fresh */
    }
    setLoaded(true);
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  // Autosave on every change
  useEffect(() => {
    if (!loaded || doneRef) return;
    const at = Date.now();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ draft: d, step, visited, at }));
      setSavedAt(at);
      setNow(at);
    } catch {
      /* ignore */
    }
  }, [d, step, visited, loaded, doneRef]);

  const set = <K extends keyof ListingDraft>(k: K, v: ListingDraft[K]) => setD((prev) => ({ ...prev, [k]: v }));
  const errors = validateStep(step, d);
  const stepOk = (i: number) => validateStep(i, d).length === 0;
  const rent = d.listing === "rent";
  const totals = rentTotals(d);
  const money = (n: number) => formatPrice(Math.max(0, Math.round(n)), d.currency);

  const go = (i: number) => {
    setStep(i);
    setShowErrors(false);
    setServerErrors([]);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const next = () => {
    if (errors.length) return setShowErrors(true);
    const n = Math.min(step + 1, STEPS.length - 1);
    setVisited((v) => Math.max(v, n));
    go(n);
  };

  const submit = () => {
    if (errors.length) return setShowErrors(true);
    start(async () => {
      const res = await submitListingAction(d, honeypot.current?.value ?? "");
      if (res.ok) {
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
        setDoneRef(res.ref);
      } else {
        setServerErrors(res.errors);
      }
    });
  };

  // One-line summary under each step card
  const summary = (i: number): string => {
    switch (STEPS[i].key) {
      case "type": return `${rent ? "Rent" : "Sale"}, ${d.type}`;
      case "location": return d.town ? `${d.town}${d.region ? `, ${d.region}` : ""}` : "Not started";
      case "specs": return d.type === "Land" ? (d.plotArea ? `${formatArea(d.plotArea)} plot` : "Not started") : `${d.beds} bed · ${d.baths} bath${d.interiorArea ? ` · ${d.interiorArea}m²` : ""}`;
      case "money": return d.price ? `${formatPriceShort(d.price, d.currency)}${rent ? " / yr" : ""}` : "Not started";
      case "media": { const n = d.photoLinks.filter(Boolean).length; return `${n} photo link${n === 1 ? "" : "s"}`; }
      case "title": { const n = d.titleDocs.filter((t) => t.name).length; return `${n} document${n === 1 ? "" : "s"}`; }
      default: return "Submit for review";
    }
  };

  const savedLabel = !savedAt ? "Not saved yet" : now - savedAt < 60_000 ? "Draft saved just now" : `Draft saved ${Math.round((now - savedAt) / 60_000)}m ago`;

  /* ---------------- Success ---------------- */
  if (doneRef) {
    return (
      <div className="mx-auto max-w-2xl rounded-lg border border-verified/30 bg-verified-soft p-8 text-center md:p-12">
        <Icon name="check" className="mx-auto h-10 w-10 text-verified" strokeWidth={2} />
        <h2 className="headline-lg pt-3">Listing received.</h2>
        <p className="pt-3 text-fg-muted">
          Thank you, {d.contactName.split(" ")[0]}. Our team will verify your title documents, arrange
          photography and contact you at {d.contactEmail} before anything goes live.
        </p>
        <p className="eyebrow pt-5">Reference: {doneRef}</p>
        <Link href="/" className="btn btn-primary mt-6">Back to home</Link>
      </div>
    );
  }

  return (
    <div ref={top} className="scroll-mt-24">
      {/* ============ ONBOARDING HEADER + STEPPER ============ */}
      <section className="rounded-lg border border-border bg-surface p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="eyebrow !text-brand">Onboarding dossier</span>
            <h1 className="headline-md pt-1">List your property</h1>
          </div>
          <span className={`flex items-center gap-2 rounded-full border border-border bg-bg px-3 py-1 text-[12px] ${loaded ? "" : "invisible"}`} aria-live="polite">
            <span className={`h-2 w-2 rounded-full ${savedAt ? "bg-verified" : "bg-fg-subtle"}`} />
            {savedLabel}
          </span>
        </div>

        <ol className="-mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
          {STEPS.map((s, i) => {
            const active = i === step;
            const reachable = i <= visited;
            const ok = reachable && stepOk(i) && i !== step;
            return (
              <li key={s.key} className="min-w-[140px] flex-1">
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => go(i)}
                  aria-current={active ? "step" : undefined}
                  className={`flex h-full w-full flex-col rounded border p-3 text-left transition-colors disabled:cursor-not-allowed ${
                    active ? "border-brand bg-brand text-bg" : reachable ? "border-border bg-bg hover:border-fg/40" : "border-border bg-bg/50 text-fg-subtle"
                  }`}
                >
                  <span className="flex items-center justify-between text-[12px] font-semibold tnum">
                    {String(i + 1).padStart(2, "0")}
                    {active ? <span className="h-2 w-2 rounded-full bg-bg" /> : ok ? <Icon name="check" className="h-4 w-4 text-verified" strokeWidth={2} /> : <span className="h-3.5 w-3.5 rounded-full border border-current opacity-50" />}
                  </span>
                  <span className="pt-1 text-[13px] font-semibold tracking-[0.02em]">{s.title}</span>
                  <span className={`truncate text-[12px] ${active ? "text-bg/80" : "text-fg-muted"}`}>{active ? "Current step" : summary(i)}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* ============ LEFT: the step ============ */}
        <section className="min-w-0 lg:col-span-7">
          <div className="rounded-lg border border-border bg-surface p-5 md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge !rounded-sm">Chapter {String(step + 1).padStart(2, "0")}</span>
              <span className="text-[12px] tracking-[0.04em] text-fg-muted">{STEPS[step].title}</span>
            </div>

            {/* ---- Step bodies ---- */}
            {STEPS[step].key === "type" && (
              <StepHead title="What are you listing?" intro="Choose whether it's for sale or for rent, and what kind of property it is.">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Choice on={rent} onClick={() => set("listing", "rent")} icon="calendar" title="For rent" body="Annual tenancy, with service charge and move-in costs." />
                  <Choice on={!rent} onClick={() => set("listing", "sale")} icon="home" title="For sale" body="Outright sale or vendor instalment plans." />
                </div>
                <Label>Property type</Label>
                <Pills options={RESIDENCE_TYPES} value={d.type} onChange={(v) => set("type", v)} />
                <Label>Currency</Label>
                <Pills options={CURRENCIES} value={d.currency} onChange={(v) => set("currency", v)} />
              </StepHead>
            )}

            {STEPS[step].key === "location" && (
              <StepHead title="Where is it?" intro="The exact address stays private until a viewing is confirmed.">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Text label="Area or street" value={d.town} onChange={(v) => set("town", v)} placeholder="e.g. Lekki Phase 1" />
                  <Text label="City or state" value={d.region} onChange={(v) => set("region", v)} placeholder="e.g. Lagos" />
                  <Text label="Country" value={d.country} onChange={(v) => set("country", v)} />
                </div>
                <details className="mt-4 rounded border border-border bg-bg p-3">
                  <summary className="cursor-pointer text-[13px] font-medium">Map coordinates (optional)</summary>
                  <p className="pt-2 text-[12px] text-fg-muted">Right-click the spot in Google Maps to copy them. Our surveyor will confirm them anyway.</p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <Text label="Latitude" value={d.lat} onChange={(v) => set("lat", v)} placeholder="6.4474" inputMode="decimal" />
                    <Text label="Longitude" value={d.lng} onChange={(v) => set("lng", v)} placeholder="3.4842" inputMode="decimal" />
                  </div>
                </details>
              </StepHead>
            )}

            {STEPS[step].key === "specs" && (
              <StepHead title="Describe the property" intro="Clear, honest details get faster approval.">
                <Text label="Listing title" value={d.name} onChange={(v) => set("name", v)} placeholder="3 Bedroom Serviced Apartment with BQ" />
                <div className="mt-4"><Text label="Tagline (optional)" value={d.tagline} onChange={(v) => set("tagline", v)} placeholder="Quiet cul-de-sac off Admiralty Way" /></div>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {d.type !== "Land" && <NumberField label="Bedrooms" value={d.beds} onChange={(v) => set("beds", v)} />}
                  {d.type !== "Land" && <NumberField label="Bathrooms" value={d.baths} onChange={(v) => set("baths", v)} step={0.5} />}
                  {d.type !== "Land" && <NumberField label="Interior m²" value={d.interiorArea} onChange={(v) => set("interiorArea", v)} />}
                  <NumberField label="Plot m²" value={d.plotArea} onChange={(v) => set("plotArea", v)} />
                </div>
                {!rent && (
                  <>
                    <Label>Tenure</Label>
                    <Pills options={["Freehold", "Leasehold"] as const} value={d.tenure} onChange={(v) => set("tenure", v)} />
                  </>
                )}
                <label className="mt-4 block">
                  <span className="eyebrow mb-1 block">Description</span>
                  <textarea className="input min-h-[140px]" value={d.description} onChange={(e) => set("description", e.target.value)}
                    placeholder="Layout, finishes, estate, power and water, security, access roads…" />
                  <span className="text-[11px] text-fg-subtle">{d.description.trim().length} / 40 characters minimum</span>
                </label>
                <div className="mt-4"><Text label="Features (comma-separated)" value={d.features} onChange={(v) => set("features", v)} placeholder="24/7 power, Ensuite BQ, Gated estate, Pool" /></div>
              </StepHead>
            )}

            {STEPS[step].key === "money" && (rent ? (
              /* ---- Design 10: the rent ledger ---- */
              <StepHead title="Financials & rent breakdown" intro="Set the annual rent and itemise every charge so tenants see the full cost upfront. No hidden fees.">
                <div className="space-y-5">
                  <div>
                    <Money label={`1. Base annual rent (${d.currency})`} value={d.price} onChange={(v) => set("price", v)} currency={d.currency} suffix="/ year" />
                    <p className="pt-1 text-[12px] text-fg-muted">Required. This is the headline price tenants see.</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="eyebrow">2. Service charge</span>
                      <div className="inline-flex rounded-full border border-border bg-bg p-0.5 text-[11px]">
                        {(["annual", "monthly"] as const).map((m) => (
                          <button key={m} type="button" aria-pressed={d.serviceChargeMode === m} onClick={() => set("serviceChargeMode", m)}
                            className={`rounded-full px-3 py-0.5 capitalize ${d.serviceChargeMode === m ? "bg-fg text-bg" : "text-fg-muted"}`}>{m}</button>
                        ))}
                      </div>
                    </div>
                    <Money label="Service charge" hideLabel value={d.serviceCharge} onChange={(v) => set("serviceCharge", v)} currency={d.currency}
                      suffix={d.serviceChargeMode === "monthly" ? "/ month" : "/ year"} />
                    <p className="pt-1 text-[12px] text-fg-muted">
                      Generator, water treatment, security, waste and facility management.
                      {d.serviceChargeMode === "monthly" && d.serviceCharge > 0 && ` That's ${money(annualServiceCharge(d))} a year.`}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <Money label="3. Caution deposit (refundable)" value={d.caution} onChange={(v) => set("caution", v)} currency={d.currency} />
                      <p className="pt-1 text-[12px] text-fg-muted">
                        {d.price > 0 && d.caution > 0 ? `${((d.caution / d.price) * 100).toFixed(1)}% of rent. ` : ""}Held in escrow.
                      </p>
                    </div>
                    <PercentMoney label="4. Legal & agreement" value={d.legal} onChange={(v) => set("legal", v)} base={d.price} currency={d.currency} note="Tenancy agreement preparation." />
                    <PercentMoney label="5. Agency commission" value={d.agency} onChange={(v) => set("agency", v)} base={d.price} currency={d.currency} note="Agent's fee for the letting." />
                    <div>
                      <span className="eyebrow mb-1 block">6. Rent due upfront</span>
                      <div className="space-y-2">
                        {([1, 2] as const).map((y) => (
                          <label key={y} className={`flex cursor-pointer items-center justify-between rounded border px-3 py-2 text-[13px] ${d.upfrontYears === y ? "border-brand bg-brand-soft" : "border-border bg-bg"}`}>
                            <span className="flex items-center gap-2">
                              <input type="radio" name="upfront" checked={d.upfrontYears === y} onChange={() => set("upfrontYears", y)} />
                              {y} year{y === 2 ? "s" : ""} upfront
                            </span>
                            <span className="text-[11px] text-fg-muted">{y === 1 ? "Market standard" : "Higher value"}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 rounded border border-border bg-sand/60 p-4">
                    <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                    <p className="text-[13px] leading-5">
                      <strong className="font-semibold">Transparency rule.</strong> Every charge is shown to tenants before
                      their visit. Haven does not allow hidden gate fees or undeclared levies.
                    </p>
                  </div>

                  {/* Summary ledger */}
                  <div className="rounded-lg border border-border bg-bg p-5">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <span className="eyebrow block">Summary ledger</span>
                        <span className="font-display text-[22px] leading-7">Total tenant move-in</span>
                      </div>
                      <span className="font-display text-[40px] font-medium leading-[44px] text-brand tnum">{money(totals.moveIn)}</span>
                    </div>
                    <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1.5 border-t border-border pt-4 text-[13px] sm:grid-cols-2">
                      <Line k={d.upfrontYears === 2 ? "Rent (2 years)" : "Base annual rent"} v={money(totals.rent)} />
                      <Line k="Service charge" v={money(totals.sc)} />
                      <Line k="Caution (refundable)" v={money(d.caution)} />
                      <Line k="Legal & agreement" v={money(d.legal)} />
                      <Line k="Agency commission" v={money(d.agency)} />
                      <div className="flex justify-between gap-3 rounded-sm bg-brand-soft px-2 py-1 font-semibold text-brand">
                        <dt>To landlord (rent + service)</dt><dd className="tnum">{money(totals.landlord)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </StepHead>
            ) : (
              <StepHead title="Price & terms" intro="Set the asking price. You can add vendor instalment plans with our team later.">
                <Money label={`Asking price (${d.currency})`} value={d.price} onChange={(v) => set("price", v)} currency={d.currency} />
                <p className="pt-2 text-[12px] text-fg-muted">Your agent will help agree the final guide price after inspection.</p>
              </StepHead>
            ))}

            {STEPS[step].key === "media" && (
              <StepHead title="Photos & video" intro="Share links to existing photos (Google Drive, Dropbox, your website). Our team arranges professional photography before the listing goes live.">
                <div className="space-y-2">
                  {d.photoLinks.map((l, i) => (
                    <div key={i} className="flex gap-2">
                      <input className="input" value={l} placeholder="https://…" aria-label={`Photo link ${i + 1}`}
                        onChange={(e) => set("photoLinks", d.photoLinks.map((x, j) => (j === i ? e.target.value : x)))} />
                      <button type="button" aria-label="Remove link" onClick={() => set("photoLinks", d.photoLinks.filter((_, j) => j !== i))}
                        className="shrink-0 rounded px-3 text-fg-muted hover:bg-sand hover:text-error">×</button>
                    </div>
                  ))}
                  {d.photoLinks.length < 12 && (
                    <button type="button" onClick={() => set("photoLinks", [...d.photoLinks, ""])} className="btn btn-secondary !px-4 !py-2 text-[12px]">+ Add photo link</button>
                  )}
                </div>
                <div className="mt-5"><Text label="Video walkthrough link (optional)" value={d.videoUrl} onChange={(v) => set("videoUrl", v)} placeholder="https://youtu.be/…" /></div>
              </StepHead>
            )}

            {STEPS[step].key === "title" && (
              <StepHead title="Title & deeds" intro="List the documents you hold. Haven verifies each one at the land registry before publication. Nothing is marked verified until we've checked it.">
                <div className="space-y-3">
                  {d.titleDocs.map((t, i) => {
                    const upd = (k: "name" | "detail" | "authority", v: string) =>
                      set("titleDocs", d.titleDocs.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
                    return (
                      <div key={i} className="grid grid-cols-1 gap-2 rounded border border-border bg-bg p-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
                        <input className="input" aria-label="Document" placeholder="Governor's Consent" value={t.name} onChange={(e) => upd("name", e.target.value)} />
                        <input className="input" aria-label="Reference" placeholder="File / volume / page" value={t.detail} onChange={(e) => upd("detail", e.target.value)} />
                        <input className="input" aria-label="Issuing authority" placeholder="Lands Registry, Alausa" value={t.authority} onChange={(e) => upd("authority", e.target.value)} />
                        <button type="button" aria-label="Remove document" onClick={() => set("titleDocs", d.titleDocs.filter((_, j) => j !== i))}
                          className="rounded px-3 text-fg-muted hover:bg-sand hover:text-error">×</button>
                      </div>
                    );
                  })}
                  {d.titleDocs.length < 10 && (
                    <button type="button" onClick={() => set("titleDocs", [...d.titleDocs, { name: "", detail: "", authority: "" }])} className="btn btn-secondary !px-4 !py-2 text-[12px]">
                      + Add document
                    </button>
                  )}
                </div>
              </StepHead>
            )}

            {STEPS[step].key === "review" && (
              <StepHead title="Review & submit" intro="Check the summary, add your contact details, and send it to our team for verification.">
                <dl className="divide-y divide-border rounded border border-border bg-bg text-[13px]">
                  {STEPS.slice(0, -1).map((s, i) => (
                    <div key={s.key} className="flex items-center justify-between gap-3 px-3 py-2">
                      <dt className="text-fg-muted">{s.title}</dt>
                      <dd className="flex items-center gap-3 text-right font-medium">
                        {summary(i)}
                        <button type="button" onClick={() => go(i)} className="link-editorial text-[12px] font-normal">Edit</button>
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Text label="Full name" value={d.contactName} onChange={(v) => set("contactName", v)} autoComplete="name" />
                  <Text label="Email" value={d.contactEmail} onChange={(v) => set("contactEmail", v)} type="email" autoComplete="email" />
                  <Text label="Phone & WhatsApp" value={d.contactPhone} onChange={(v) => set("contactPhone", v)} type="tel" placeholder="+234 803 000 0000" autoComplete="tel" />
                  <Text label="Company (optional)" value={d.company} onChange={(v) => set("company", v)} />
                </div>
                {/* Honeypot: hidden from people, irresistible to bots */}
                <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
                <label className="mt-5 flex items-start gap-2 text-[13px] leading-5">
                  <input type="checkbox" className="mt-0.5 h-4 w-4" checked={d.consent} onChange={(e) => set("consent", e.target.checked)} />
                  I confirm I own this property or am authorised to let or sell it, and that these details are accurate.
                </label>
              </StepHead>
            )}

            {/* Errors */}
            {(showErrors && errors.length > 0) || serverErrors.length > 0 ? (
              <ul role="alert" className="mt-6 space-y-1 rounded border border-error/30 bg-error/5 p-3 text-[13px] text-error">
                {(serverErrors.length ? serverErrors : errors).map((e) => <li key={e}>• {e}</li>)}
              </ul>
            ) : null}

            {/* Navigation */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
              <button type="button" onClick={() => go(Math.max(0, step - 1))} disabled={step === 0}
                className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-fg-muted hover:text-fg disabled:invisible">
                ← Back
              </button>
              <div className="flex gap-2">
                <span className="btn bg-sand/70 text-fg-muted !cursor-default text-[12px]">{loaded ? savedLabel.replace("Draft saved", "Saved") : "…"}</span>
                {step < STEPS.length - 1 ? (
                  <button type="button" onClick={next} className="btn btn-primary">
                    Save & continue to {STEPS[step + 1].title.toLowerCase()} →
                  </button>
                ) : (
                  <button type="button" onClick={submit} disabled={pending} className="btn btn-primary disabled:opacity-50">
                    {pending ? "Submitting…" : "Submit for review →"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ============ RIGHT: live preview ============ */}
        <aside className="lg:sticky lg:top-24 lg:col-span-5">
          <Preview d={d} />
        </aside>
      </div>
    </div>
  );
}

/* ---------------- Live preview ---------------- */

function Preview({ d }: { d: ListingDraft }) {
  const rent = d.listing === "rent";
  const totals = rentTotals(d);
  const firstPhoto = d.photoLinks.find((l) => /^https:\/\//.test(l));
  const chips = useMemo(
    () => [
      d.type === "Land" ? (d.plotArea ? `${formatArea(d.plotArea)} plot` : null) : `${d.beds} beds`,
      d.type === "Land" ? null : `${d.baths} baths`,
      d.interiorArea ? formatArea(d.interiorArea) : null,
      ...d.features.split(",").map((f) => f.trim()).filter(Boolean).slice(0, 2),
    ].filter(Boolean) as string[],
    [d],
  );
  const money = (n: number) => formatPrice(Math.max(0, Math.round(n)), d.currency);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="eyebrow flex items-center gap-2 !text-fg"><span className="h-2 w-2 rounded-full bg-brand" /> Live {rent ? "tenant" : "buyer"} preview</span>
        <span className="text-[11px] text-fg-muted">How it will look</span>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="relative aspect-[16/10] bg-sand">
          {firstPhoto ? (
            // Plain <img>: landlord links are arbitrary sites, which next/image would reject
            // eslint-disable-next-line @next/next/no-img-element
            <img src={firstPhoto} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-fg-muted">
              <Icon name="photos" className="h-8 w-8" />
              <span className="text-[12px]">Photos appear after our shoot</span>
            </div>
          )}
          <span className="badge absolute left-3 top-3 !bg-surface/95">{rent ? "For rent" : "For sale"}</span>
          {d.town && <span className="badge absolute right-3 top-3 !bg-surface/95">{d.town}</span>}
        </div>
        <div className="p-5">
          <h3 className="headline-sm">{d.name || "Your listing title"}</h3>
          <p className="flex items-center gap-1 pt-1 text-[13px] text-fg-muted">
            <Icon name="pin" className="h-4 w-4 shrink-0 text-brand" />
            {[d.town, d.region, d.country].filter(Boolean).join(", ") || "Location"}
          </p>
          {chips.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {chips.map((c) => <span key={c} className="rounded-sm border border-border bg-bg px-2 py-0.5 text-[11px] font-medium">{c}</span>)}
            </div>
          )}

          <div className="mt-4 rounded border border-border bg-bg p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="eyebrow block">{rent ? "Annual rent" : "Asking price"}</span>
                <span className="font-display text-[28px] font-medium leading-8 text-brand tnum">
                  {d.price ? money(d.price) : "–"}{rent && d.price ? <span className="font-sans text-[12px] font-normal text-fg-muted"> / yr</span> : null}
                </span>
              </div>
              {rent && (
                <div className="text-right">
                  <span className="eyebrow block">Move-in total</span>
                  <span className="font-display text-[20px] tnum">{totals.moveIn ? formatPriceShort(totals.moveIn, d.currency) : "–"}</span>
                </div>
              )}
            </div>
            {rent && (totals.sc > 0 || d.caution > 0) && (
              <dl className="mt-3 space-y-1 border-t border-border pt-3 text-[12px]">
                {totals.sc > 0 && <Line k="Service charge" v={`${money(totals.sc)} / yr`} />}
                {d.caution > 0 && <Line k="Refundable caution" v={money(d.caution)} />}
              </dl>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand font-display">{(d.company || d.contactName || "Y").charAt(0).toUpperCase()}</span>
              <span className="text-[13px] font-medium">{d.company || d.contactName || "Your name"}</span>
            </span>
            <span className="badge !px-2 !py-0.5 !text-[10px]">Pending verification</span>
          </div>
          <p className="pt-4 text-center text-[11px] italic text-fg-subtle">Preview only. Buttons are disabled.</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Small form pieces ---------------- */

function StepHead({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <>
      <h2 className="headline-lg pt-3">{title}</h2>
      <p className="pb-6 pt-2 text-fg-muted">{intro}</p>
      {children}
    </>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow mb-2 mt-5 block">{children}</span>;
}

function Choice({ on, onClick, icon, title, body }: { on: boolean; onClick: () => void; icon: "home" | "calendar"; title: string; body: string }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick}
      className={`flex gap-3 rounded-lg border p-4 text-left transition-colors ${on ? "border-brand bg-brand-soft" : "border-border bg-bg hover:border-fg/40"}`}>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded ${on ? "bg-brand text-bg" : "bg-sand"}`}><Icon name={icon} className="h-5 w-5" /></span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="block text-[13px] text-fg-muted">{body}</span>
      </span>
    </button>
  );
}

function Pills<T extends string>({ options, value, onChange }: { options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} type="button" aria-pressed={value === o} onClick={() => onChange(o)}
          className={`rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors ${value === o ? "bg-fg text-bg" : "bg-sand/70 hover:bg-sand"}`}>
          {o}
        </button>
      ))}
    </div>
  );
}

function Text({ label, value, onChange, placeholder, type = "text", inputMode, autoComplete }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-1 block">{label}</span>
      <input className="input" type={type} value={value} placeholder={placeholder} inputMode={inputMode} autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function NumberField({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <label className="block">
      <span className="eyebrow mb-1 block">{label}</span>
      <input className="input tnum" type="number" min={0} step={step} value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} />
    </label>
  );
}

// Money box: shows "12,000,000" while storing a number
function Money({ label, value, onChange, currency, suffix, hideLabel = false }: {
  label: string; value: number; onChange: (n: number) => void; currency: string; suffix?: string; hideLabel?: boolean;
}) {
  const symbol = formatPrice(0, currency as "NGN").replace(/[\d.,\s]/g, "");
  return (
    <label className="block">
      <span className={hideLabel ? "sr-only" : "eyebrow mb-1 block"}>{label}</span>
      <span className="mt-1 flex items-center gap-2 rounded border border-border bg-bg px-3 focus-within:border-brand">
        <span className="font-display text-[20px] text-fg-muted">{symbol}</span>
        <input inputMode="numeric" value={value ? Math.round(value).toLocaleString("en-GB") : ""} placeholder="0"
          onChange={(e) => onChange(Number(e.target.value.replace(/[^\d]/g, "")) || 0)}
          className="w-full bg-transparent py-2.5 font-display text-[22px] outline-none tnum" />
        {suffix && <span className="shrink-0 text-[12px] text-fg-muted">{suffix}</span>}
      </span>
    </label>
  );
}

// Money box with a quick "10% of rent" helper
function PercentMoney({ label, value, onChange, base, currency, note }: {
  label: string; value: number; onChange: (n: number) => void; base: number; currency: string; note: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="eyebrow">{label}</span>
        <button type="button" onClick={() => onChange(Math.round(base * 0.1))} disabled={!base}
          className="text-[11px] font-semibold tracking-[0.04em] text-brand hover:underline disabled:opacity-40">Use 10%</button>
      </div>
      <Money label={label} hideLabel value={value} onChange={onChange} currency={currency} />
      <p className="pt-1 text-[12px] text-fg-muted">{note}</p>
    </div>
  );
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-fg-muted">{k}</dt>
      <dd className="font-medium tnum">{v}</dd>
    </div>
  );
}
