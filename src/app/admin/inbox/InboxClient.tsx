"use client";

import { useState } from "react";
import AdminShell from "@/components/AdminShell";
import AdminToolbar from "@/components/admin/AdminToolbar";

export type Msg = {
  id: string;
  from: string;
  email: string;
  subject: string;
  body: string;
  preview: string;
  date: string;
  state: "Unread" | "Open" | "Replied" | "Archived";
  residence?: string;
  starred?: boolean;
};

const folders = ["Inbox", "Unread", "Starred", "Replied", "Archived"] as const;

export default function InboxClient({ initial }: { initial: Msg[] }) {
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [folder, setFolder] = useState<typeof folders[number]>("Inbox");
  const [activeId, setActiveId] = useState<string | null>(initial[0]?.id ?? null);
  const [reply, setReply] = useState("");

  const visible = msgs.filter((m) => {
    if (folder === "Unread") return m.state === "Unread";
    if (folder === "Starred") return m.starred;
    if (folder === "Replied") return m.state === "Replied";
    if (folder === "Archived") return m.state === "Archived";
    return m.state !== "Archived";
  });
  const active = msgs.find((m) => m.id === activeId);

  const setState = (id: string, state: Msg["state"]) =>
    setMsgs((prev) => prev.map((m) => (m.id === id ? { ...m, state } : m)));

  const toggleStar = (id: string) =>
    setMsgs((prev) => prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)));

  return (
    <AdminShell breadcrumb="Inbox">
      <AdminToolbar
        title="Inbox"
        description={`${msgs.filter((m) => m.state === "Unread").length} unread · ${msgs.length} total`}
      />

      <div className="grid h-[calc(100vh-260px)] min-h-[560px] grid-cols-1 overflow-hidden rounded-2xl border border-border bg-surface md:grid-cols-[200px_360px_1fr]">
        {/* Folders */}
        <nav className="hidden border-r border-border bg-surface-2 p-3 md:block">
          <ul className="space-y-px text-sm">
            {folders.map((f) => {
              const count =
                f === "Inbox"
                  ? msgs.filter((m) => m.state !== "Archived").length
                  : f === "Unread"
                    ? msgs.filter((m) => m.state === "Unread").length
                    : f === "Starred"
                      ? msgs.filter((m) => m.starred).length
                      : f === "Replied"
                        ? msgs.filter((m) => m.state === "Replied").length
                        : msgs.filter((m) => m.state === "Archived").length;
              return (
                <li key={f}>
                  <button
                    onClick={() => setFolder(f)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 transition ${
                      folder === f ? "bg-surface text-fg shadow-soft" : "text-fg-muted hover:bg-surface hover:text-fg"
                    }`}
                  >
                    <span>{f}</span>
                    <span className="text-xs text-fg-subtle tnum">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button className="btn btn-primary mt-4 w-full text-sm">+ Compose</button>
        </nav>

        {/* List */}
        <ul className="overflow-y-auto border-r border-border">
          {visible.map((m) => (
            <li key={m.id}>
              <button
                onClick={() => {
                  setActiveId(m.id);
                  if (m.state === "Unread") setState(m.id, "Open");
                }}
                className={`group flex w-full flex-col gap-1 border-b border-border px-4 py-4 text-left transition ${
                  activeId === m.id ? "bg-brand-soft/40" : "hover:bg-surface-2"
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {m.state === "Unread" && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-brand" />}
                    <span className={`truncate text-sm ${m.state === "Unread" ? "font-semibold text-fg" : "text-fg"}`}>
                      {m.from}
                    </span>
                  </div>
                  <span className="text-xs text-fg-subtle">{m.date.split(" · ").pop()}</span>
                </div>
                <div className="truncate text-sm text-fg">{m.subject}</div>
                <div className="truncate text-xs text-fg-muted">{m.preview}</div>
                {m.residence && (
                  <div className="mt-1 inline-flex w-fit items-center gap-1 rounded-md bg-surface-2 px-2 py-0.5 text-[10px] uppercase tracking-wider text-fg-muted">
                    {m.residence}
                  </div>
                )}
              </button>
            </li>
          ))}
          {visible.length === 0 && (
            <li className="p-10 text-center text-sm text-fg-muted">No messages in {folder}.</li>
          )}
        </ul>

        {/* Detail */}
        <section className="flex flex-col overflow-hidden">
          {active ? (
            <>
              <header className="flex items-start justify-between gap-4 border-b border-border p-5">
                <div className="min-w-0">
                  <h2 className="font-display text-xl tracking-tight">{active.subject}</h2>
                  <div className="mt-2 flex items-center gap-3 text-sm text-fg-muted">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-xs font-medium text-brand">
                      {active.from.split(" ").map((s) => s[0]).join("")}
                    </div>
                    <div>
                      <div className="font-medium text-fg">{active.from}</div>
                      <div className="text-xs">{active.email} · {active.date}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <IconBtn label="Star" onClick={() => toggleStar(active.id)} active={!!active.starred}>
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill={active.starred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
                      <path d="M12 2l3 7 8 .9-6 5.4 1.7 8L12 18.8 5.3 23.3 7 15.3 1 9.9l8-.9z" />
                    </svg>
                  </IconBtn>
                  <IconBtn label="Archive" onClick={() => setState(active.id, "Archived")}>
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M3 3h18v5H3zM5 8v13h14V8M9 12h6" />
                    </svg>
                  </IconBtn>
                  <IconBtn label="Forward">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M15 17l5-5-5-5M4 17v-2a4 4 0 0 1 4-4h12" />
                    </svg>
                  </IconBtn>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="prose-paper max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-fg">
                  {active.body}
                </div>
              </div>

              <div className="border-t border-border bg-surface-2 p-4">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder={`Reply to ${active.from}…`}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-bg p-3 text-sm focus:border-brand focus:outline-none"
                />
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-fg-muted">
                    <span>Templates:</span>
                    <button className="rounded-md border border-border bg-surface px-2 py-1 hover:bg-bg">Thank you</button>
                    <button className="rounded-md border border-border bg-surface px-2 py-1 hover:bg-bg">Schedule viewing</button>
                    <button className="rounded-md border border-border bg-surface px-2 py-1 hover:bg-bg">Send floor plans</button>
                  </div>
                  <button
                    onClick={() => {
                      setState(active.id, "Replied");
                      setReply("");
                    }}
                    className="btn btn-primary text-sm"
                    disabled={!reply.trim()}
                  >
                    Send reply →
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-fg-muted">
              {msgs.length === 0 ? "Inbox is empty — no inquiries yet." : "Select a message"}
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  active,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition ${
        active ? "bg-brand-soft text-brand" : "text-fg-muted hover:bg-surface-2 hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}
