"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { Agent } from "@/lib/agents";
import { submitInquiryAction } from "@/lib/inquiries";

export default function InquiryPanel({
  residenceName,
  residenceSlug,
  agent,
}: {
  residenceName: string;
  residenceSlug: string;
  agent?: Agent;
}) {
  const [state, action, pending] = useActionState(submitInquiryAction, null);
  const sent = state?.ok === true;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      {agent && (
        <div className="flex items-center gap-3 border-b border-border pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand font-medium">
            {agent.initials}
          </div>
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wider text-fg-subtle">Represented by</div>
            <Link href={`/agents/${agent.slug}`} className="font-display text-lg text-fg hover:text-brand">
              {agent.name}
            </Link>
            <div className="text-xs text-fg-muted">{agent.basedIn}</div>
          </div>
        </div>
      )}

      {sent ? (
        <div className="mt-5 rounded-xl border border-brand-soft bg-brand-soft px-4 py-6 text-center">
          <div className="font-display text-lg text-fg">Thank you, we have your note.</div>
          <p className="mt-1 text-sm text-fg-muted">
            We&apos;ll be in touch about {residenceName} within two working days.
          </p>
        </div>
      ) : (
        <form action={action} className="mt-5 space-y-3">
          <input type="hidden" name="residenceSlug" value={residenceSlug} />
          <input name="name" className="input" placeholder="Your name" required />
          <input name="email" className="input" type="email" placeholder="your@email.com" required />
          <input name="phone" className="input" placeholder="Phone (optional)" />
          <textarea
            name="note"
            className="input min-h-[100px]"
            placeholder={`I'd like to know more about ${residenceName}…`}
            rows={3}
          />

          {state?.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </div>
          )}

          <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-50">
            {pending ? "Sending…" : "Request a viewing"}
          </button>
        </form>
      )}

      <div className="mt-5 flex items-center gap-3 border-t border-border pt-5 text-sm text-fg-muted">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-brand" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 5h18M3 12h18M3 19h18" />
        </svg>
        Average response in 2 working days
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {agent && (
          <>
            <a href={`tel:${agent.phone.replace(/\s/g, "")}`} className="btn btn-secondary text-sm">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Call
            </a>
            <a href={`mailto:${agent.email}`} className="btn btn-secondary text-sm">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 4h16v16H4z M4 4l8 7 8-7" />
              </svg>
              Email
            </a>
          </>
        )}
      </div>
    </div>
  );
}
