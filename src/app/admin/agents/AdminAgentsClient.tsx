"use client";

import Link from "next/link";
import { useState } from "react";
import AdminShell from "@/components/AdminShell";
import AdminToolbar from "@/components/admin/AdminToolbar";
import type { Agent } from "@/lib/agents";
import type { Residence } from "@/lib/residences";

export default function AdminAgentsClient({
  agents,
  residences,
}: {
  agents: Agent[];
  residences: Residence[];
}) {
  const [query, setQuery] = useState("");
  const filtered = agents.filter((a) =>
    `${a.name} ${a.basedIn} ${a.role}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AdminShell breadcrumb="Agents">
      <AdminToolbar title="Agents" description={`${agents.length} team members across four offices`}>
        <Link href="/admin/agents/new" className="btn btn-primary">+ Add agent</Link>
      </AdminToolbar>

      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface p-3">
        <label className="relative flex-1 min-w-[240px]">
          <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agents by name, office, role…"
            className="w-full rounded-lg border border-border bg-bg py-2 pl-9 pr-3 text-sm placeholder:text-fg-subtle focus:border-brand focus:outline-none"
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[800px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2 text-left text-xs uppercase tracking-wider text-fg-subtle">
              <th className="px-4 py-3">Agent</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Based</th>
              <th className="px-4 py-3">Languages</th>
              <th className="px-4 py-3 text-right">Listings</th>
              <th className="px-4 py-3 text-right">Since</th>
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((a) => {
              const count = residences.filter((r) => r.agentSlug === a.slug).length;
              return (
                <tr key={a.slug} className="hover:bg-surface-2">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-sm font-medium text-brand">
                        {a.initials}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/admin/agents/${a.slug}/edit`} className="block truncate font-medium text-fg hover:text-brand">
                          {a.name}
                        </Link>
                        <div className="truncate text-xs text-fg-muted">{a.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-fg-muted">{a.role}</td>
                  <td className="px-4 py-3 text-fg-muted">{a.basedIn}</td>
                  <td className="px-4 py-3 text-fg-muted">{a.languages.join(", ")}</td>
                  <td className="px-4 py-3 text-right tnum">{count}</td>
                  <td className="px-4 py-3 text-right text-fg-muted">{a.joined}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/agents/${a.slug}/edit`} className="text-fg-muted hover:text-brand">
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-fg-muted">No agents match.</div>
        )}
      </div>
    </AdminShell>
  );
}
