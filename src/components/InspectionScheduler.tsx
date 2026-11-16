"use client";

import Image from "next/image";
import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { submitInquiryAction } from "@/lib/inquiries";
import Icon, { type IconName } from "./Icon";

type Summary = {
  slug: string;
  name: string;
  place: string;
  region: string;
  cover: string;
  priceLabel: string;
  chips: string[];
};
type AgentInfo = { name: string; role: string; initials: string; photo?: string; accreditation?: string; letter?: string };
type Day = { key: string; dow: string; date: string; month: string; label: string };

const TIMES = ["10:00", "11:30", "14:00", "16:30"];
const CHANNELS: { key: string; label: string; icon: IconName }[] = [
  { key: "WhatsApp", label: "WhatsApp", icon: "chat" },
  { key: "Phone call", label: "Phone call", icon: "phone" },
  { key: "Email", label: "Email", icon: "mail" },
];

/**
 * "Schedule a private inspection" modal.
 * Opens when the URL hash becomes #schedule, so any link on the page can open it:
 *   <a href="#schedule">Schedule inspection</a>
 * Uses the native <dialog> element: Esc closes it and focus stays inside while open.
 */
export default function InspectionScheduler({ residence, agent, land = false }: { residence: Summary; agent?: AgentInfo; land?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [state, action, pending] = useActionState(submitInquiryAction, null);

  const [mode, setMode] = useState<"On-site" | "Live stream">("On-site");
  const [days, setDays] = useState<Day[]>([]);
  const [day, setDay] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState("WhatsApp");

  // Next five days, skipping Sundays. Built in the browser so server and client never disagree.
  useEffect(() => {
    const out: Day[] = [];
    const d = new Date();
    while (out.length < 5) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() === 0) continue; // no Sunday inspections
      out.push({
        key: d.toDateString(),
        dow: d.toLocaleDateString("en-GB", { weekday: "short" }),
        date: String(d.getDate()),
        month: d.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
        label: d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
      });
    }
    setDays(out);
  }, []);

  // Open on #schedule, close by clearing the hash
  const close = useCallback(() => {
    ref.current?.close();
    if (window.location.hash === "#schedule") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);
  useEffect(() => {
    const sync = () => {
      if (window.location.hash === "#schedule" && !ref.current?.open) ref.current?.showModal();
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const chosen = days.find((d) => d.key === day);
  const sent = state?.ok === true;
  // Progress through the four steps
  const steps = [
    { label: "Schedule", done: !!(chosen && time) },
    { label: "Details", done: !!(name.trim() && /\S+@\S+\.\S+/.test(email)) },
    { label: "Channel", done: !!channel && !!(chosen && time) && !!name.trim() },
    { label: "Confirmed", done: sent },
  ];
  const current = steps.findIndex((s) => !s.done);

  const note = `[Inspection: ${mode}${chosen ? `, ${chosen.label}` : ""}${time ? ` at ${time}` : ""}, confirm via ${channel}]`;

  return (
    <dialog
      ref={ref}
      onClose={close}
      onClick={(e) => e.target === ref.current && close()} // click on the dimmed backdrop closes it
      aria-labelledby="schedule-title"
      className="m-auto max-h-[92vh] w-[min(1240px,calc(100vw-2rem))] overflow-hidden rounded-lg border border-border bg-bg p-0 text-fg backdrop:bg-fg/65"
    >
      <div className="flex max-h-[92vh] flex-col">
        {/* Header */}
        <div className="relative border-b border-border bg-surface px-5 pb-5 pt-6 md:px-10">
          <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand via-brand/70 to-transparent" />
          <span className="eyebrow flex items-center gap-2 !text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Private inspection
          </span>
          <h2 id="schedule-title" className="headline-lg pr-12 pt-1">Schedule a private inspection</h2>
          <p className="pt-1 text-fg-muted">
            Book an accompanied {land ? "site visit" : "walkthrough"}, or a live video session if you are abroad.
          </p>
          <button type="button" onClick={close} aria-label="Close"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-lg bg-sand/70 hover:bg-sand md:right-8 md:top-6">
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-12">
          {/* ---------- LEFT: the form ---------- */}
          <div className="px-5 py-6 md:px-10 lg:col-span-7">
            {/* Stepper */}
            <ol className="mb-8 flex items-center gap-2">
              {steps.map((s, i) => {
                const isCurrent = i === current;
                const lit = s.done || isCurrent;
                return (
                  <li key={s.label} className="flex flex-1 items-center gap-2 last:flex-none">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${
                      s.done ? "bg-verified text-bg" : isCurrent ? "bg-brand text-bg" : "bg-sand text-fg-muted"}`}>
                      {s.done ? <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.5} /> : i + 1}
                    </span>
                    <span className={`hidden text-[11px] font-semibold uppercase tracking-[0.08em] sm:inline ${lit ? "text-fg" : "text-fg-subtle"}`}>
                      {s.label}
                    </span>
                    {i < steps.length - 1 && <span className="h-px flex-1 bg-border" />}
                  </li>
                );
              })}
            </ol>

            {sent ? (
              <div role="status" className="rounded-lg border border-verified/30 bg-verified-soft p-8 text-center">
                <Icon name="check" className="mx-auto h-8 w-8 text-verified" strokeWidth={2} />
                <p className="headline-md pt-3">Inspection requested.</p>
                <p className="mx-auto max-w-md pt-2 text-fg-muted">
                  {mode} inspection of {residence.name}
                  {chosen ? ` on ${chosen.label}` : ""}{time ? ` at ${time}` : ""}.
                  {agent ? ` ${agent.name.split(" ")[0]}` : " We"} will confirm by {channel.toLowerCase()}.
                </p>
                <button type="button" onClick={close} className="btn btn-secondary mt-6">Close</button>
              </div>
            ) : (
              <form action={action} className="space-y-8">
                <input type="hidden" name="residenceSlug" value={residence.slug} />
                <input type="hidden" name="note" value={note} />

                {/* 1. Modality */}
                <fieldset>
                  <legend className="eyebrow mb-3 !text-fg">1. Inspection type</legend>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <ModeCard
                      on={mode === "On-site"} onClick={() => setMode("On-site")} icon="home"
                      title="Physical on-site"
                      body={`Accompanied private ${land ? "site visit" : "walkthrough"} with a licensed partner.`}
                      foot={residence.region} minutes={60}
                    />
                    <ModeCard
                      on={mode === "Live stream"} onClick={() => setMode("Live stream")} icon="video"
                      title="Diaspora live stream"
                      body="One-to-one HD video walkthrough for clients abroad."
                      foot="Zoom / Google Meet" minutes={45}
                    />
                  </div>
                </fieldset>

                {/* 2. Date */}
                <fieldset>
                  <div className="mb-3 flex items-baseline justify-between">
                    <legend className="eyebrow !text-fg">2. Select a date (West Africa Time)</legend>
                    {days[0] && <span className="eyebrow !text-brand">{days[0].month}</span>}
                  </div>
                  <div className="grid min-h-[84px] grid-cols-5 gap-2">
                    {days.map((d) => {
                      const on = day === d.key;
                      return (
                        <button key={d.key} type="button" aria-pressed={on} onClick={() => setDay(d.key)}
                          className={`rounded border px-1 py-3 text-center transition-colors ${
                            on ? "border-brand bg-brand text-bg" : "border-border bg-surface hover:border-fg/40"}`}>
                          <span className="block text-[11px] font-semibold uppercase tracking-[0.08em]">{d.dow}</span>
                          <span className="block font-display text-[26px] leading-8">{d.date}</span>
                          <span className={`block text-[11px] ${on ? "text-bg/85" : "text-fg-subtle"}`}>{on ? "Selected" : "Available"}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* 3. Time */}
                <fieldset>
                  <legend className="eyebrow mb-3 !text-fg">3. Available times</legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {TIMES.map((t) => (
                      <button key={t} type="button" aria-pressed={time === t} onClick={() => setTime(t)}
                        className={`rounded border py-2.5 text-[14px] font-medium tnum transition-colors ${
                          time === t ? "border-brand bg-brand text-bg" : "border-border bg-surface hover:border-fg/40"}`}>
                        {t}{time === t ? " ✓" : ""}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* 4. Details + channel */}
                <fieldset className="rounded-lg border border-border bg-surface p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <legend className="eyebrow flex items-center gap-2 !text-fg">
                      <Icon name="doc" className="h-4 w-4 text-brand" /> 4. Your details
                    </legend>
                    <span className="text-[11px] text-fg-subtle">Kept confidential</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Full name">
                      <input name="name" className="input !bg-bg" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} />
                    </Field>
                    <Field label="Email">
                      <input name="email" type="email" className="input !bg-bg" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Field>
                    <Field label="Phone (+234 or international)">
                      <input name="phone" type="tel" className="input !bg-bg" autoComplete="tel" placeholder="+234 803 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </Field>
                  </div>

                  <span className="eyebrow mb-2 mt-4 block">How should we confirm?</span>
                  <div className="flex flex-wrap gap-2">
                    {CHANNELS.map((c) => (
                      <button key={c.key} type="button" aria-pressed={channel === c.key} onClick={() => setChannel(c.key)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[12px] font-semibold tracking-[0.04em] transition-colors ${
                          channel === c.key ? "bg-brand text-bg" : "bg-sand/70 hover:bg-sand"}`}>
                        <Icon name={c.icon} className="h-4 w-4" /> {c.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {state?.error && (
                  <p role="alert" className="rounded border border-error/30 bg-error/5 px-3 py-2 text-[13px] text-error">{state.error}</p>
                )}

                <div className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                  <p className="text-[12px] text-fg-muted">
                    {chosen && time ? `${mode}, ${chosen.label} at ${time}` : "Pick a date and time to continue."}
                  </p>
                  <button type="submit" disabled={pending || !chosen || !time} className="btn btn-primary disabled:opacity-40">
                    <Icon name="calendar" className="h-4 w-4" />
                    {pending ? "Sending…" : "Request inspection"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ---------- RIGHT: summary ---------- */}
          <aside className="space-y-5 border-t border-border bg-sand/50 px-5 py-6 md:px-10 lg:col-span-5 lg:border-l lg:border-t-0">
            <div className="overflow-hidden rounded-lg border border-border bg-surface">
              <div className="relative h-48">
                {residence.cover && <Image src={residence.cover} alt={residence.name} fill sizes="(min-width:1024px) 420px, 100vw" className="object-cover" />}
                <span className="badge absolute left-3 top-3 !bg-surface/95">{residence.region}</span>
              </div>
              <div className="p-4">
                <p className="price-display text-brand">{residence.priceLabel}</p>
                <h3 className="headline-sm pt-1">{residence.name}</h3>
                <p className="flex items-center gap-1 pt-1 text-[13px] text-fg-muted">
                  <Icon name="pin" className="h-4 w-4 shrink-0 text-brand" /> {residence.place}
                </p>
                {residence.chips.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {residence.chips.map((c) => (
                      <span key={c} className="rounded-sm border border-border bg-bg px-2 py-0.5 text-[11px] text-fg-muted">{c}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {agent && (
              <div className="rounded-lg border border-border bg-surface p-4">
                <span className="eyebrow block">Your accompanying partner</span>
                <div className="mt-3 flex items-center gap-3">
                  <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded bg-sand font-display text-xl">
                    {agent.photo ? <Image src={agent.photo} alt="" fill sizes="56px" className="object-cover" /> : agent.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="headline-sm leading-tight">{agent.name}</p>
                    <p className="text-[13px] text-fg-muted">{agent.role}</p>
                    {agent.accreditation && (
                      <p className="flex items-center gap-1 pt-0.5 text-[12px] font-medium text-verified">
                        <Icon name="verified" className="h-3.5 w-3.5" /> {agent.accreditation}
                      </p>
                    )}
                  </div>
                </div>
                {agent.letter && (
                  <p className="mt-3 rounded bg-bg p-3 text-[12px] italic leading-[18px] text-fg-muted line-clamp-4">“{agent.letter}”</p>
                )}
              </div>
            )}

            <div className="rounded-lg border border-verified/25 bg-verified-soft p-4">
              <span className="eyebrow flex items-center gap-1.5 !text-verified">
                <Icon name="shield" className="h-4 w-4" /> Haven due-diligence guarantee
              </span>
              <ul className="mt-2 space-y-1 text-[13px] text-fg">
                <li className="flex gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-verified" strokeWidth={2} />No inspection fees</li>
                <li className="flex gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-verified" strokeWidth={2} />Title documents available before you commit</li>
                <li className="flex gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-verified" strokeWidth={2} />Never pay into a personal account</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </dialog>
  );
}

function ModeCard({ on, onClick, icon, title, body, foot, minutes }: {
  on: boolean; onClick: () => void; icon: IconName; title: string; body: string; foot: string; minutes: number;
}) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick}
      className={`relative flex flex-col rounded-lg border p-4 text-left transition-colors ${
        on ? "border-brand bg-surface" : "border-border bg-surface/60 hover:border-fg/40"}`}>
      <span className={`flex h-10 w-10 items-center justify-center rounded ${on ? "bg-brand text-bg" : "bg-sand text-fg"}`}>
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <span className={`absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full ${on ? "bg-brand text-bg" : "border border-border bg-bg"}`}>
        {on && <Icon name="check" className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span className="pt-3 text-[16px] font-semibold tracking-[0.02em]">{title}</span>
      <span className="pt-1 text-[13px] leading-5 text-fg-muted">{body}</span>
      <span className="mt-3 flex justify-between border-t border-border pt-2 text-[12px] font-semibold tracking-[0.04em] text-brand">
        <span className="truncate">{foot}</span><span className="shrink-0 pl-2">{minutes} min</span>
      </span>
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow mb-1 block">{label}</span>
      {children}
    </label>
  );
}
