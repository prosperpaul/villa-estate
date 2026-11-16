"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import AdminShell from "@/components/AdminShell";
import AdminToolbar from "@/components/admin/AdminToolbar";
import StatusBadge from "@/components/admin/StatusBadge";
import type { Residence } from "@/lib/residences";
import type { Agent } from "@/lib/agents";
import { formatArea, formatPrice } from "@/lib/format";

export default function AdminResidencesClient({
  residences,
  agents,
}: {
  residences: Residence[];
  agents: Agent[];
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Available" | "Reserved" | "In Confidence" | "Sold">("All");
  const [sort, setSort] = useState<"newest" | "price-desc" | "price-asc">("newest");
  const [selected, setSelected] = useState<string[]>([]);

  const results = useMemo(() => {
    let r = residences.filter((x) => {
      // "Pending" = unpublished landlord drafts awaiting review
      if (statusFilter === "Pending") { if (x.published !== false) return false; }
      else if (statusFilter !== "All" && x.status !== statusFilter) return false;
      if (query && !`${x.name} ${x.location.town} ${x.architect.name}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [query, statusFilter, sort, residences]);

  const pendingCount = residences.filter((r) => r.published === false).length;

  const toggle = (slug: string) =>
    setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));
  const allSelected = results.length > 0 && results.every((r) => selected.includes(r.slug));
  const toggleAll = () =>
    setSelected(allSelected ? selected.filter((s) => !results.find((r) => r.slug === s)) : Array.from(new Set([...selected, ...results.map((r) => r.slug)])));

  return (
    <AdminShell breadcrumb="Residences">
      <AdminToolbar title="Residences" description={`${residences.length} total · ${residences.filter((r) => r.status === "Available").length} available`}>
        <Link href="/admin/residences/new" className="btn btn-primary">+ New residence</Link>
      </AdminToolbar>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface p-3">
        <label className="relative flex-1 min-w-[240px]">
          <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, town, architect…"
            className="w-full rounded-lg border border-border bg-bg py-2 pl-9 pr-3 text-sm placeholder:text-fg-subtle focus:border-brand focus:outline-none"
          />
        </label>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-bg p-1 text-sm">
          {(["All", "Pending", "Available", "Reserved", "In Confidence", "Sold"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-md px-3 py-1 transition ${
                statusFilter === s ? "bg-fg text-bg" : "text-fg-muted hover:text-fg"
              }`}
            >
              {s}
              {s === "Pending" && pendingCount > 0 && <span className="ml-1 rounded-full bg-amber-500 px-1.5 text-[10px] text-white">{pendingCount}</span>}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg focus:border-brand focus:outline-none"
        >
          <option value="newest">Newest first</option>
          <option value="price-desc">Price: high → low</option>
          <option value="price-asc">Price: low → high</option>
        </select>
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-brand bg-brand-soft px-4 py-3 text-sm">
          <span className="font-medium text-brand">{selected.length} selected</span>
          <button className="text-brand hover:underline">Bulk edit</button>
          <button className="text-brand hover:underline">Archive</button>
          <button className="text-brand hover:underline">Export CSV</button>
          <button onClick={() => setSelected([])} className="ml-auto text-fg-muted hover:text-fg">
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[1000px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2 text-left text-xs uppercase tracking-wider text-fg-subtle">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="accent-fg" />
              </th>
              <th className="px-4 py-3">Residence</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Architect</th>
              <th className="px-4 py-3 text-right">Beds / Ba</th>
              <th className="px-4 py-3 text-right">Area</th>
              <th className="px-4 py-3 text-right">Guide</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Agent</th>
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {results.map((r) => {
              const agent = agents.find((a) => a.slug === r.agentSlug);
              return (
                <tr key={r.slug} className={`hover:bg-surface-2 ${selected.includes(r.slug) ? "bg-brand-soft/30" : ""}`}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(r.slug)}
                      onChange={() => toggle(r.slug)}
                      className="accent-fg"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-surface-2">
                        {r.cover && (
                          <Image src={r.cover} alt="" fill sizes="40px" className="object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/admin/residences/${r.slug}/edit`} className="block truncate font-medium text-fg hover:text-brand">
                          {r.name}
                        </Link>
                        <div className="truncate text-xs text-fg-muted">{r.issueNumber} · {r.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-fg-muted">{r.location.town}, {r.location.country}</td>
                  <td className="px-4 py-3 text-fg-muted">{r.architect.name}</td>
                  <td className="px-4 py-3 text-right tnum">{r.beds} · {r.baths}</td>
                  <td className="px-4 py-3 text-right tnum">{formatArea(r.interiorArea)}</td>
                  <td className="px-4 py-3 text-right font-medium tnum">{formatPrice(r.price, r.currency)}{r.listing === "rent" ? " / yr" : ""}</td>
                  <td className="px-4 py-3">
                    {r.published === false ? (
                      <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">Pending review</span>
                    ) : (
                      <StatusBadge status={r.status} />
                    )}
                  </td>
                  <td className="px-4 py-3 text-fg-muted">{agent?.name.split(" ")[0]}</td>
                  <td className="px-4 py-3 text-right">
                    <RowMenu slug={r.slug} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {results.length === 0 && (
          <div className="p-12 text-center">
            <div className="font-display text-2xl">No residences match.</div>
            <p className="mt-2 text-sm text-fg-muted">Adjust the search or status filters.</p>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border bg-surface-2 px-4 py-3 text-xs text-fg-muted">
          <span>Showing {results.length} of {residences.length}</span>
          <div className="flex items-center gap-2">
            <button className="rounded-md border border-border bg-surface px-2 py-1 hover:bg-bg">← Prev</button>
            <span>Page 1</span>
            <button className="rounded-md border border-border bg-surface px-2 py-1 hover:bg-bg">Next →</button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function RowMenu({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-fg-muted hover:bg-surface-2 hover:text-fg"
        aria-label="Row actions"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-40 mt-1 w-44 overflow-hidden rounded-lg border border-border bg-surface text-sm shadow-soft-lg">
            <Link href={`/residences/${slug}`} className="block px-3 py-2 text-fg-muted hover:bg-surface-2 hover:text-fg">View on site</Link>
            <Link href={`/admin/residences/${slug}/edit`} className="block px-3 py-2 text-fg-muted hover:bg-surface-2 hover:text-fg">Edit</Link>
            <button className="block w-full text-left px-3 py-2 text-fg-muted hover:bg-surface-2 hover:text-fg">Duplicate</button>
            <button className="block w-full text-left px-3 py-2 text-fg-muted hover:bg-surface-2 hover:text-fg">Mark as Sold</button>
            <button className="block w-full text-left border-t border-border px-3 py-2 text-red-600 hover:bg-red-50">Archive</button>
          </div>
        </>
      )}
    </div>
  );
}
