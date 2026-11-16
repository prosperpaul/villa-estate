"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "./mongo";
import { getSession, isStudio } from "./auth";
import type { Faq, Fee, LedgerRow, Nearby, PaymentPlan, RentTerms, Residence, TitleDocument } from "./residences";

/**
 * Server actions for admin residence management.
 *
 * All three functions:
 *  - Verify the caller has a studio session (auth check via layout / proxy)
 *  - Write to the "residences" collection in MongoDB
 *  - Call revalidatePath so Next.js re-renders cached pages with fresh data
 */

export type ResidencePayload = {
  slug?: string;
  name: string;
  type: Residence["type"];
  status: Residence["status"];
  tagline: string;
  abstract: string;
  location: { town: string; region: string; country: string; lat: number; lng: number };
  architect: { name: string; year: number };
  price: number;
  currency: Residence["currency"];
  beds: number;
  baths: number;
  interiorArea: number;
  plotArea: number;
  cover: string;
  gallery: string[];
  features: string[];
  agentSlug: string;
  // Optional dossier extras
  titleDocs?: TitleDocument[];
  videoUrl?: string;
  faqs?: Faq[];
  nearby?: Nearby[];
  ledger?: LedgerRow[];
  paymentPlans?: PaymentPlan[];
  fees?: Fee[];
  listing?: "sale" | "rent";
  rent?: RentTerms;
};

type ActionResult<T = unknown> = { ok: true; data?: T } | { ok: false; error: string };

/**
 * Server actions can be called directly, not only from admin pages, so each
 * one must check the caller is signed-in studio staff before touching data.
 */
async function requireStudio(): Promise<string | null> {
  const user = await getSession();
  return isStudio(user) ? null : "You need to be signed in as studio staff.";
}

/** Turn "Villa Aurelia" → "villa-aurelia" for URLs. */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validate(data: ResidencePayload): string | null {
  if (!data.name.trim()) return "Name is required.";
  if (!data.price || data.price < 1) return "Guide price is required.";
  if (!data.agentSlug) return "Please assign an agent.";
  return null;
}

/** Drop half-filled rows so the public page never shows blanks. */
function cleanExtras(data: ResidencePayload) {
  return {
    titleDocs: (data.titleDocs ?? [])
      .map((d) => ({
        name: d.name.trim(),
        detail: d.detail?.trim() || undefined,
        authority: d.authority?.trim() || undefined,
        status: d.status.trim(),
      }))
      .filter((d) => d.name && d.status),
    videoUrl: data.videoUrl?.trim() || undefined,
    faqs: (data.faqs ?? []).map((f) => ({ q: f.q.trim(), a: f.a.trim() })).filter((f) => f.q && f.a),
    nearby: (data.nearby ?? [])
      .map((n) => ({ place: n.place.trim(), minutes: Number(n.minutes) || 0, note: n.note?.trim() || undefined }))
      .filter((n) => n.place && n.minutes > 0),
    ledger: (data.ledger ?? [])
      .map((l) => ({ label: l.label.trim(), value: l.value.trim(), note: l.note?.trim() || undefined }))
      .filter((l) => l.label && l.value),
    paymentPlans: (data.paymentPlans ?? [])
      .map((p) => ({
        tenor: p.tenor.trim(),
        deposit: Number(p.deposit) || 0,
        monthly: Number(p.monthly) || undefined,
        total: Number(p.total) || 0,
        handover: p.handover?.trim() || undefined,
      }))
      .filter((p) => p.tenor && p.total > 0),
    fees: (data.fees ?? [])
      .map((f) => ({ label: f.label.trim(), amount: Number(f.amount) || 0, note: f.note?.trim() || undefined }))
      .filter((f) => f.label && f.amount > 0),
  };
}

