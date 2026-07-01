"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn, signOut as nextSignOut } from "@/auth";
import { getDb } from "@/lib/mongo";

const STUDIO_ROLES = ["owner", "admin", "editor"];

export async function signInAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nextRaw = String(formData.get("next") ?? "");

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Email or password is incorrect." };
    }
    throw err;
  }

  const db = await getDb();
  const user = await db.collection("users").findOne({ email });
  const fallback = user && STUDIO_ROLES.includes(user.role) ? "/admin" : "/";
  redirect(nextRaw || fallback);
}

export async function signOutAction() {
  await nextSignOut({ redirect: false });
  redirect("/signin");
}
