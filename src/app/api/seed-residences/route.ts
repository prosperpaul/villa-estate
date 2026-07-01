/**
 * One-time seed endpoint — copies the hardcoded residences from
 * src/lib/residences.ts into MongoDB.
 *
 * USAGE: visit http://localhost:3001/api/seed-residences ONCE in the browser.
 * After it succeeds, DELETE this file. It exists only for the first migration.
 *
 * (If left in place, anyone hitting the URL could wipe and reset your
 * residences collection. Hence the dev-only guard below as a safety net.)
 */
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";
import { seedResidences } from "@/lib/residences";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { ok: false, error: "Seed endpoint disabled in production." },
      { status: 403 },
    );
  }

  const db = await getDb();
  const collection = db.collection("residences");

  // Wipe in case we ran this before — keeps the seed idempotent.
  const deleted = await collection.deleteMany({});

  // Insert all 8 residences. We use the slug as a stable id field for lookups.
  const result = await collection.insertMany(seedResidences);

  return NextResponse.json({
    ok: true,
    deletedPrevious: deleted.deletedCount,
    inserted: result.insertedCount,
    message: "Done. You can now delete this file: src/app/api/seed-residences/route.ts",
  });
}
