import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import { getSession, isStudio } from "@/lib/auth";
import StudioSignUpForm from "./StudioSignUpForm";

export const metadata = { title: "Join the studio — Vila Estate" };

export default async function StudioSignUpPage() {
  const session = await getSession();
  if (isStudio(session)) {
    redirect("/admin");
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col bg-bg">
        <div className="container-x py-6">
          <Logo />
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            <div className="text-xs font-medium uppercase tracking-wider text-brand">
              Studio access
            </div>
            <h1 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
              Join the studio.
            </h1>
            <p className="mt-2 text-fg-muted">
              Create an account with editing rights for residences, agents and the journal.
            </p>

            <StudioSignUpForm />

            <p className="mt-8 text-center text-sm text-fg-muted">
              Already on the team?{" "}
              <Link href="/signin" className="text-brand hover:underline">
                Sign in →
              </Link>
            </p>
          </div>
        </div>

        <div className="container-x py-6 text-xs text-fg-subtle">
          © {new Date().getFullYear()} Vila Estate · All rights reserved.
        </div>
      </div>

      <div className="relative hidden lg:block">
        <Image
          src="/istockphoto-2.jpg"
          alt="A villa at the water's edge"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-black/15 to-black/35" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <blockquote className="max-w-md font-display text-2xl leading-snug">
            “Every house has its keeper.”
          </blockquote>
          <div className="mt-4 text-sm text-white/80">
            Léa Marchand · Founding Partner
          </div>
        </div>
      </div>
    </div>
  );
}
