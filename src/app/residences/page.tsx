import { Suspense } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ResidencesFilter from "@/components/ResidencesFilter";
import { listResidences } from "@/lib/residences";
import { agents } from "@/lib/agents";

export const metadata = {
  title: "Residences, Haven Properties",
  description: "Search physically inspected, title-verified homes. Filter by location, type, bedrooms and budget.",
};

export default async function ResidencesPage() {
  // Fetched on the server, then filtered instantly in the browser
  const residences = await listResidences();

  return (
    <>
      <Nav />
      <main className="pt-20">
        {/* Suspense is required because the filter reads the URL (useSearchParams) */}
        <Suspense fallback={<div className="container-x h-96 py-16 text-fg-muted">Loading residences…</div>}>
          <ResidencesFilter residences={residences} agents={agents} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
