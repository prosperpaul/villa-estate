import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AgentCardCompact from "@/components/AgentCardCompact";
import { agents } from "@/lib/agents";
import { listResidences } from "@/lib/residences";

export const metadata = {
  title: "Our Agents — Vila Estate",
  description: "Meet the small studio of advisors behind every Vila Estate residence.",
};

export default async function AgentsPage() {
  const residences = await listResidences();
  return (
    <>
      <Nav />
      <main className="pt-[72px]">
        <section className="border-b border-border bg-surface-2">
          <div className="container-x py-16 md:py-20">
            <span className="text-[11px] font-medium uppercase tracking-wider text-brand">
              The studio
            </span>
            <h1 className="mt-3 font-display text-5xl tracking-tight md:text-6xl">
              A small team,
              <br />
              <span className="italic">large knowledge.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-fg-muted">
              Five advisors, based across our offices in Antibes, London, Milan and
              Marrakech. Each one walks every residence they represent — no exceptions,
              no junior associates.
            </p>
          </div>
        </section>

        <section className="container-x py-16">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((a) => {
              const count = residences.filter((r) => r.agentSlug === a.slug).length;
              return <AgentCardCompact key={a.slug} a={a} listings={count} />;
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
