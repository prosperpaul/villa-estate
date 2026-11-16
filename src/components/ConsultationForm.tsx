"use client";

import { useActionState, useState } from "react";
import { submitInquiryAction } from "@/lib/inquiries";
import Icon from "./Icon";

const CODES = [
  { code: "+234", label: "🇳🇬 +234" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+971", label: "🇦🇪 +971" },
];
const SCOPES = ["Property acquisition", "Title due diligence & conveyance", "Diaspora inspection on my behalf", "Governor's consent & regularisation"];
const WINDOWS = ["Morning (10am to 12pm)", "Afternoon (1pm to 3pm)", "Evening (4pm to 6pm WAT)"];

// Book a consultation with one agent. Saves to the admin inbox via the
// existing inquiry action; the extra details are folded into the note.
export default function ConsultationForm({ agentName }: { agentName: string }) {
  const [state, action, pending] = useActionState(submitInquiryAction, null);
  const [code, setCode] = useState(CODES[0].code);
  const [phone, setPhone] = useState("");
  const [scope, setScope] = useState(SCOPES[0]);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState(WINDOWS[0]);
  const [message, setMessage] = useState("");
  const first = agentName.split(" ")[0];

  // e.g. "[Consultation with Léa Marchand: Property acquisition, 2026-11-20, Morning (10am to 12pm)] message"
  const note = `[Consultation with ${agentName}: ${scope}${date ? `, ${date}` : ""}, ${slot}] ${message}`.trim();

  return (
    <section className="rounded-lg border border-border bg-surface p-5">
      <span className="mb-4 block h-0.5 w-10 bg-brand" aria-hidden />
      <h2 className="headline-sm">Request a private consultation</h2>
      <p className="pt-1 text-[13px] leading-5 text-fg-muted">
        Arrange a confidential consultation or site inspection with {agentName}.
      </p>

      {state?.ok ? (
        <div role="status" className="mt-5 rounded border border-verified/30 bg-verified-soft p-4 text-center">
          <Icon name="check" className="mx-auto h-6 w-6 text-verified" strokeWidth={2} />
          <p className="headline-sm pt-2">Request received.</p>
          <p className="pt-1 text-[13px] leading-5 text-fg-muted">{first} will get back to you shortly.</p>
        </div>
      ) : (
        <form action={action} className="mt-5 space-y-4">
          <input type="hidden" name="note" value={note} />
          {/* Phone is stored with its country code */}
          <input type="hidden" name="phone" value={phone ? `${code} ${phone}` : ""} />

          <Field label="Full name">
            <input name="name" className="input" autoComplete="name" placeholder="e.g. Chief Babatunde Adeleke" required />
          </Field>
          <Field label="Email">
            <input name="email" type="email" className="input" autoComplete="email" required />
          </Field>
          <Field label="Phone & WhatsApp">
            <div className="flex gap-2">
              <select aria-label="Country code" value={code} onChange={(e) => setCode(e.target.value)} className="input !w-auto">
                {CODES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
              <input aria-label="Phone number" type="tel" className="input" autoComplete="tel-national"
                placeholder="802 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </Field>
          <Field label="What is it about?">
            <select className="input" value={scope} onChange={(e) => setScope(e.target.value)}>
              {SCOPES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Time window">
              <select className="input" value={slot} onChange={(e) => setSlot(e.target.value)}>
                {WINDOWS.map((w) => <option key={w}>{w}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Notes or title reference (optional)">
            <textarea className="input min-h-[72px]" rows={2} value={message} onChange={(e) => setMessage(e.target.value)}
              placeholder="Off-market interests, survey plan numbers…" />
          </Field>

          {state?.error && (
            <p role="alert" className="rounded border border-error/30 bg-error/5 px-3 py-2 text-[13px] text-error">{state.error}</p>
          )}

          <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-50">
            <Icon name="calendar" className="h-4 w-4" />
            {pending ? "Sending…" : "Confirm consultation request"}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-fg-subtle">
            <Icon name="shield" className="h-3.5 w-3.5" />
            Haven escrow and legal protections apply.
          </p>
        </form>
      )}
    </section>
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
