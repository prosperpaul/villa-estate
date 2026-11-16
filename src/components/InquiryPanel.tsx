"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import type { Agent } from "@/lib/agents";
import { submitInquiryAction } from "@/lib/inquiries";
import Icon from "./Icon";

type Kind = "Viewing" | "Price offer" | "Legal pack";

// Links elsewhere on the page can pre-select a request type via the URL hash:
//   <a href="#book-legal">  -> Legal pack
//   <a href="#book-offer">  -> Price offer
//   <a href="#book">        -> just scroll here
// Viewings are booked in the InspectionScheduler modal (opened with #schedule).
const HASH_TO_KIND: Record<string, Kind> = {
  "#book-legal": "Legal pack",
  "#book-offer": "Price offer",
  "#book-viewing": "Viewing",
};

// Agent console: open the inspection scheduler, make an offer, or ask for the legal pack.
// Offers and legal-pack requests land in the admin inbox via the existing server action.
export default function InquiryPanel({
  residenceName,
  residenceSlug,
  agent,
  land = false,
}: {
  residenceName: string;
  residenceSlug: string;
  agent?: Agent;
  land?: boolean; // land plots use "site inspection" wording
}) {
  const [state, action, pending] = useActionState(submitInquiryAction, null);
  const sent = state?.ok === true;

  const [kind, setKind] = useState<Kind>("Viewing");
  const [message, setMessage] = useState("");

  // React to #book-legal / #book-offer links
  useEffect(() => {
    const onHash = () => {
      const k = HASH_TO_KIND[window.location.hash];
      if (!k) return;
      setKind(k);
      document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const note = `[${kind}] ${message}`.trim();
  const firstName = agent?.name.split(" ")[0];
  const phoneDigits = agent?.phone.replace(/\D/g, "");

  return (
    <div id="book" className="scroll-mt-24 rounded-lg border border-border bg-surface">
      {agent && (
        <div className="flex items-center gap-3 border-b border-border p-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-sand font-display text-xl">
            {agent.initials}
          </span>
          <div className="min-w-0">
            <Link href={`/agents/${agent.slug}`} className="headline-sm block leading-tight hover:text-brand">
              {agent.name}
            </Link>
            <span className="eyebrow block pt-0.5">{agent.role} · {agent.basedIn}</span>
            <span className="text-[12px] text-fg-muted">Speaks {agent.languages.join(", ")}</span>
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Request type */}
        <fieldset>
          <legend className="eyebrow mb-2">I would like to</legend>
          <div className="grid grid-cols-3 gap-1 rounded border border-border bg-bg p-1">
            {(["Viewing", "Price offer", "Legal pack"] as const).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={kind === k}
                onClick={() => setKind(k)}
                className={`rounded-sm py-1.5 text-[12px] font-medium tracking-[0.04em] transition-colors ${
                  kind === k ? "bg-fg text-bg" : "text-fg-muted hover:text-fg"
                }`}
              >
                {k === "Viewing" ? (land ? "Inspect" : "View") : k === "Price offer" ? "Make offer" : "Legal pack"}
              </button>
            ))}
          </div>
        </fieldset>

        {kind === "Viewing" ? (
          /* Viewings open the full scheduler */
          <div className="mt-4 rounded border border-border bg-bg p-4">
            <p className="text-[14px] font-semibold tracking-[0.02em]">
              {land ? "Book a site inspection" : "Book a private viewing"}
            </p>
            <ul className="mt-2 space-y-1 text-[13px] leading-5 text-fg-muted">
              <li className="flex gap-2"><Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />Accompanied on-site visit, about 60 minutes</li>
              <li className="flex gap-2"><Icon name="video" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />Or a live video walkthrough from abroad</li>
            </ul>
            <a href="#schedule" className="btn btn-primary mt-4 w-full">
              <Icon name="calendar" className="h-4 w-4" />
              Choose a date & time
            </a>
          </div>
        ) : sent ? (
          <div className="mt-4 rounded border border-verified/30 bg-verified-soft px-4 py-6 text-center">
            <Icon name="check" className="mx-auto h-6 w-6 text-verified" strokeWidth={2} />
            <p className="headline-sm pt-2">Request received.</p>
            <p className="pt-1 text-[13px] leading-5 text-fg-muted">
              {firstName ?? "We"} will reply about {residenceName} within two working days.
            </p>
          </div>
        ) : (
          <form action={action} className="mt-4 space-y-4">
            <input type="hidden" name="residenceSlug" value={residenceSlug} />
            <input type="hidden" name="note" value={note} />

            <p className="rounded border border-border bg-bg p-3 text-[13px] leading-5 text-fg-muted">
              {kind === "Price offer"
                ? `Put your offer and any conditions below. ${firstName ?? "The agent"} will present it to the vendor and come back to you.`
                : "We will send certified copies of the title documents and the non-encumbrance search to your email."}
            </p>

            <div className="space-y-2">
              <Field label="Your name"><input name="name" className="input" autoComplete="name" required /></Field>
              <Field label="Email"><input name="email" type="email" className="input" autoComplete="email" required /></Field>
              <Field label="Phone (optional)"><input name="phone" type="tel" className="input" autoComplete="tel" /></Field>
              <Field label={kind === "Price offer" ? "Your offer & conditions" : "Message (optional)"}>
                <textarea
                  className="input min-h-[80px]"
                  rows={3}
                  value={message}
                  required={kind === "Price offer"}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={kind === "Price offer" ? "e.g. Offer of ... subject to survey" : `I'd like the title pack for ${residenceName}.`}
                />
              </Field>
            </div>

            {state?.error && (
              <p role="alert" className="rounded border border-error/30 bg-error/5 px-3 py-2 text-[13px] text-error">
                {state.error}
              </p>
            )}

            <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-50">
              <Icon name={kind === "Legal pack" ? "doc" : "mail"} className="h-4 w-4" />
              {pending ? "Sending…" : kind === "Price offer" ? "Send price offer" : "Request legal pack"}
            </button>
          </form>
        )}

        {agent && (
          <div className="mt-3 space-y-2">
            <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary w-full !py-2.5 text-[12px]">
              <Icon name="chat" className="h-4 w-4 text-verified" />
              WhatsApp {firstName} directly
            </a>
            <div className="grid grid-cols-2 gap-2">
              <a href={`tel:${agent.phone.replace(/\s/g, "")}`} className="btn btn-ghost !justify-center rounded-full border border-border !py-2 text-[12px]">
                <Icon name="phone" className="h-4 w-4" /> Call
              </a>
              <a href={`mailto:${agent.email}`} className="btn btn-ghost !justify-center rounded-full border border-border !py-2 text-[12px]">
                <Icon name="mail" className="h-4 w-4" /> Email
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Anti-fraud notice */}
      <div className="flex gap-3 border-t border-border bg-sand/50 p-4">
        <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-verified" />
        <p className="text-[12px] leading-[18px] text-fg-muted">
          <span className="eyebrow block !text-verified">Haven escrow & anti-fraud</span>
          No payment is ever due before a physical inspection. Never send money to a personal account.
        </p>
      </div>
    </div>
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
