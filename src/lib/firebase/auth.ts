/**
 * Firebase Auth wrapper.
 *
 * When FIREBASE_ENABLED is true, signInWithEmail will hit Firebase Auth and
 * issue an ID-token cookie. Until then, src/lib/auth.ts is the source of
 * truth and these functions are unused.
 */
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { FIREBASE_ENABLED, getFirebaseApp } from "./config";

export async function signInWithEmail(email: string, password: string) {
  if (!FIREBASE_ENABLED) {
    throw new Error("Firebase is not enabled. Set NEXT_PUBLIC_FIREBASE_ENABLED=true.");
  }
  const app = getFirebaseApp();
  if (!app) throw new Error("Firebase app not initialised.");
  const auth = getAuth(app);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return toStudioUser(credential.user);
}

export async function signOutCurrent() {
  if (!FIREBASE_ENABLED) return;
  const app = getFirebaseApp();
  if (!app) return;
  const auth = getAuth(app);
  await fbSignOut(auth);
}

function toStudioUser(u: FirebaseUser) {
  const name = u.displayName ?? u.email ?? "Studio";
  const initials = name
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return {
    id: u.uid,
    name,
    email: u.email ?? "",
    initials,
    role: "editor" as const,
  };
}