function docFromPayload(data: ResidencePayload, existing?: Partial<Residence>): Residence {
  return {
    slug: (data.slug || slugify(data.name)).trim(),
    name: data.name.trim(),
    issueNumber: existing?.issueNumber ?? `No. ${new Date().getFullYear()}`,
    status: data.status,
    tagline: data.tagline,
    abstract: data.abstract,
    body: existing?.body ?? [data.abstract],
    location: data.location,
    architect: { ...data.architect, studio: existing?.architect?.studio },
    price: data.price,
    currency: data.currency,
    beds: data.beds,
    baths: data.baths,
    receptionRooms: existing?.receptionRooms ?? 0,
    interiorArea: data.interiorArea,
    plotArea: data.plotArea,
    pool: existing?.pool ?? false,
    tenure: existing?.tenure ?? "Freehold",
    type: data.type,
    cover: data.cover,
    gallery: data.gallery,
    features: data.features,
    agentSlug: data.agentSlug,
    ...cleanExtras(data),
    listing: data.listing === "rent" ? "rent" : "sale",
    rent:
      data.listing === "rent" && data.rent
        ? {
            serviceCharge: Math.max(0, Number(data.rent.serviceCharge) || 0),
            caution: Math.max(0, Number(data.rent.caution) || 0),
            legal: Math.max(0, Number(data.rent.legal) || 0),
            agency: Math.max(0, Number(data.rent.agency) || 0),
            upfrontYears: data.rent.upfrontYears === 2 ? 2 : 1,
          }
        : undefined,
  };
}

function revalidateAll(slug?: string) {
  revalidatePath("/");
  revalidatePath("/residences");
  revalidatePath("/admin/residences");
  revalidatePath("/admin");
  revalidatePath("/agents");
  if (slug) {
    revalidatePath(`/residences/${slug}`);
    revalidatePath(`/admin/residences/${slug}/edit`);
  }
}

export async function createResidenceAction(
  data: ResidencePayload,
): Promise<ActionResult<{ slug: string }>> {
  const denied = await requireStudio();
  if (denied) return { ok: false, error: denied };
  const err = validate(data);
  if (err) return { ok: false, error: err };

  const slug = (data.slug || slugify(data.name)).trim();
  const db = await getDb();
  const existing = await db.collection("residences").findOne({ slug });
  if (existing) return { ok: false, error: `A residence with slug "${slug}" already exists.` };

  const doc = docFromPayload({ ...data, slug });
  await db.collection("residences").insertOne(doc);
  revalidateAll(slug);
  return { ok: true, data: { slug } };
}

export async function updateResidenceAction(
  originalSlug: string,
  data: ResidencePayload,
): Promise<ActionResult<{ slug: string }>> {
  const denied = await requireStudio();
  if (denied) return { ok: false, error: denied };
  const err = validate(data);
  if (err) return { ok: false, error: err };

  const db = await getDb();
  const existing = await db.collection("residences").findOne({ slug: originalSlug });
  if (!existing) return { ok: false, error: "Residence not found." };

  const doc = docFromPayload(
    { ...data, slug: data.slug || originalSlug },
    existing as unknown as Partial<Residence>,
  );

  await db.collection("residences").updateOne(
    { slug: originalSlug },
    { $set: { ...doc, updatedAt: new Date() } },
  );
  revalidateAll(originalSlug);
  if (doc.slug !== originalSlug) revalidatePath(`/residences/${doc.slug}`);
  return { ok: true, data: { slug: doc.slug } };
}

export async function deleteResidenceAction(slug: string): Promise<ActionResult> {
  const denied = await requireStudio();
  if (denied) return { ok: false, error: denied };
  if (!slug) return { ok: false, error: "Missing slug." };
  const db = await getDb();
  const result = await db.collection("residences").deleteOne({ slug });
  if (result.deletedCount === 0) return { ok: false, error: "Residence not found." };
  revalidateAll(slug);
  return { ok: true };
}

/** Publish or unpublish a listing (used to approve landlord submissions). */
export async function setPublishedAction(slug: string, published: boolean): Promise<ActionResult> {
  const denied = await requireStudio();
  if (denied) return { ok: false, error: denied };
  const db = await getDb();
  const result = await db.collection("residences").updateOne(
    { slug },
    {
      $set: {
        published,
        ...(published ? { "review.state": "approved" } : {}),
        updatedAt: new Date(),
      },
    },
  );
  if (result.matchedCount === 0) return { ok: false, error: "Residence not found." };
  revalidateAll(slug);
  return { ok: true };
}
