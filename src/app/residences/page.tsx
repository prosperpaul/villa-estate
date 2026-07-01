import { Suspense } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ResidencesFilter from "@/components/ResidencesFilter";
import { listResidences } from "@/lib/residences";

export const metadata = {
  title: "Residences — Vila Estate",
  description: "Browse our current portfolio of architect-designed villas.",
};

export default async function ResidencesPage() {
  const residences = await listResidences();

  return (
    <>
      <Nav />
      <main className="pt-[72px]">
        <section className="border-b border-border bg-surface-2">
          <div className="container-x py-16 md:py-20">
            <span className="text-[11px] font-medium uppercase tracking-wider text-brand">
              Spring 2026 — Issue No. 07
            </span>
            <h1 className="mt-3 font-display text-5xl tracking-tight md:text-6xl">
              The current <span className="italic">portfolio.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-fg-muted">
              {residences.length} residences, each personally walked and quietly vetted by the practice.
              We publish a new portfolio each quarter, never longer than ten.
            </p>
          </div>
        </section>

        <Suspense fallback={<div className="h-96 container-x py-16 text-fg-muted">Loading residences…</div>}>
          <ResidencesFilter residences={residences} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
