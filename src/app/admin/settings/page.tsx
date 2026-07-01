"use client";

import { useState } from "react";
import AdminShell from "@/components/AdminShell";
import AdminToolbar from "@/components/admin/AdminToolbar";

const tabs = ["General", "Branding", "Domains", "Notifications", "Billing", "API & integrations"] as const;

export default function SettingsPage() {
  const [tab, setTab] = useState<typeof tabs[number]>("General");

  return (
    <AdminShell breadcrumb="Settings">
      <AdminToolbar title="Settings" description="Studio-wide preferences and integrations." />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[200px_1fr]">
        <nav className="rounded-2xl border border-border bg-surface p-2">
          <ul className="space-y-1 text-sm">
            {tabs.map((t) => (
              <li key={t}>
                <button
                  onClick={() => setTab(t)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition ${
                    tab === t ? "bg-brand-soft text-brand" : "text-fg-muted hover:bg-surface-2 hover:text-fg"
                  }`}
                >
                  {t}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-6">
          {tab === "General" && (
            <>
              <Card title="Studio profile" description="Shown in the footer and meta tags.">
                <Row label="Studio name"><input className="form-input" defaultValue="Vila Estate" /></Row>
                <Row label="Tagline"><input className="form-input" defaultValue="A Quarterly Record of Architect-Designed Residences" /></Row>
                <Row label="Founded"><input className="form-input" defaultValue="2013" /></Row>
              </Card>

              <Card title="Locale" description="Default formatting and timezone for the studio.">
                <Row label="Language">
                  <select className="form-input"><option>English (UK)</option><option>Français</option><option>Italiano</option></select>
                </Row>
                <Row label="Currency">
                  <select className="form-input"><option>EUR (€)</option><option>USD ($)</option><option>GBP (£)</option></select>
                </Row>
                <Row label="Timezone">
                  <select className="form-input"><option>Europe/Paris</option><option>Europe/London</option><option>Europe/Rome</option></select>
                </Row>
              </Card>
            </>
          )}

          {tab === "Branding" && (
            <Card title="Brand identity" description="How the public site is dressed.">
              <Row label="Accent colour">
                <div className="flex items-center gap-3">
                  <span className="inline-block h-8 w-8 rounded-md border border-border" style={{ background: "var(--brand)" }} />
                  <input className="form-input flex-1" defaultValue="#3F5D52" />
                </div>
              </Row>
              <Row label="Display typeface"><input className="form-input" defaultValue="Fraunces" /></Row>
              <Row label="Body typeface"><input className="form-input" defaultValue="Inter" /></Row>
            </Card>
          )}

          {tab === "Domains" && (
            <Card title="Domains" description="Where the public site is served.">
              <div className="space-y-2 text-sm">
                <Domain host="vilaestate.co" primary />
                <Domain host="www.vilaestate.co" />
                <Domain host="vila-estate.vercel.app" preview />
                <button className="btn btn-secondary mt-3 w-full text-sm">+ Add domain</button>
              </div>
            </Card>
          )}

          {tab === "Notifications" && (
            <Card title="Notifications" description="When the studio should hear from itself.">
              <Toggle label="Email me when a slip is received" defaultChecked />
              <Toggle label="Daily digest of inbox activity" defaultChecked />
              <Toggle label="Weekly portfolio summary" />
              <Toggle label="Slack: ping the #studio channel on new viewings" defaultChecked />
            </Card>
          )}

          {tab === "Billing" && (
            <Card title="Plan & billing" description="Your studio plan and invoices.">
              <div className="rounded-xl border border-brand-soft bg-brand-soft/40 p-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-brand">Current plan</div>
                    <div className="mt-1 font-display text-2xl">Studio · €240 / mo</div>
                  </div>
                  <button className="btn btn-secondary text-sm">Change plan</button>
                </div>
                <div className="mt-3 text-sm text-fg-muted">Next charge — 1 June 2026 · Visa •••• 4242</div>
              </div>
              <Row label="Billing email"><input className="form-input" defaultValue="accounts@vilaestate.co" /></Row>
              <Row label="VAT / Tax ID"><input className="form-input" defaultValue="FR12 345 678 901" /></Row>
            </Card>
          )}

          {tab === "API & integrations" && (
            <Card title="API & integrations" description="Wire Vila Estate into your existing tools.">
              <Integration name="Firebase" status="Not connected" />
              <Integration name="Mailchimp" status="Connected" />
              <Integration name="Slack" status="Connected" />
              <Integration name="Google Calendar" status="Not connected" />
              <Integration name="Stripe" status="Connected" />
            </Card>
          )}

          <div className="flex justify-end gap-2">
            <button className="btn btn-secondary">Cancel</button>
            <button className="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>

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
        }
        .form-input:focus {
          outline: none;
          border-color: var(--brand);
          box-shadow: 0 0 0 3px var(--brand-soft);
        }
      `}</style>
    </AdminShell>
  );
}

function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <div className="mb-4">
        <h2 className="font-display text-lg">{title}</h2>
        {description && <p className="text-sm text-fg-muted">{description}</p>}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid items-center gap-3 sm:grid-cols-[200px_1fr]">
      <div className="text-sm text-fg">{label}</div>
      <div>{children}</div>
    </div>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 border-b border-border py-3 last:border-0">
      <span className="text-sm text-fg">{label}</span>
      <input type="checkbox" defaultChecked={defaultChecked} className="h-5 w-5 accent-brand" />
    </label>
  );
}

function Domain({ host, primary, preview }: { host: string; primary?: boolean; preview?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-bg px-4 py-3">
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-brand" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
        </svg>
        <span className="font-mono text-sm">{host}</span>
        {primary && <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] uppercase tracking-wider text-brand">Primary</span>}
        {preview && <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] uppercase tracking-wider text-fg-muted">Preview</span>}
      </div>
      <button className="text-xs text-fg-muted hover:text-fg">Manage</button>
    </div>
  );
}

function Integration({ name, status }: { name: string; status: string }) {
  const connected = status === "Connected";
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <div>
        <div className="text-sm font-medium text-fg">{name}</div>
        <div className={`text-xs ${connected ? "text-brand" : "text-fg-muted"}`}>{status}</div>
      </div>
      <button className="btn btn-secondary text-xs">{connected ? "Configure" : "Connect"}</button>
    </div>
  );
}
