"use server";

import { redirect } from "next/navigation";
import { register } from "@/lib/auth";
import { signIn } from "@/auth";

export async function studioSignUpAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const result = await register(name, email, password, "editor");
  if (!result.ok) {
    return { error: result.error };
  }

  await signIn("credentials", { email, password, redirect: false });
  redirect("/admin");
}
