"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AdminShell from "@/components/AdminShell";
import AdminToolbar from "@/components/admin/AdminToolbar";
import StatusBadge from "@/components/admin/StatusBadge";
import { articles } from "@/lib/articles";

export default function AdminJournalPage() {
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState<"All" | "Field Notes" | "Architects in Conversation" | "The Coast Issue" | "Marginalia">("All");
  const filtered = articles.filter((a) => {
    if (dept !== "All" && a.department !== dept) return false;
    if (query && !`${a.title} ${a.author}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminShell breadcrumb="Journal">
      <AdminToolbar title="Journal" description={`${articles.length} published articles · Spring 2026 issue`}>
        <Link href="/admin/journal/new" className="btn btn-primary">+ New article</Link>
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
            placeholder="Search by title or author…"
            className="w-full rounded-lg border border-border bg-bg py-2 pl-9 pr-3 text-sm placeholder:text-fg-subtle focus:border-brand focus:outline-none"
          />
        </label>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-bg p-1 text-sm">
          {(["All", "Field Notes", "Architects in Conversation", "The Coast Issue", "Marginalia"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className={`rounded-md px-3 py-1 transition ${dept === d ? "bg-fg text-bg" : "text-fg-muted hover:text-fg"}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[800px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2 text-left text-xs uppercase tracking-wider text-fg-subtle">
              <th className="px-4 py-3">Article</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Issue</th>
              <th className="px-4 py-3 text-right">Read time</th>
              <th className="px-4 py-3">Status</th>
              <th className="w-20 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((a) => (
              <tr key={a.slug} className="hover:bg-surface-2">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-14 flex-shrink-0 overflow-hidden rounded-md bg-surface-2">
                      <Image src={a.cover} alt="" fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <Link href={`/admin/journal/${a.slug}/edit`} className="block truncate font-medium text-fg hover:text-brand">
                        {a.title}
                      </Link>
                      <div className="truncate text-xs text-fg-muted">{a.dek}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-fg-muted">{a.department}</td>
                <td className="px-4 py-3 text-fg-muted">{a.author}</td>
                <td className="px-4 py-3 text-fg-muted">{a.date}</td>
                <td className="px-4 py-3 text-right tnum text-fg-muted">{a.readingMinutes} min</td>
                <td className="px-4 py-3"><StatusBadge status="Published" /></td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/journal/${a.slug}`} className="text-fg-muted hover:text-brand">View</Link>
                  <span className="mx-1 text-fg-subtle">·</span>
                  <Link href={`/admin/journal/${a.slug}/edit`} className="text-fg-muted hover:text-brand">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-fg-muted">No articles match.</div>
        )}
      </div>
    </AdminShell>
  );
}
