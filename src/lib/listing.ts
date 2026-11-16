// Small listing helpers that are safe to use in browser components.
// (residences.ts imports the MongoDB driver, so client code shouldn't import values from it.)
import { formatArea } from "./format";

export const RESIDENCE_TYPES = ["Villa", "Estate", "Pavilion", "Retreat", "Townhouse", "Compound", "Land"] as const;
export type ResidenceType = (typeof RESIDENCE_TYPES)[number];

type SpecSource = {
  type: ResidenceType;
  beds: number;
  baths: number;
  interiorArea: number;
  plotArea: number;
  pool?: boolean;
  receptionRooms?: number;
  tenure?: string;
};

/** Land plots have no bedrooms; cards and pages show plot size instead. */
export const isLand = (r: { type: string }) => r.type === "Land";

/**
 * The short spec list shown on cards and rows.
 *   House: ["7 beds", "9 baths", "1,420 m²", "Pool"]
 *   Land:  ["600 m² plot", "Freehold"]
 */
export function specLine(r: SpecSource, opts: { reception?: boolean; pool?: boolean } = {}): string[] {
  if (isLand(r)) {
    return [r.plotArea ? `${formatArea(r.plotArea)} plot` : null, r.tenure ?? null].filter(Boolean) as string[];
  }
  return [
    `${r.beds} beds`,
    `${r.baths} baths`,
    opts.reception && r.receptionRooms ? `${r.receptionRooms} reception` : null,
    r.interiorArea ? formatArea(r.interiorArea) : null,
    opts.pool && r.pool ? "Pool" : null,
  ].filter(Boolean) as string[];
}

/* ---------------- Rentals ---------------- */

type RentSource = {
  listing?: "sale" | "rent";
  price: number;
  rent?: { serviceCharge: number; caution: number; legal: number; agency: number; upfrontYears: 1 | 2 };
};

export const isRent = (r: { listing?: string }) => r.listing === "rent";

/** " / yr" after a rental's price, nothing for sales. */
export const priceSuffix = (r: { listing?: string }) => (isRent(r) ? " / yr" : "");

/**
 * Everything a tenant pays before moving in:
 * rent for the upfront period + service charge + caution + legal + agency.
 */
export function moveInBreakdown(r: RentSource) {
  const t = r.rent ?? { serviceCharge: 0, caution: 0, legal: 0, agency: 0, upfrontYears: 1 as const };
  const rows = [
    { label: t.upfrontYears === 2 ? "Rent (2 years upfront)" : "First year's rent", amount: r.price * t.upfrontYears },
    { label: "Service charge (per year)", amount: t.serviceCharge },
    { label: "Caution deposit (refundable)", amount: t.caution },
    { label: "Legal & tenancy agreement", amount: t.legal },
    { label: "Agency commission", amount: t.agency },
  ].filter((row) => row.amount > 0);
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  return { rows, total };
}
