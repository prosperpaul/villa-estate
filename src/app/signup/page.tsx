import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import { getSession } from "@/lib/auth";
import SignUpForm from "./SignUpForm";

export const metadata = { title: "Create account — Vila Estate" };

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (session) {
    redirect("/");
  }
  const { next = "/" } = await searchParams;

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col bg-bg">
        <div className="container-x py-6">
          <Logo />
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            <div className="text-xs font-medium uppercase tracking-wider text-brand">
              Studio
            </div>
            <h1 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
              Create your account.
            </h1>
            <p className="mt-2 text-fg-muted">
              Save your favourite residences and follow new listings.
            </p>

            <SignUpForm next={next} />

            <p className="mt-8 text-center text-sm text-fg-muted">
              Already have an account?{" "}
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

      {/* Image side */}
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
            “A new home begins with a single step inside.”
          </blockquote>
          <div className="mt-4 text-sm text-white/80">
            Léa Marchand · Founding Partner
          </div>
        </div>
      </div>
    </div>
  );
}
