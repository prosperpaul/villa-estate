/**
 * Auth helpers — MongoDB-backed via NextAuth.
 *
 * - getSession()  : current logged-in user (reads NextAuth JWT)
 * - register()    : create a new user in Mongo with hashed password
 * - signOut()     : clear the NextAuth session
 * - isStudio()    : role check (owner / admin / editor)
 *
 * Sign-in itself is handled by NextAuth's signIn() — see src/auth.ts and the
 * server actions in src/app/signin/actions.ts.
 */
import bcrypt from "bcryptjs";
import { auth, signOut as nextSignOut } from "@/auth";
import { getDb } from "./mongo";

export type UserRole = "owner" | "admin" | "editor" | "member";

export type StudioUser = {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: UserRole;
};

const STUDIO_ROLES: UserRole[] = ["owner", "admin", "editor"];

export function isStudio(user: StudioUser | null | undefined): boolean {
  return !!user && STUDIO_ROLES.includes(user.role);
}

export async function getSession(): Promise<StudioUser | null> {
  const session = await auth();
  if (!session?.user?.email) return null;
  return {
    id: session.user.id,
    name: session.user.name ?? "",
    email: session.user.email,
    initials: session.user.initials ?? "",
    role: session.user.role,
  };
}

export async function requireSession(): Promise<StudioUser> {
  const u = await getSession();
  if (!u) throw new Error("Unauthenticated");
  return u;
}

export async function signOut() {
  await nextSignOut({ redirect: false });
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: UserRole = "member",
): Promise<{ ok: true; user: StudioUser } | { ok: false; error: string }> {
  const cleanName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!cleanName) return { ok: false, error: "Please enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return { ok: false, error: "That email doesn't look right." };
  }
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  const db = await getDb();
  const existing = await db.collection("users").findOne({ email: normalizedEmail });
  if (existing) {
    return { ok: false, error: "An account with that email already exists." };
  }

  const initials = cleanName
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await db.collection("users").insertOne({
    name: cleanName,
    email: normalizedEmail,
    initials,
    role,
    passwordHash,
    createdAt: new Date(),
  });

  return {
    ok: true,
    user: {
      id: result.insertedId.toString(),
      name: cleanName,
      email: normalizedEmail,
      initials,
      role,
    },
  };
}
