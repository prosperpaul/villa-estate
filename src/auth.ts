import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongo";

export type UserRole = "owner" | "admin" | "editor" | "member";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      initials: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
    initials?: string;
  }
}

type AppJWT = {
  id?: string;
  role?: UserRole;
  initials?: string;
  [key: string]: unknown;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  pages: { signIn: "/signin" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const email = String(creds?.email ?? "").trim().toLowerCase();
        const password = String(creds?.password ?? "");
        if (!email || !password) return null;

        const db = await getDb();
        const user = await db.collection("users").findOne({ email });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          initials: user.initials,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const t = token as AppJWT;
      if (user) {
        t.id = user.id;
        t.role = user.role;
        t.initials = user.initials;
      }
      return t;
    },
    async session({ session, token }) {
      const t = token as AppJWT;
      if (t.id) session.user.id = t.id;
      if (t.role) session.user.role = t.role;
      if (t.initials) session.user.initials = t.initials;
      return session;
    },
  },
});
