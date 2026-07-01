"use server";

import { redirect } from "next/navigation";
import { register } from "@/lib/auth";
import { signIn } from "@/auth";

export async function signUpAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/");

  const result = await register(name, email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  await signIn("credentials", { email, password, redirect: false });
  redirect(next || "/");
}
