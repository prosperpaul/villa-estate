"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "./mongo";
import { agents } from "./agents";
import { RESIDENCE_TYPES } from "./listing";
import { CURRENCIES, annualServiceCharge, emptyDraft, isSafeLink, validateAll, type ListingDraft } from "./listing-draft";
import type { Residence } from "./residences";

type Result = { ok: true; ref: string } | { ok: false; errors: string[] };

/* Rebuild the draft from scratch with the right types. Anything unexpected is
   dropped or replaced by the default, so a hand-crafted request can't sneak
   extra fields or wrong types into the database. */
function sanitize(raw: unknown): ListingDraft {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const str = (k: keyof ListingDraft, max: number) => (typeof r[k] === "string" ? (r[k] as string).trim().slice(0, max) : (emptyDraft[k] as string));
  const n = (k: keyof ListingDraft) => (typeof r[k] === "number" && Number.isFinite(r[k]) ? (r[k] as number) : 0);
  const docs = Array.isArray(r.titleDocs) ? r.titleDocs.slice(0, 10) : [];
  const links = Array.isArray(r.photoLinks) ? r.photoLinks.slice(0, 12) : [];
  return {
    listing: r.listing === "sale" ? "sale" : "rent",
    type: RESIDENCE_TYPES.includes(r.type as never) ? (r.type as ListingDraft["type"]) : "Townhouse",
    currency: CURRENCIES.includes(r.currency as never) ? (r.currency as ListingDraft["currency"]) : "NGN",
    town: str("town", 80),
    region: str("region", 80),
    country: str("country", 60),
    lat: str("lat", 20),
    lng: str("lng", 20),
    name: str("name", 120),
    tagline: str("tagline", 160),
    description: str("description", 4000),
    beds: Math.round(n("beds")),
    baths: n("baths"),
    interiorArea: n("interiorArea"),
    plotArea: n("plotArea"),
    tenure: r.tenure === "Leasehold" ? "Leasehold" : "Freehold",
    features: str("features", 2000),
    price: n("price"),
    serviceCharge: n("serviceCharge"),
    serviceChargeMode: r.serviceChargeMode === "monthly" ? "monthly" : "annual",
    caution: n("caution"),
    legal: n("legal"),
    agency: n("agency"),
    upfrontYears: r.upfrontYears === 2 ? 2 : 1,
    photoLinks: links.filter((l): l is string => typeof l === "string").map((l) => l.trim()),
    videoUrl: str("videoUrl", 500),
    titleDocs: docs
      .filter((t): t is Record<string, unknown> => !!t && typeof t === "object")
      .map((t) => ({
        name: String(t.name ?? "").trim().slice(0, 120),
        detail: String(t.detail ?? "").trim().slice(0, 160),
        authority: String(t.authority ?? "").trim().slice(0, 120),
      })),
    contactName: str("contactName", 100),
    contactEmail: str("contactEmail", 160).toLowerCase(),
    contactPhone: str("contactPhone", 25),
    company: str("company", 100),
    consent: r.consent === true,
  };
}

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

/**
 * Public action: a landlord submits a listing.
 * It is saved as an UNPUBLISHED draft (published: false) for staff to review.
 * Nothing appears on the public site until an admin publishes it.
 */
export async function submitListingAction(raw: unknown, honeypot: string): Promise<Result> {
  // Bots fill every field, including the invisible one
  if (honeypot) return { ok: false, errors: ["Submission rejected."] };

  const d = sanitize(raw);
  const errors = validateAll(d);
  if (errors.length) return { ok: false, errors };

  const db = await getDb();
  const col = db.collection("residences");

  // Simple rate limit: at most 5 pending submissions per email per day
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const recent = await col.countDocuments({ "review.landlord.email": d.contactEmail, "review.submittedAt": { $gte: since } });
  if (recent >= 5) return { ok: false, errors: ["You've sent several listings today. Our team will be in touch before you send more."] };

  // Unique slug: title + short random suffix
  let slug = "";
  for (let i = 0; i < 5; i++) {
    slug = `${slugify(d.name) || "listing"}-${Math.random().toString(36).slice(2, 7)}`;
    if (!(await col.findOne({ slug }, { projection: { _id: 1 } }))) break;
  }

  const paragraphs = d.description.split(/\n{2,}|\r\n\r\n/).map((p) => p.trim()).filter(Boolean);
  const features = d.features.split(",").map((f) => f.trim().slice(0, 80)).filter(Boolean).slice(0, 20);
  const rent = d.listing === "rent";

  const doc: Residence = {
    slug,
    name: d.name,
    issueNumber: "Draft",
    status: "Available",
    tagline: d.tagline,
    abstract: d.description.slice(0, 300),
    body: paragraphs,
    location: { town: d.town, region: d.region, country: d.country, lat: Number(d.lat) || 0, lng: Number(d.lng) || 0 },
    architect: { name: "", year: new Date().getFullYear() },
    price: d.price,
    currency: d.currency,
    beds: d.type === "Land" ? 0 : d.beds,
    baths: d.type === "Land" ? 0 : d.baths,
    receptionRooms: 0,
    interiorArea: d.interiorArea,
    plotArea: d.plotArea,
    pool: features.some((f) => /pool/i.test(f)),
    tenure: d.tenure,
    type: d.type,
    // Photos are added by staff after review; landlord links are kept in `review` only
    cover: "",
    gallery: [],
    features,
    agentSlug: agents[0]?.slug ?? "",
    videoUrl: d.videoUrl && isSafeLink(d.videoUrl) ? d.videoUrl : undefined,
    // Landlords can't self-verify: every document starts as pending
    titleDocs: d.titleDocs
      .filter((t) => t.name)
      .map((t) => ({ name: t.name, detail: t.detail || undefined, authority: t.authority || undefined, status: "Submitted, pending verification" })),
    listing: d.listing,
    rent: rent
      ? { serviceCharge: annualServiceCharge(d), caution: d.caution, legal: d.legal, agency: d.agency, upfrontYears: d.upfrontYears }
      : undefined,
    published: false,
    review: {
      state: "pending",
      submittedAt: new Date().toISOString(),
      landlord: { name: d.contactName, email: d.contactEmail, phone: d.contactPhone, company: d.company || undefined },
      photoLinks: d.photoLinks.filter((l) => l && isSafeLink(l)),
    },
  };

  await col.insertOne({ ...doc, createdAt: new Date() });
  revalidatePath("/admin/residences");
  revalidatePath("/admin");
  return { ok: true, ref: slug };
}
