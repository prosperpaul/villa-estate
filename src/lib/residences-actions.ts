"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "./mongo";
import type { Residence } from "./residences";

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
};

type ActionResult<T = unknown> = { ok: true; data?: T } | { ok: false; error: string };

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
  if (!slug) return { ok: false, error: "Missing slug." };
  const db = await getDb();
  const result = await db.collection("residences").deleteOne({ slug });
  if (result.deletedCount === 0) return { ok: false, error: "Residence not found." };
  revalidateAll(slug);
  return { ok: true };
}
