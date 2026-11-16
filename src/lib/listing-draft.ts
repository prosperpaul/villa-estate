// The landlord "List a property" draft: its shape, an empty starting value,
// and ONE set of validation rules used both in the browser (to guide the user)
// and on the server (to protect the database). No server imports here.
import { RESIDENCE_TYPES, type ResidenceType } from "./listing";

export const CURRENCIES = ["NGN", "USD", "GBP", "EUR"] as const;
export type DraftCurrency = (typeof CURRENCIES)[number];

export type ListingDraft = {
  // 1. Listing type
  listing: "sale" | "rent";
  type: ResidenceType;
  currency: DraftCurrency;
  // 2. Location
  town: string;
  region: string;
  country: string;
  lat: string; // kept as text while typing; optional
  lng: string;
  // 3. Specs
  name: string;
  tagline: string;
  description: string;
  beds: number;
  baths: number;
  interiorArea: number;
  plotArea: number;
  tenure: "Freehold" | "Leasehold";
  features: string; // comma-separated while editing
  // 4. Financials
  price: number; // sale price, or annual rent for rentals
  serviceCharge: number; // per year
  serviceChargeMode: "annual" | "monthly"; // how the landlord typed it
  caution: number;
  legal: number;
  agency: number;
  upfrontYears: 1 | 2;
  // 5. Media (links only; staff add final photos before publishing)
  photoLinks: string[];
  videoUrl: string;
  // 6. Title & deeds
  titleDocs: { name: string; detail: string; authority: string }[];
  // 7. Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  company: string;
  consent: boolean;
};

export const emptyDraft: ListingDraft = {
  listing: "rent",
  type: "Townhouse",
  currency: "NGN",
  town: "",
  region: "",
  country: "Nigeria",
  lat: "",
  lng: "",
  name: "",
  tagline: "",
  description: "",
  beds: 3,
  baths: 3,
  interiorArea: 0,
  plotArea: 0,
  tenure: "Freehold",
  features: "",
  price: 0,
  serviceCharge: 0,
  serviceChargeMode: "annual",
  caution: 0,
  legal: 0,
  agency: 0,
  upfrontYears: 1,
  photoLinks: [""],
  videoUrl: "",
  titleDocs: [{ name: "", detail: "", authority: "" }],
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  company: "",
  consent: false,
};

export const STEPS = [
  { key: "type", title: "Listing type" },
  { key: "location", title: "Location" },
  { key: "specs", title: "Specs" },
  { key: "money", title: "Financials" },
  { key: "media", title: "Media" },
  { key: "title", title: "Title & deeds" },
  { key: "review", title: "Review" },
] as const;

/** Service charge stored per year, whichever way it was typed. */
export const annualServiceCharge = (d: Pick<ListingDraft, "serviceCharge" | "serviceChargeMode">) =>
  d.serviceChargeMode === "monthly" ? d.serviceCharge * 12 : d.serviceCharge;

/** Totals for the rent ledger. */
export function rentTotals(d: ListingDraft) {
  const sc = annualServiceCharge(d);
  const rent = d.price * d.upfrontYears;
  const moveIn = rent + sc + d.caution + d.legal + d.agency;
  // What reaches the landlord: rent plus the service charge pool (caution sits in escrow)
  const landlord = rent + sc;
  return { sc, rent, moveIn, landlord };
}

