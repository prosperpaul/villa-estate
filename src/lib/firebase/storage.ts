/**
 * Firebase Storage wrapper.
 *
 * Used by the admin media library and residence/article cover pickers when
 * FIREBASE_ENABLED is true. Until then, the media library shows files from
 * /public.
 */
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, type FirebaseStorage } from "firebase/storage";
import { FIREBASE_ENABLED, getFirebaseApp } from "./config";

let storage: FirebaseStorage | null = null;

function getStore(): FirebaseStorage | null {
  if (!FIREBASE_ENABLED) return null;
  if (storage) return storage;
  const app = getFirebaseApp();
  if (!app) return null;
  storage = getStorage(app);
  return storage;
}

export async function uploadImage(file: File, path = "residences"): Promise<string | null> {
  const s = getStore();
  if (!s) return null;
  const key = `${path}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const r = ref(s, key);
  await uploadBytes(r, file);
  return getDownloadURL(r);
}

export async function listAssets(prefix = ""): Promise<string[] | null> {
  const s = getStore();
  if (!s) return null;
  const r = ref(s, prefix);
  const result = await listAll(r);
  return Promise.all(result.items.map((item) => getDownloadURL(item)));
}
