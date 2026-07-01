/**
 * Firestore wrapper.
 *
 * The contract here mirrors the in-memory data helpers in src/lib/residences.ts
 * and src/lib/agents.ts, so swapping implementations is a one-import change in
 * the consumer.
 *
 * Suggested Firestore layout:
 *   /residences/{slug}    — Residence documents
 *   /agents/{slug}        — Agent documents
 *   /articles/{slug}      — Article documents
 *   /inbox/{id}           — Inquiry / slip submissions
 *   /users/{uid}          — Studio members (role, name, initials)
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  type Firestore,
} from "firebase/firestore";
import { FIREBASE_ENABLED, getFirebaseApp } from "./config";

let db: Firestore | null = null;

function getDb(): Firestore | null {
  if (!FIREBASE_ENABLED) return null;
  if (db) return db;
  const app = getFirebaseApp();
  if (!app) return null;
  db = getFirestore(app);
  return db;
}

export async function listAll<T>(path: "residences" | "agents" | "articles"): Promise<T[] | null> {
  const d = getDb();
  if (!d) return null;
  const snap = await getDocs(query(collection(d, path), orderBy("createdAt", "desc")));
  return snap.docs.map((s) => ({ id: s.id, ...s.data() }) as T);
}

export async function getOne<T>(path: "residences" | "agents" | "articles", id: string): Promise<T | null> {
  const d = getDb();
  if (!d) return null;
  const snap = await getDoc(doc(d, path, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null;
}

export async function upsert<T extends { slug: string }>(path: "residences" | "agents" | "articles", item: T) {
  const d = getDb();
  if (!d) throw new Error("Firestore not enabled");
  await setDoc(doc(d, path, item.slug), {
    ...item,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function submitInquiry(payload: {
  name: string;
  email: string;
  phone?: string;
  note?: string;
  residenceSlug?: string;
}) {
  const d = getDb();
  if (!d) {
    // Without Firestore the inquiry has nowhere to go — return a fake ok so the
    // UI still confirms; the real submission will start working once Firestore
    // is configured.
    return { ok: true, mock: true };
  }
  const ref = await addDoc(collection(d, "inbox"), {
    ...payload,
    state: "Unread",
    createdAt: serverTimestamp(),
  });
  return { ok: true, id: ref.id };
}
