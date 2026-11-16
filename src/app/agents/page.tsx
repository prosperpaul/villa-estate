import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import AgentsDirectory, { type AgentStats } from "@/components/AgentsDirectory";
import { agents } from "@/lib/agents";
import { listResidences } from "@/lib/residences";

export const metadata = {
  title: "Property partners, Haven Properties",
  description: "Find a vetted Haven advisor by name, office or area, and contact them directly.",
};

export default async function AgentsPage() {
  const residences = await listResidences();

  // Per-agent listing count and price range, from the real residences.
  // The range uses the agent's most common currency so ₦ and € never mix.
  const stats: Record<string, AgentStats> = {};
  for (const a of agents) {
    const mine = residences.filter((r) => r.agentSlug === a.slug && r.status !== "Sold");
    const tally = new Map<string, number>();
    mine.forEach((r) => tally.set(r.currency, (tally.get(r.currency) ?? 0) + 1));
    const currency = [...tally.entries()].sort((x, y) => y[1] - x[1])[0]?.[0] as AgentStats["currency"];
    const prices = mine.filter((r) => r.currency === currency).map((r) => r.price);
    stats[a.slug] = {
      count: mine.length,
      currency,
      min: prices.length ? Math.min(...prices) : undefined,
      max: prices.length ? Math.max(...prices) : undefined,
    };
  }

  return (
    <>
      <Nav />
      <main className="pt-20">
        <section className="container-x max-w-[1100px] pb-[4.5rem] pt-10">
          <span className="eyebrow flex items-center gap-2 !text-brand tracking-widest">
            <span aria-hidden>✦</span> Haven partners · advisory network
          </span>
          <h1 className="display-lg max-w-3xl pt-2">Vetted property partners across our offices.</h1>
          <p className="max-w-2xl pb-8 pt-3 text-[18px] leading-7 text-fg-muted">
            Contact licensed advisors, conveyance specialists and surveyors directly. Every partner walks the
            properties they represent.
          </p>

          <AgentsDirectory agents={agents} stats={stats} />

          {/* Guarantee */}
          <aside className="mt-10 rounded-lg border border-border bg-sand p-5 md:p-8">
            <h2 className="headline-sm flex items-center gap-2">
              <Icon name="shield" className="h-6 w-6 text-brand" />
              The Haven advisory guarantee
            </h2>
            <p className="max-w-3xl pt-2 text-fg-muted">
              Every partner in this directory is background-checked and licensed before they can represent a
              listing. No undisclosed agency markups, title documents checked before you pay, and client funds
              held in escrow.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 border-t border-fg/10 pt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-fg-muted">
              <span className="flex items-center gap-2"><Icon name="check" className="h-4 w-4 text-verified" strokeWidth={2} />Title documents audited</span>
              <span className="flex items-center gap-2"><Icon name="shield" className="h-4 w-4 text-verified" />Escrow-protected payments</span>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
