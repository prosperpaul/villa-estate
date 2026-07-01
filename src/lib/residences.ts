import { getDb } from "./mongo";

export type Currency = "EUR" | "USD" | "GBP";

export type Residence = {
  slug: string;
  name: string;
  issueNumber: string;
  status: "Available" | "Reserved" | "In Confidence" | "Sold";
  tagline: string;
  abstract: string;
  body: string[];
  location: { town: string; region: string; country: string; lat: number; lng: number };
  architect: { name: string; year: number; studio?: string };
  price: number;
  currency: Currency;
  beds: number;
  baths: number;
  receptionRooms: number;
  interiorArea: number;
  plotArea: number;
  pool: boolean;
  tenure: "Freehold" | "Leasehold";
  type: "Villa" | "Estate" | "Pavilion" | "Retreat" | "Townhouse" | "Compound";
  cover: string;
  gallery: string[];
  features: string[];
  agentSlug: string;
};

/**
 * Seed data — used ONLY by /api/seed-residences to populate MongoDB on first
 * setup. Do NOT import this directly from pages; use listResidences() instead
 * so you always see the latest from the database (including admin additions).
 */
export const seedResidences: Residence[] = [
  {
    slug: "villa-aurelia",
    name: "Villa Aurelia",
    issueNumber: "No. 01",
    status: "Available",
    tagline: "A long-glazed pavilion above the Antibes coastline.",
    abstract:
      "A 1,420-square-metre cliffside residence commissioned in 2014 from the Marseille studio Boudet & Lefèvre, set on a 1.6-hectare plot of stone pines two hundred metres above the Mediterranean.",
    body: [
      "Aurelia was conceived as a long single-storey gesture parallel to the sea: a continuous loggia of teak and travertine connecting six bedrooms, a library, a music room and a glasshouse kitchen. The owners — a Belgian collector and his family — used the residence as a private wintering house and a place to receive the architects whose work they collect.",
      "The site is unusual. A spring-fed water table beneath the western terrace was preserved at the architect's insistence, becoming the reflecting basin that runs the length of the house. The building does not so much stand on the land as float, by a margin of forty centimetres, above it.",
      "What is for sale is not only a house but also its archive: site drawings, the original Lefèvre maquette in cedar, a planted inventory of more than 1,200 specimens, and an introduction to the gardener who has cared for the property since 1992.",
    ],
    location: { town: "Cap d'Antibes", region: "Côte d'Azur", country: "France", lat: 43.555, lng: 7.123 },
    architect: { name: "Boudet & Lefèvre", year: 2014, studio: "Marseille" },
    price: 24500000,
    currency: "EUR",
    beds: 7,
    baths: 9,
    receptionRooms: 4,
    interiorArea: 1420,
    plotArea: 16000,
    pool: true,
    tenure: "Freehold",
    type: "Villa",
    cover: "/istockphoto-1.jpg",
    gallery: ["/istockphoto-1.jpg", "/istockphoto-2.jpg", "/photo-10.avif", "/photo-13.avif"],
    features: ["Reflecting basin", "Olive grove (c. 1820)", "Boathouse", "Staff quarters", "Detached guest pavilion", "Wine vault"],
    agentSlug: "lea-marchand",
  },
  {
    slug: "casa-del-vento",
    name: "Casa del Vento",
    issueNumber: "No. 02",
    status: "Available",
    tagline: "A stone house held still against the tramontana.",
    abstract:
      "A 980 m² agricultural compound between Deià and Sóller, restored 2018–2021 by the Palma practice Folguera Arquitectos around the bones of a 17th-century possessió.",
    body: [
      "The owners purchased the ruined finca in 2017 with no intention of restoring it. The decision, by their account, was made one September evening when a wind from the north came down through the Tramuntana range and rattled the loose tiles for three uninterrupted minutes. The house, in their words, made a case for itself.",
      "Folguera's restoration left more than it removed: original beam ends, kiln stains on the stone, two outbuildings now repurposed as a writing studio and a small orangery. The pool, sunk into the lower terrace, is lined with hand-fired Mallorcan tile from a small studio in Andratx.",
    ],
    location: { town: "Deià", region: "Mallorca", country: "Spain", lat: 39.748, lng: 2.648 },
    architect: { name: "Folguera Arquitectos", year: 2021, studio: "Palma de Mallorca" },
    price: 18900000,
    currency: "EUR",
    beds: 6,
    baths: 7,
    receptionRooms: 3,
    interiorArea: 980,
    plotArea: 28000,
    pool: true,
    tenure: "Freehold",
    type: "Estate",
    cover: "/istockphoto-7.jpg",
    gallery: ["/istockphoto-7.jpg", "/photo-15.avif", "/istockphoto-9.webp", "/photo-19.avif"],
    features: ["17th-century stone walls", "Writing studio", "Orangery", "Olive grove (c. 1740)", "Hand-fired tile pool"],
    agentSlug: "tomas-folguera",
  },
  {
    slug: "maison-lumiere",
    name: "Maison Lumière",
    issueNumber: "No. 03",
    status: "In Confidence",
    tagline: "Pine, lime plaster, and a great deal of glass.",
    abstract:
      "A 1,680 m² house above the Bay of Pampelonne, commissioned 2019 from RCR Arquitectes' former associate Bernat Ferran.",
    body: [
      "Lumière was the first independent commission of Bernat Ferran after his thirteen years at RCR, and bears something of his former studio's discipline: weathered steel, glass set deep into stone, no door wider than necessary. The owners are a couple who, in their previous house, lived behind a hedge so dense the gardener could not enter it without ducking. Here they wanted, in their words, a quieter conversation with the light.",
    ],
    location: { town: "Saint-Tropez", region: "Côte d'Azur", country: "France", lat: 43.272, lng: 6.638 },
    architect: { name: "Bernat Ferran", year: 2022, studio: "Olot / Saint-Tropez" },
    price: 31200000,
    currency: "EUR",
    beds: 8,
    baths: 10,
    receptionRooms: 5,
    interiorArea: 1680,
    plotArea: 22000,
    pool: true,
    tenure: "Freehold",
    type: "Villa",
    cover: "/istockphoto-3.jpg",
    gallery: ["/istockphoto-3.jpg", "/photo-17.avif", "/premium_photo-11.avif"],
    features: ["Cor-Ten steel envelope", "Lime-plaster interiors", "Cellar (1,400 bottles)", "Private path to beach"],
    agentSlug: "lea-marchand",
  },
  {
    slug: "villa-serenella",
    name: "Villa Serenella",
    issueNumber: "No. 04",
    status: "Available",
    tagline: "A small house, quietly held by the lake.",
    abstract:
      "An 820 m² 1930s villa in Bellagio, sensitively restored in 2020 by Studio Mascalchi of Milan with the original plaster, terrazzo and ironwork retained throughout.",
    body: [
      "Serenella is the smaller of two houses on the same headland, the larger having been sold privately in 2019. Where its sibling was rebuilt, Serenella was conserved: original ironwork, parquet, mirror plates and a brass hand-rail to the lake terrace all intact.",
    ],
    location: { town: "Bellagio", region: "Lake Como", country: "Italy", lat: 45.985, lng: 9.262 },
    architect: { name: "Studio Mascalchi", year: 2020, studio: "Milan" },
    price: 14400000,
    currency: "EUR",
    beds: 5,
    baths: 6,
    receptionRooms: 3,
    interiorArea: 820,
    plotArea: 9000,
    pool: true,
    tenure: "Freehold",
    type: "Villa",
    cover: "/istockphoto-8.jpg",
    gallery: ["/istockphoto-8.jpg", "/photo-18.avif", "/premium_photo-12.avif"],
    features: ["Boathouse with mooring", "Lakeside terrace", "Original 1930s terrazzo", "Restored ironwork"],
    agentSlug: "elisabetta-marini",
  },
  {
    slug: "dar-el-bahia",
    name: "Dar el Bahia",
    issueNumber: "No. 05",
    status: "Available",
    tagline: "A walled garden built around a single jacaranda.",
    abstract:
      "A 1,150 m² Palmeraie compound, designed 2016 by Studio KO around an existing jacaranda tree more than seventy years old.",
    body: [
      "Dar el Bahia is built as a series of low rammed-earth pavilions arranged around three courts. The largest court is given over entirely to a single jacaranda — a tree the architects refused to remove, against the original brief, and around which the floor plan was rebuilt three times.",
    ],
    location: { town: "Palmeraie", region: "Marrakech", country: "Morocco", lat: 31.679, lng: -7.965 },
    architect: { name: "Studio KO", year: 2016, studio: "Paris / Marrakech" },
    price: 9800000,
    currency: "USD",
    beds: 6,
    baths: 8,
    receptionRooms: 4,
    interiorArea: 1150,
    plotArea: 14000,
    pool: true,
    tenure: "Freehold",
    type: "Compound",
    cover: "/istockphoto-4.jpg",
    gallery: ["/istockphoto-4.jpg", "/istockphoto-5.jpg", "/premium_photo-14.avif", "/premium_photo-16.avif"],
    features: ["Rammed-earth construction", "Three courtyards", "Hammam", "Library pavilion", "Walled garden"],
    agentSlug: "youssef-laraqui",
  },
  {
    slug: "pavillon-noir",
    name: "Pavillon Noir",
    issueNumber: "No. 06",
    status: "Available",
    tagline: "A blackened-cedar pavilion over a Provençal valley.",
    abstract:
      "A 740 m² hillside pavilion in Saint-Paul-de-Vence, completed 2020 by the Antibes studio Marchand & Veys.",
    body: [
      "The house is a study in restraint: a single long pavilion clad in shou-sugi-ban cedar, set above a south-facing valley of cypress and lavender. Inside, everything is white — limewashed walls, pale travertine floors, a kitchen of unfinished oak.",
    ],
    location: { town: "Saint-Paul-de-Vence", region: "Côte d'Azur", country: "France", lat: 43.696, lng: 7.122 },
    architect: { name: "Marchand & Veys", year: 2020, studio: "Antibes" },
    price: 12600000,
    currency: "EUR",
    beds: 5,
    baths: 6,
    receptionRooms: 3,
    interiorArea: 740,
    plotArea: 11000,
    pool: true,
    tenure: "Freehold",
    type: "Pavilion",
    cover: "/istockphoto-2.jpg",
    gallery: ["/istockphoto-2.jpg", "/photo-10.avif", "/photo-13.avif"],
    features: ["Shou-sugi-ban cedar", "South-facing valley", "Olive grove", "Pétanque court"],
    agentSlug: "lea-marchand",
  },
  {
    slug: "villa-monteverde",
    name: "Villa Monteverde",
    issueNumber: "No. 07",
    status: "Reserved",
    tagline: "Concrete, glass, and the patience of an arborist.",
    abstract:
      "An 1,080 m² brutalist residence above Lake Como, completed 2017 by Studio Pirelli of Milan with a botanical garden of 1,800 specimens curated over a decade.",
    body: [
      "Monteverde is the rare brutalist house that is genuinely warm. The architect — Andrea Pirelli, working on his only private commission to date — used board-formed concrete throughout, set against vast panels of clear glass and a single, unbroken Carrara marble floor.",
    ],
    location: { town: "Tremezzina", region: "Lake Como", country: "Italy", lat: 45.978, lng: 9.219 },
    architect: { name: "Studio Pirelli", year: 2017, studio: "Milan" },
    price: 16800000,
    currency: "EUR",
    beds: 6,
    baths: 7,
    receptionRooms: 3,
    interiorArea: 1080,
    plotArea: 19000,
    pool: true,
    tenure: "Freehold",
    type: "Villa",
    cover: "/istockphoto-6.jpg",
    gallery: ["/istockphoto-6.jpg", "/photo-15.avif", "/premium_photo-11.avif"],
    features: ["Board-formed concrete", "Carrara marble floors", "Botanical garden (1,800 specimens)", "Private mooring"],
    agentSlug: "elisabetta-marini",
  },
  {
    slug: "the-coast-house",
    name: "The Coast House",
    issueNumber: "No. 08",
    status: "Available",
    tagline: "A long timber bar above the Atlantic.",
    abstract:
      "A 640 m² weathered-timber retreat on the western edge of County Kerry, completed 2019 by O'Donnell + Tuomey on a 22-acre plot bordered on three sides by the ocean.",
    body: [
      "The Coast House sits at the very end of a private road that itself ends in the Atlantic. The brief was simple: a long, low building that disappears when the rain comes in. The architects responded with a single weathered-timber bar set parallel to the coastline, its windows oriented to the most reliable horizons of light.",
    ],
    location: { town: "Dingle Peninsula", region: "County Kerry", country: "Ireland", lat: 52.13, lng: -10.27 },
    architect: { name: "O'Donnell + Tuomey", year: 2019, studio: "Dublin" },
    price: 6800000,
    currency: "GBP",
    beds: 4,
    baths: 4,
    receptionRooms: 2,
    interiorArea: 640,
    plotArea: 89000,
    pool: false,
    tenure: "Freehold",
    type: "Retreat",
    cover: "/istockphoto-5.jpg",
    gallery: ["/istockphoto-5.jpg", "/photo-19.avif", "/photo-18.avif"],
    features: ["Atlantic frontage (3 sides)", "22-acre plot", "Detached studio", "Peat-burning hearth"],
    agentSlug: "siobhan-walsh",
  },
];

/** All residences from MongoDB, newest first by issueNumber. */
export async function listResidences(): Promise<Residence[]> {
  const db = await getDb();
  const docs = await db.collection("residences").find({}).toArray();
  return docs.map(stripMongoId);
}

/** Single residence by slug, or null if not found. */
export async function getResidence(slug: string): Promise<Residence | null> {
  const db = await getDb();
  const doc = await db.collection("residences").findOne({ slug });
  if (!doc) return null;
  return stripMongoId(doc);
}

/** Unique list of region names across all residences. */
export async function listRegions(): Promise<string[]> {
  const all = await listResidences();
  return Array.from(new Set(all.map((r) => r.location.region)));
}

/** MongoDB documents include an _id field we don't want in our type. */
function stripMongoId(doc: Record<string, unknown>): Residence {
  const { _id, ...rest } = doc;
  void _id;
  return rest as unknown as Residence;
}
