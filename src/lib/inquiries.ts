"use server";

import { getDb } from "./mongo";

/**
 * Server action — runs on the server when the Book-a-viewing form submits.
 *
 * Why a server action: the form lives in the browser, but MongoDB lives on
 * the server. Server actions are Next.js's bridge — a normal-looking
 * function call that secretly runs server-side.
 */
export async function submitInquiryAction(
  _prev: { ok?: boolean; error?: string } | null,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string }> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const residenceSlug = String(formData.get("residenceSlug") ?? "").trim();

  if (!name) return { error: "Please enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email." };
  }

  const db = await getDb();
  await db.collection("inbox").insertOne({
    name,
    email,
    phone: phone || null,
    note: note || null,
    residenceSlug: residenceSlug || null,
    state: "unread",
    createdAt: new Date(),
  });

  return { ok: true };
}