// A link is safe if it's https:// (or a site path like /images/x.jpg), short, and has no spaces
export const isSafeLink = (s: string) => s.length <= 500 && (/^https:\/\/[^\s<>"']+$/.test(s) || /^\/[\w\-./]+$/.test(s));
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 160;
const num = (n: unknown, min: number, max: number) => typeof n === "number" && Number.isFinite(n) && n >= min && n <= max;
const text = (s: unknown, min: number, max: number) => typeof s === "string" && s.trim().length >= min && s.trim().length <= max;

/**
 * Errors per step, as plain sentences. An empty array means the step is fine.
 * The server runs this exact function again, so the browser can't skip it.
 */
export function validateStep(step: number, d: ListingDraft): string[] {
  const e: string[] = [];
  switch (STEPS[step]?.key) {
    case "type":
      if (d.listing !== "sale" && d.listing !== "rent") e.push("Choose sale or rent.");
      if (!RESIDENCE_TYPES.includes(d.type)) e.push("Choose a property type.");
      if (!CURRENCIES.includes(d.currency)) e.push("Choose a currency.");
      break;
    case "location":
      if (!text(d.town, 2, 80)) e.push("Add the area or street (2 to 80 characters).");
      if (!text(d.region, 2, 80)) e.push("Add the city or state.");
      if (!text(d.country, 2, 60)) e.push("Add the country.");
      if (d.lat && !num(Number(d.lat), -90, 90)) e.push("Latitude must be between -90 and 90.");
      if (d.lng && !num(Number(d.lng), -180, 180)) e.push("Longitude must be between -180 and 180.");
      break;
    case "specs":
      if (!text(d.name, 5, 120)) e.push("Give the listing a title (5 to 120 characters).");
      if (d.tagline.length > 160) e.push("Keep the tagline under 160 characters.");
      if (!text(d.description, 40, 4000)) e.push("Describe the property in at least 40 characters.");
      if (d.type !== "Land" && !num(d.beds, 0, 50)) e.push("Bedrooms must be 0 to 50.");
      if (d.type !== "Land" && !num(d.baths, 0, 50)) e.push("Bathrooms must be 0 to 50.");
      if (!num(d.interiorArea, 0, 1_000_000) || !num(d.plotArea, 0, 10_000_000)) e.push("Check the areas.");
      if (d.type === "Land" && !(d.plotArea > 0)) e.push("Add the plot size for land.");
      if (d.features.split(",").filter((f) => f.trim()).length > 20) e.push("List up to 20 features.");
      break;
    case "money": {
      const cap = 1e13; // a sanity ceiling, far above any real price
      if (!num(d.price, 1, cap)) e.push(d.listing === "rent" ? "Add the annual rent." : "Add the asking price.");
      if (d.listing === "rent") {
        for (const [label, v] of [["Service charge", d.serviceCharge], ["Caution deposit", d.caution], ["Legal fee", d.legal], ["Agency fee", d.agency]] as const) {
          if (!num(v, 0, cap)) e.push(`${label} must be zero or more.`);
        }
        if (d.upfrontYears !== 1 && d.upfrontYears !== 2) e.push("Choose 1 or 2 years upfront.");
      }
      break;
    }
    case "media":
      if (d.photoLinks.filter(Boolean).length > 12) e.push("Add up to 12 photo links.");
      if (d.photoLinks.some((l) => l && !isSafeLink(l))) e.push("Photo links must start with https://");
      if (d.videoUrl && !isSafeLink(d.videoUrl)) e.push("The video link must start with https://");
      break;
    case "title":
      if (d.titleDocs.length > 10) e.push("Add up to 10 documents.");
      if (d.titleDocs.some((t) => t.name.length > 120 || t.detail.length > 160 || t.authority.length > 120)) e.push("Shorten the document details.");
      if (!d.titleDocs.some((t) => t.name.trim())) e.push("Add at least one title document, e.g. C of O or Governor's Consent.");
      break;
    case "review":
      if (!text(d.contactName, 2, 100)) e.push("Add your full name.");
      if (!isEmail(d.contactEmail.trim())) e.push("Add a valid email.");
      if (!/^[+\d][\d\s()-]{6,24}$/.test(d.contactPhone.trim())) e.push("Add a phone number, e.g. +234 803 000 0000.");
      if (d.company.length > 100) e.push("Shorten the company name.");
      if (d.consent !== true) e.push("Please confirm the details are accurate.");
      break;
  }
  return e;
}

/** Every step's errors at once (used by the server before saving). */
export const validateAll = (d: ListingDraft) => STEPS.flatMap((_, i) => validateStep(i, d));
