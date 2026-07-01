"use client";

import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import type { Residence } from "@/lib/residences";
import { useFavorites } from "@/lib/useFavorites";

export default function SavedClient({ residences }: { residences: Residence[] }) {
  const { favs, hydrated } = useFavorites();
  const saved = residences.filter((r) => favs.includes(r.slug));

  return (
    <>
      <Nav />
      <main className="pt-[72px]">
        <section className="border-b border-border bg-surface-2">
          <div className="container-x py-16 md:py-20">
            <span className="text-[11px] font-medium uppercase tracking-wider text-brand">
              Your collection
            </span>
            <h1 className="mt-3 font-display text-5xl tracking-tight md:text-6xl">
              Saved <span className="italic">residences.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-fg-muted">
              {hydrated && saved.length > 0
                ? `${saved.length} residence${saved.length !== 1 ? "s" : ""} kept for later. Saved on this device.`
                : "Houses you save will appear here, kept on this device. Begin from any residence card."}
            </p>
          </div>
        </section>

        <section className="container-x py-16">
          {!hydrated ? (
            <div className="h-40" />
          ) : saved.length === 0 ? (
            <div className="mx-auto max-w-lg rounded-3xl border border-border bg-surface p-12 text-center">
              <svg viewBox="0 0 24 24" className="mx-auto h-10 w-10 text-fg-subtle" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M19 14l-7 7-7-7a4.5 4.5 0 1 1 7-5.5 4.5 4.5 0 1 1 7 5.5z" />
              </svg>
              <h2 className="mt-6 font-display text-2xl tracking-tight">No saved residences yet</h2>
              <p className="mt-3 text-fg-muted">
                Tap the heart on any residence to keep it here.
              </p>
              <Link href="/residences" className="btn btn-primary mt-6">
                Browse residences
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {saved.map((r) => (
                <PropertyCard key={r.slug} r={r} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
