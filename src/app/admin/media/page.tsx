"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import AdminShell from "@/components/AdminShell";
import AdminToolbar from "@/components/admin/AdminToolbar";

const allImages = [
  "/istockphoto-1.jpg",
  "/istockphoto-2.jpg",
  "/istockphoto-3.jpg",
  "/istockphoto-4.jpg",
  "/istockphoto-5.jpg",
  "/istockphoto-6.jpg",
  "/istockphoto-7.jpg",
  "/istockphoto-8.jpg",
  "/istockphoto-9.webp",
  "/photo-10.avif",
  "/premium_photo-11.avif",
  "/premium_photo-12.avif",
  "/photo-13.avif",
  "/premium_photo-14.avif",
  "/photo-15.avif",
  "/premium_photo-16.avif",
  "/photo-17.avif",
  "/photo-18.avif",
  "/photo-19.avif",
];

export default function MediaLibraryPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");

  const results = useMemo(
    () => allImages.filter((src) => src.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const toggle = (src: string) =>
    setSelected((s) => (s.includes(src) ? s.filter((x) => x !== src) : [...s, src]));

  return (
    <AdminShell breadcrumb="Media library">
      <AdminToolbar title="Media library" description={`${allImages.length} assets · 18 MB`}>
        <button className="btn btn-secondary">Create folder</button>
        <button className="btn btn-primary">↑ Upload</button>
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
            placeholder="Search by filename…"
            className="w-full rounded-lg border border-border bg-bg py-2 pl-9 pr-3 text-sm placeholder:text-fg-subtle focus:border-brand focus:outline-none"
          />
        </label>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-bg p-1">
          <button
            onClick={() => setView("grid")}
            className={`rounded-md p-1.5 transition ${view === "grid" ? "bg-fg text-bg" : "text-fg-muted hover:text-fg"}`}
            aria-label="Grid view"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
            </svg>
          </button>
          <button
            onClick={() => setView("list")}
            className={`rounded-md p-1.5 transition ${view === "list" ? "bg-fg text-bg" : "text-fg-muted hover:text-fg"}`}
            aria-label="List view"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-brand bg-brand-soft px-4 py-3 text-sm">
          <span className="font-medium text-brand">{selected.length} selected</span>
          <button className="text-brand hover:underline">Move to folder</button>
          <button className="text-brand hover:underline">Download</button>
          <button className="text-brand hover:underline">Delete</button>
          <button onClick={() => setSelected([])} className="ml-auto text-fg-muted hover:text-fg">Clear</button>
        </div>
      )}

      {view === "grid" ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          {/* Upload tile */}
          <button className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-border bg-surface text-fg-muted hover:border-fg hover:text-fg">
            <div className="text-center">
              <div className="text-3xl">+</div>
              <div className="mt-1 text-xs">Upload</div>
            </div>
          </button>

          {results.map((src) => {
            const isSelected = selected.includes(src);
            const name = src.split("/").pop()!;
            return (
              <button
                key={src}
                onClick={() => toggle(src)}
                className={`group relative aspect-square overflow-hidden rounded-xl border-2 transition ${
                  isSelected ? "border-brand" : "border-transparent hover:border-border"
                }`}
              >
                <Image src={src} alt={name} fill sizes="(min-width:1024px) 16vw, 50vw" className="object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-left">
                  <div className="truncate text-[10px] text-white">{name}</div>
                </div>
                <div className={`absolute right-2 top-2 h-5 w-5 rounded-md border-2 transition ${
                  isSelected ? "border-brand bg-brand" : "border-white/70 bg-white/15 opacity-0 group-hover:opacity-100"
                }`}>
                  {isSelected && (
                    <svg viewBox="0 0 24 24" className="h-full w-full text-white" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          {results.map((src) => {
            const name = src.split("/").pop()!;
            return (
              <div key={src} className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-0 hover:bg-surface-2">
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-surface-2">
                  <Image src={src} alt="" fill sizes="40px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium text-fg">{name}</div>
                  <div className="text-xs text-fg-muted">{src}</div>
                </div>
                <div className="text-xs text-fg-muted">~1.2 MB</div>
                <button className="text-xs text-fg-muted hover:text-fg">Copy URL</button>
                <button className="text-xs text-fg-muted hover:text-red-600">Delete</button>
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
