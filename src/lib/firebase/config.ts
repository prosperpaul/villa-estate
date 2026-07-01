/**
 * Firebase configuration.
 *
 * To wire the real backend:
 *   1. Create a Firebase project at https://console.firebase.google.com
 *   2. Add a web app, enable Auth (email/password), Firestore, Storage.
 *   3. Copy the config values into .env.local (see .env.local.example).
 *   4. Toggle FIREBASE_ENABLED to true.
 *
 * Until then, the app runs entirely on the typed mock data in src/lib/ and the
 * cookie-based mock auth in src/lib/auth.ts — nothing here is imported on the
 * critical path.
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";

export const FIREBASE_ENABLED =
  process.env.NEXT_PUBLIC_FIREBASE_ENABLED === "true";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!FIREBASE_ENABLED) return null;

  // SSR-safe singleton.
  if (app) return app;
  const existing = getApps();
  if (existing.length > 0) {
    app = existing[0];
    return app;
  }

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn(
      "[firebase] FIREBASE_ENABLED is true but NEXT_PUBLIC_FIREBASE_* env vars are missing. Falling back to mock data.",
    );
    return null;
  }

  app = initializeApp(firebaseConfig);
  return app;
}
