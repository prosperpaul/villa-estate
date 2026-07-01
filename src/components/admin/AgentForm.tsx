"use client";

import Link from "next/link";
import { useState } from "react";
import type { Agent } from "@/lib/agents";

const roles = ["Founding Partner", "Partner", "Partner, Iberia", "Partner, Italy", "Partner, North Africa", "Associate", "Associate, British Isles"];

export default function AgentForm({ mode, initial }: { mode: "new" | "edit"; initial?: Partial<Agent> }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [role, setRole] = useState(initial?.role ?? "Associate");
  const [basedIn, setBasedIn] = useState(initial?.basedIn ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [joined, setJoined] = useState<number | "">(initial?.joined ?? new Date().getFullYear());
  const [languages, setLanguages] = useState(initial?.languages?.join(", ") ?? "");
  const [letter, setLetter] = useState(initial?.letter ?? "");
  const [bio, setBio] = useState(initial?.bio?.join("\n\n") ?? "");
  const [expertise, setExpertise] = useState(initial?.expertise?.join(", ") ?? "");
  const [initials, setInitials] = useState(initial?.initials ?? "");

  const [saved, setSaved] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Section title="Identity">
          <div className="grid grid-cols-[80px_1fr] gap-4 items-start">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-fg-subtle">Initials</div>
              <input
                value={initials}
                onChange={(e) => setInitials(e.target.value.toUpperCase().slice(0, 3))}
                maxLength={3}
                className="form-input mt-1.5 text-center font-display text-2xl"
              />
            </div>
            <div className="space-y-3">
              <Field label="Full name" required>
                <input value={name} onChange={(e) => setName(e.target.value)} className="form-input" required />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Role">
                  <select value={role} onChange={(e) => setRole(e.target.value)} className="form-input">
                    {roles.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </Field>
                <Field label="Based in">
                  <input value={basedIn} onChange={(e) => setBasedIn(e.target.value)} className="form-input" />
                </Field>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Contact">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="Email"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" /></Field>
            <Field label="Telephone"><input value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input" /></Field>
          </div>
        </Section>

        <Section title="Voice">
          <Field label="Public letter" help="A short quote that appears on the agent's profile.">
            <textarea value={letter} onChange={(e) => setLetter(e.target.value)} className="form-input min-h-[120px]" />
          </Field>
          <Field label="Biography" help="Use blank lines to separate paragraphs.">
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="form-input min-h-[200px]" />
          </Field>
        </Section>

        <Section title="Expertise" description="Areas of focus, comma-separated.">
          <input value={expertise} onChange={(e) => setExpertise(e.target.value)} className="form-input" placeholder="Côte d'Azur, Cap d'Antibes, 20th-century French architects" />
        </Section>
      </div>

      <aside className="space-y-6 lg:col-span-1">
        <Section title="Practice">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Joined">
              <input type="number" value={joined} onChange={(e) => setJoined(e.target.value === "" ? "" : Number(e.target.value))} className="form-input" />
            </Field>
            <Field label="Languages">
              <input value={languages} onChange={(e) => setLanguages(e.target.value)} className="form-input" placeholder="French, English" />
            </Field>
          </div>
        </Section>

        <div className="space-y-2">
          <button type="submit" className="btn btn-primary w-full">
            {mode === "edit" ? "Save changes" : "Add agent"}
          </button>
          <Link href="/admin/agents" className="btn btn-secondary w-full">Cancel</Link>
          {mode === "edit" && (
            <button type="button" className="btn w-full text-sm text-red-600 hover:underline">
              Archive agent
            </button>
          )}
        </div>
      </aside>

      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm shadow-soft-lg">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-soft text-brand">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12l5 5L20 7" />
            </svg>
          </span>
          <span>{mode === "edit" ? "Changes saved" : "Agent added"}</span>
        </div>
      )}

      <style jsx>{`
        .form-input {
          width: 100%;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 10px 12px;
          font: inherit;
          font-size: 14px;
          color: var(--fg);
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--brand);
          box-shadow: 0 0 0 3px var(--brand-soft);
        }
      `}</style>
    </form>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 md:p-6">
      <div className="mb-4">
        <h2 className="font-display text-lg">{title}</h2>
        {description && <p className="text-sm text-fg-muted">{description}</p>}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, required, help, children }: { label: string; required?: boolean; help?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
          {label} {required && <span className="text-brand">*</span>}
        </span>
        {help && <span className="text-xs text-fg-subtle">{help}</span>}
      </div>
      {children}
    </label>
  );
}
