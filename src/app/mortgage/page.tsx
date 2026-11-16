import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import AffordabilityTabs from "@/components/mortgage/AffordabilityTabs";
import { agents } from "@/lib/agents";

export const metadata = {
  title: "Mortgage & affordability calculator, Haven Properties",
  description: "Estimate mortgage repayments, closing costs and how much rent you can afford in Nigeria.",
};

// Editorial comparison of financing routes. Figures are indicative, not offers.
const products = [
  {
    n: "01",
    tag: "Standard",
    title: "Commercial bank mortgage",
    intro: "Offered by tier-one Nigerian banks and primary mortgage banks.",
    rows: [
      ["Interest rate", "About 15% to 21% p.a."],
      ["Typical term", "Up to 20 years"],
      ["Equity required", "20% to 30%"],
      ["Title needed", "Governor's Consent, C of O or Federal allocation"],
    ],
    note: "Best for salaried buyers with formal income records.",
  },
  {
    n: "02",
    tag: "Subsidised",
    title: "National Housing Fund (NHF)",
    intro: "A concessionary loan from the Federal Mortgage Bank, via accredited primary mortgage banks.",
    rows: [
      ["Interest rate", "About 6% p.a."],
      ["Typical term", "Up to 30 years (or age 60)"],
      ["Loan ceiling", "Capped; check the current limit"],
      ["Title needed", "Clean title or an NHF-approved scheme"],
    ],
    note: "The cheapest rate available, but you must have contributed to the NHF first.",
    highlight: true,
  },
  {
    n: "03",
    tag: "Direct",
    title: "Developer instalment plan",
    intro: "Paying the developer in stages, with funds held in escrow.",
    rows: [
      ["Interest rate", "0% to 12%, built into the price"],
      ["Typical term", "12 to 48 months"],
      ["Equity required", "10% to 20% upfront"],
      ["Title needed", "Estate master deed and individual allocation"],
    ],
    note: "Flexible and quick, with no bank paperwork. Popular with diaspora buyers.",
  },
];

type Props = { searchParams: Promise<{ price?: string; tab?: string }> };

export default async function MortgagePage({ searchParams }: Props) {
  const sp = await searchParams;
  // /mortgage?price=85000000 pre-fills the simulator (linked from residence pages)
  const price = Number(sp.price);
  const initialPrice = price > 0 && price < 100_000_000_000 ? Math.round(price) : undefined;
  const advisor = agents[0];

  return (
    <>
      <Nav />
      <main className="pt-20">
        {/* ============ HEADER ============ */}
        <section className="border-b border-border">
          <div className="container-x pb-10 pt-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[12px] font-medium tracking-[0.06em] text-fg-muted">
              <Link href="/" className="hover:text-brand">Home</Link>
              <span className="text-border">/</span>
              <span className="font-semibold text-fg">Mortgage & affordability</span>
            </nav>
            <div className="flex flex-col justify-between gap-5 pt-6 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <span className="eyebrow !text-brand tracking-widest">Financial advisory</span>
                <h1 className="display-lg pt-1">Understand what you can afford.</h1>
                <p className="pt-3 text-[18px] leading-7 text-fg-muted">
                  Estimate mortgage repayments and closing costs, or work out how much rent your income
                  supports, using typical Nigerian lending terms.
                </p>
              </div>
              <span className="badge badge-verified shrink-0 !normal-case !tracking-[0.02em]">
                <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2} />
                Default rate 16.5% p.a., editable
              </span>
            </div>
          </div>
        </section>

        {/* ============ CALCULATORS ============ */}
        <section className="container-x py-10">
          <AffordabilityTabs initialPrice={initialPrice} initialTab={sp.tab === "rent" ? "rent" : "mortgage"} />
        </section>

        {/* ============ PRODUCT MATRIX ============ */}
        <section className="border-y border-border bg-surface py-[4.5rem]">
          <div className="container-x">
            <div className="flex flex-col justify-between gap-5 pb-10 lg:flex-row lg:items-end">
              <div>
                <span className="eyebrow !text-brand tracking-widest">Financing routes</span>
                <h2 className="headline-lg pt-1">Nigerian mortgage options compared</h2>
              </div>
              <p className="max-w-md text-fg-muted">
                Typical terms for each route. Rates and limits change, so always confirm with the lender.
              </p>
            </div>
            <div className="grid grid-cols-1 divide-y divide-border rounded-lg border border-border bg-bg md:grid-cols-3 md:divide-x md:divide-y-0">
              {products.map((p) => (
                <article key={p.n} className="flex flex-col justify-between p-5">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="eyebrow">Option {p.n}</span>
                      <span className={`badge !px-2 !py-0.5 ${p.highlight ? "badge-verified" : ""}`}>{p.tag}</span>
                    </div>
                    <h3 className="headline-sm pt-3">{p.title}</h3>
                    <p className="pt-1 text-[13px] leading-5 text-fg-muted">{p.intro}</p>
                    <dl className="mt-5 space-y-2 border-t border-border pt-4 text-[13px]">
                      {p.rows.map(([k, v]) => (
                        <div key={k} className={k === "Title needed" ? "pt-2" : "flex justify-between gap-3"}>
                          <dt className={k === "Title needed" ? "eyebrow" : "text-fg-muted"}>{k}</dt>
                          <dd className="font-medium">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <p className="mt-5 border-t border-border pt-4 text-[13px] italic leading-5 text-fg-muted">{p.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ ADVISOR ============ */}
        {advisor && (
          <section id="advisor" className="container-x scroll-mt-24 py-[4.5rem]">
            <div className="rounded-lg border border-border bg-surface p-5 md:p-8">
              <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
                <div className="flex items-center gap-4 lg:col-span-4">
                  <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-border bg-sand font-display text-[28px]">
                    {advisor.initials}
                  </span>
                  <div>
                    <Link href={`/agents/${advisor.slug}`} className="headline-sm hover:text-brand">{advisor.name}</Link>
                    <span className="eyebrow block pt-0.5">{advisor.role}</span>
                    <span className="text-[12px] text-fg-muted">Based in {advisor.basedIn}</span>
                  </div>
                </div>
                <div className="border-border lg:col-span-5 lg:border-l lg:pl-6">
                  <span className="eyebrow !text-brand block">Private client support</span>
                  <p className="pt-2 font-display text-[19px] leading-7">
                    We help structure your mortgage pre-approval and check the title documents before any money
                    changes hands.
                  </p>
                </div>
                <div className="flex flex-col gap-2 lg:col-span-3">
                  <a href={`mailto:${advisor.email}?subject=Mortgage%20consultation`} className="btn btn-primary">
                    Book a consultation
                  </a>
                  <a href={`https://wa.me/${advisor.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                    <Icon name="chat" className="h-4 w-4 text-verified" />
                    WhatsApp
                  </a>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-fg-muted sm:flex-row sm:justify-between">
                <span className="flex items-center gap-2"><Icon name="shield" className="h-4 w-4 text-verified" />Escrow-protected payments</span>
                <span className="flex items-center gap-2"><Icon name="doc" className="h-4 w-4 text-verified" />Title checked before you pay</span>
                <span className="flex items-center gap-2"><Icon name="check" className="h-4 w-4 text-verified" />No hidden agency markups</span>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
