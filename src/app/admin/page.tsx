import Image from "next/image";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import { listAllResidences } from "@/lib/residences";
import { agents } from "@/lib/agents";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Admin — Vila Estate" };

export default async function AdminPage() {
  const residences = await listAllResidences();
  const total = residences.reduce((s, r) => s + r.price, 0);
  const available = residences.filter((r) => r.status === "Available").length;
  const reserved = residences.filter((r) => r.status === "Reserved").length;

  return (
    <AdminShell breadcrumb="Overview">
      {/* Hello strip */}
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Good afternoon, Léa.</h1>
          <p className="mt-1 text-sm text-fg-muted">
            Four new slips overnight. Two residences need attention.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-fg-muted">
          <span className="inline-block h-2 w-2 rounded-full bg-brand" />
          All systems live — last sync 14:22 CET
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Active residences" value={String(residences.length)} delta="+1 this issue" tone="up" />
        <Kpi label="Portfolio value" value={formatPrice(total, "EUR")} delta="+ €2.4m vs Q4" tone="up" />
        <Kpi label="Available" value={`${available} / ${residences.length}`} delta={`${reserved} reserved`} tone="flat" />
        <Kpi label="Inbox · Open" value="4" delta="2 awaiting reply" tone="warn" />
      </div>

      {/* Two-column main area */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent residences table */}
        <section className="rounded-2xl border border-border bg-surface lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="font-display text-lg">Recent residences</h2>
              <p className="text-sm text-fg-muted">Last edited and current status</p>
            </div>
            <Link href="/residences" className="text-sm text-brand hover:underline">
              View all →
            </Link>
          </div>

          <div className="divide-y divide-border">
            {residences.slice(0, 6).map((r) => {
              const agent = agents.find((a) => a.slug === r.agentSlug);
              return (
                <div key={r.slug} className="grid grid-cols-12 items-center gap-4 px-5 py-4">
                  <div className="col-span-12 flex items-center gap-3 md:col-span-5">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-surface-2">
                      {r.cover && (
                        <Image src={r.cover} alt="" fill sizes="48px" className="object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link href={`/residences/${r.slug}`} className="block truncate font-medium text-fg hover:text-brand">
                        {r.name}
                      </Link>
                      <div className="truncate text-xs text-fg-muted">
                        {r.location.town}, {r.location.country}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-4 hidden text-sm md:col-span-2 md:block">
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="col-span-4 hidden text-sm text-fg-muted md:col-span-2 md:block">
                    {agent?.name.split(" ")[0]}
                  </div>
                  <div className="col-span-6 text-sm font-medium text-fg tnum md:col-span-2 md:text-right">
                    {formatPrice(r.price, r.currency)}
                  </div>
                  <div className="col-span-6 text-right md:col-span-1">
                    <button className="text-fg-muted hover:text-fg">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Inbox */}
        <section className="rounded-2xl border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-display text-lg">Inbox</h2>
            <Link href="#" className="text-sm text-brand hover:underline">All →</Link>
          </div>
          <ul className="divide-y divide-border">
            {[
              { from: "C. Vandenberg", subject: "Re: Villa Aurelia — second viewing", time: "08:14", unread: true },
              { from: "Henrik A.", subject: "Re: Pavillon Noir — floor plans", time: "Yesterday", unread: true },
              { from: "Anaïs L.", subject: "Casa del Vento — second view", time: "Yesterday", unread: false },
              { from: "Mme A. Roussel", subject: "Côte d'Azur enquiry < €15m", time: "Mon", unread: false },
              { from: "B. Hofmann", subject: "Dar el Bahia — dates confirmed", time: "Mon", unread: false },
            ].map((m, i) => (
              <li key={i} className="flex cursor-pointer items-start gap-3 p-4 hover:bg-surface-2">
                <span className={`mt-2 h-2 w-2 flex-shrink-0 rounded-full ${m.unread ? "bg-brand" : "bg-transparent"}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className={`truncate text-sm ${m.unread ? "font-medium text-fg" : "text-fg-muted"}`}>
                      {m.from}
                    </span>
                    <span className="text-xs text-fg-subtle">{m.time}</span>
                  </div>
                  <p className="truncate text-sm text-fg-muted">{m.subject}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Two-column secondary area */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Top agents */}
        <section className="rounded-2xl border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-display text-lg">Top agents</h2>
            <Link href="/agents" className="text-sm text-brand hover:underline">View →</Link>
          </div>
          <ul className="divide-y divide-border">
            {agents.slice(0, 4).map((a) => {
              const count = residences.filter((r) => r.agentSlug === a.slug).length;
              return (
                <li key={a.slug} className="flex items-center gap-3 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-sm font-medium text-brand">
                    {a.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{a.name}</div>
                    <div className="truncate text-xs text-fg-muted">{a.basedIn}</div>
                  </div>
                  <div className="text-sm tnum text-fg">{count}</div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Activity */}
        <section className="rounded-2xl border border-border bg-surface lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-display text-lg">Recent activity</h2>
            <span className="text-sm text-fg-muted">last 24 hours</span>
          </div>
          <ol className="divide-y divide-border">
            {[
              { who: "L.M.", what: "Updated guide for Villa Aurelia to €24.5m.", time: "14:18" },
              { who: "E.M.", what: "Logged viewing for Villa Serenella, Bellagio.", time: "12:02" },
              { who: "—", what: "Slip received from C. Vandenberg.", time: "10:41" },
              { who: "T.F.", what: "Added gallery plate to Casa del Vento.", time: "09:08" },
              { who: "S.W.", what: "Drafted journal piece — Field Notes No. 11.", time: "Yesterday" },
            ].map((row, i) => (
              <li key={i} className="flex items-start gap-4 p-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-soft text-[10px] font-medium text-brand">
                  {row.who}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-fg">{row.what}</p>
                  <p className="mt-0.5 text-xs text-fg-subtle">{row.time}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </AdminShell>
  );
}

function Kpi({ label, value, delta, tone }: { label: string; value: string; delta: string; tone: "up" | "warn" | "flat" }) {
  const toneCls =
    tone === "up" ? "text-brand" : tone === "warn" ? "text-amber-600" : "text-fg-muted";
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="text-xs uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="mt-2 font-display text-3xl text-fg tnum">{value}</div>
      <div className={`mt-2 text-xs ${toneCls}`}>{delta}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "Available"
      ? "bg-brand-soft text-brand"
      : status === "Reserved"
        ? "bg-amber-100 text-amber-800"
        : status === "Sold"
          ? "bg-surface-2 text-fg-muted line-through"
          : "bg-surface-2 text-fg-muted";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}
