"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Residence } from "@/lib/residences";
import { setPublishedAction } from "@/lib/residences-actions";

// Publishing controls on the admin edit page. For landlord submissions it also
// shows who sent it and their photo links (as links only, for staff to download).
export default function ReviewPanel({ r }: { r: Residence }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const published = r.published !== false;
  const review = r.review;
  const hasPhotos = !!r.cover;
  const unverified = (r.titleDocs ?? []).filter((t) => /pending/i.test(t.status)).length;

  const toggle = () => {
    setError(null);
    start(async () => {
      const res = await setPublishedAction(r.slug, !published);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  };

  return (
    <section className={`mb-6 rounded-lg border p-5 ${published ? "border-border bg-surface" : "border-amber-300 bg-amber-50"}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${published ? "bg-brand-soft text-brand" : "bg-amber-100 text-amber-800"}`}>
            {published ? "Published" : review?.state === "pending" ? "Pending review" : "Unpublished"}
          </span>
          <h2 className="mt-2 font-display text-lg">
            {review ? "Landlord submission" : published ? "Live on the site" : "Hidden from the site"}
          </h2>
          {review && (
            <p className="text-sm text-fg-muted">
              Sent {new Date(review.submittedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })} by{" "}
              <strong className="text-fg">{review.landlord.name}</strong>
              {review.landlord.company ? ` (${review.landlord.company})` : ""}
            </p>
          )}
        </div>
        <button type="button" onClick={toggle} disabled={pending} className={`btn ${published ? "btn-secondary" : "btn-primary"} disabled:opacity-50`}>
          {pending ? "Saving…" : published ? "Unpublish" : "Publish listing"}
        </button>
      </div>

      {review && (
        <dl className="mt-4 grid grid-cols-1 gap-3 border-t border-border/70 pt-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wider text-fg-subtle">Email</dt>
            <dd><a href={`mailto:${review.landlord.email}`} className="text-brand hover:underline">{review.landlord.email}</a></dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-fg-subtle">Phone</dt>
            <dd><a href={`tel:${review.landlord.phone.replace(/\s/g, "")}`} className="text-brand hover:underline">{review.landlord.phone}</a></dd>
          </div>
          {!!review.photoLinks?.length && (
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase tracking-wider text-fg-subtle">Photo links from landlord</dt>
              <dd className="mt-1 space-y-1">
                {review.photoLinks.map((l) => (
                  // Shown as text links, never embedded: they point at third-party sites
                  <a key={l} href={l} target="_blank" rel="noopener noreferrer nofollow" className="block truncate text-brand hover:underline">{l}</a>
                ))}
              </dd>
            </div>
          )}
        </dl>
      )}

      {!published && (
        <ul className="mt-4 space-y-1 text-sm text-amber-900">
          {!hasPhotos && <li>• Add a cover photo and gallery below before publishing.</li>}
          {unverified > 0 && <li>• {unverified} title document{unverified === 1 ? " is" : "s are"} still “pending verification”. Update the status once checked.</li>}
          {(r.location.lat === 0 && r.location.lng === 0) && <li>• Set the map coordinates.</li>}
        </ul>
      )}
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
    </section>
  );
}
