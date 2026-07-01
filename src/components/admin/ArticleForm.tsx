"use client";

import Link from "next/link";
import { useState } from "react";
import type { Article } from "@/lib/articles";

const departments: Article["department"][] = [
  "Field Notes",
  "Architects in Conversation",
  "The Coast Issue",
  "Marginalia",
];

export default function ArticleForm({ mode, initial }: { mode: "new" | "edit"; initial?: Partial<Article> }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [department, setDepartment] = useState<Article["department"]>(initial?.department ?? "Field Notes");
  const [dek, setDek] = useState(initial?.dek ?? "");
  const [author, setAuthor] = useState(initial?.author ?? "");
  const [date, setDate] = useState(initial?.date ?? "Spring 2026");
  const [reading, setReading] = useState<number | "">(initial?.readingMinutes ?? 8);
  const [cover, setCover] = useState(initial?.cover ?? "");
  const [body, setBody] = useState(initial?.body?.join("\n\n") ?? "");
  const [pullquote, setPullquote] = useState(initial?.pullquote ?? "");
  const [saved, setSaved] = useState(false);

  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  const estReading = Math.max(1, Math.round(wordCount / 220));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }}
      className="grid grid-cols-1 gap-6 lg:grid-cols-3"
    >
      <div className="space-y-6 lg:col-span-2">
        <section className="rounded-2xl border border-border bg-surface p-5 md:p-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title"
            className="w-full bg-transparent font-display text-4xl tracking-tight focus:outline-none"
          />
          <input
            value={dek}
            onChange={(e) => setDek(e.target.value)}
            placeholder="A short deck — what this article is about, in one line."
            className="mt-3 w-full bg-transparent text-lg italic text-fg-muted focus:outline-none"
          />
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 md:p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg">Body</h2>
            <span className="text-xs text-fg-muted tnum">
              {wordCount} words · est. {estReading} min read
            </span>
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write the article. Use a blank line to start a new paragraph."
            className="w-full bg-bg min-h-[480px] rounded-lg border border-border p-4 text-[15px] leading-relaxed text-fg focus:border-brand focus:outline-none"
          />
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 md:p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg">Pullquote</h2>
            <span className="text-xs text-fg-muted">Optional — appears mid-article.</span>
          </div>
          <textarea
            value={pullquote}
            onChange={(e) => setPullquote(e.target.value)}
            placeholder="A single sentence from the article, lifted out for emphasis."
            className="w-full bg-bg min-h-[80px] rounded-lg border border-border p-4 text-base italic focus:border-brand focus:outline-none"
          />
        </section>
      </div>

      <aside className="space-y-6 lg:col-span-1">
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-3 font-display text-lg">Publishing</h2>
          <div className="space-y-3 text-sm">
            <Field label="Status">
              <select className="form-input"><option>Published</option><option>Draft</option><option>Scheduled</option></select>
            </Field>
            <Field label="Visibility">
              <select className="form-input"><option>Public</option><option>Members only</option><option>Internal</option></select>
            </Field>
          </div>
          <button type="submit" className="btn btn-primary mt-5 w-full">
            {mode === "edit" ? "Save changes" : "Publish article"}
          </button>
          <Link href="/admin/journal" className="btn btn-secondary mt-2 w-full">Cancel</Link>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-3 font-display text-lg">Cover image</h2>
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-dashed border-border bg-surface-2">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-fg-subtle">No cover yet</div>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              const url = window.prompt("Paste image URL (or /public path)");
              if (url) setCover(url);
            }}
            className="btn btn-secondary mt-3 w-full text-sm"
          >
            {cover ? "Replace cover" : "Choose cover"}
          </button>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-3 font-display text-lg">Meta</h2>
          <div className="space-y-3 text-sm">
            <Field label="Department">
              <select className="form-input" value={department} onChange={(e) => setDepartment(e.target.value as Article["department"])}>
                {departments.map((d) => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Author"><input className="form-input" value={author} onChange={(e) => setAuthor(e.target.value)} /></Field>
            <Field label="Issue"><input className="form-input" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
            <Field label="Reading minutes">
              <input type="number" className="form-input" value={reading} onChange={(e) => setReading(e.target.value === "" ? "" : Number(e.target.value))} />
            </Field>
          </div>
        </section>
      </aside>

      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm shadow-soft-lg">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-soft text-brand">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l5 5L20 7" /></svg>
          </span>
          <span>{mode === "edit" ? "Article updated" : "Article published"}</span>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-fg-subtle">{label}</div>
      {children}
    </label>
  );
}
