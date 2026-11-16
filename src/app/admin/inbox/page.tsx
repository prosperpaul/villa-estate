import { getDb } from "@/lib/mongo";
import { listAllResidences } from "@/lib/residences";
import InboxClient, { type Msg } from "./InboxClient";

/**
 * Server component — runs ONLY on the server, never in the browser.
 *
 * Why: this file imports getDb (which talks to MongoDB). If this ran in the
 * browser, your DB credentials would leak. Server components keep that on
 * the server and only ship the resulting HTML to the visitor.
 */
export default async function AdminInboxPage() {
  const db = await getDb();
  const [docs, residences] = await Promise.all([
    db.collection("inbox").find({}).sort({ createdAt: -1 }).toArray(),
    listAllResidences(),
  ]);

  // Reshape MongoDB documents into the shape the UI expects.
  const messages: Msg[] = docs.map((d) => {
    const residenceName = d.residenceSlug
      ? residences.find((r) => r.slug === d.residenceSlug)?.name
      : undefined;
    const note = (d.note as string | null) ?? "";

    return {
      id: d._id.toString(),
      from: d.name,
      email: d.email,
      subject: residenceName ? `About ${residenceName}` : "General inquiry",
      preview: note.length > 100 ? note.slice(0, 100) + "…" : note || "(no message)",
      body: note || "(no message)",
      date: formatDate(d.createdAt as Date),
      state: titleCase(d.state ?? "unread"),
      residence: residenceName,
      starred: !!d.starred,
    };
  });

  return <InboxClient initial={messages} />;
}

function formatDate(d: Date): string {
  if (!d) return "";
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (sameDay) return `Today · ${time}`;
  if (isYesterday) return `Yesterday · ${time}`;
  return d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });
}

function titleCase(s: string): Msg["state"] {
  const v = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  if (v === "Unread" || v === "Open" || v === "Replied" || v === "Archived") return v;
  return "Unread";
}
