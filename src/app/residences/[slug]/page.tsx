import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import PropertyGallery from "@/components/PropertyGallery";
import MortgageCalc from "@/components/MortgageCalc";
import InquiryPanel from "@/components/InquiryPanel";
import { getResidence, listResidences } from "@/lib/residences";
import { getAgent } from "@/lib/agents";
import { formatArea, formatCoords, formatPrice } from "@/lib/format";

export default async function ResidencePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = await getResidence(slug);
  if (!r) return notFound();
  const agent = getAgent(r.agentSlug);
  const all = await listResidences();
  const similar = all.filter((x) => x.slug !== r.slug).slice(0, 3);

  return (
    <>
      <Nav />
      <main className="pt-[72px]">
        {/* Breadcrumb */}
        <div className="container-x pt-6 pb-4 text-sm text-fg-muted">
          <Link href="/" className="hover:text-fg">Home</Link>
          <span className="mx-2 text-fg-subtle">/</span>
          <Link href="/residences" className="hover:text-fg">Residences</Link>
          <span className="mx-2 text-fg-subtle">/</span>
          <span className="text-fg">{r.name}</span>
        </div>

        {/* Header */}
        <header className="container-x flex flex-col items-start justify-between gap-6 pb-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand">
                {r.status}
              </span>
              <span className="text-sm text-fg-muted">{r.type}</span>
            </div>
            <h1 className="mt-4 font-display text-4xl tracking-tight md:text-6xl">{r.name}</h1>
            <p className="mt-2 text-lg text-fg-muted">
              {r.location.town}, {r.location.region}, {r.location.country}
            </p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-sm text-fg-muted">Guide price</div>
            <div className="font-display text-4xl text-fg tnum md:text-5xl">
              {formatPrice(r.price, r.currency)}
            </div>
          </div>
        </header>

        {/* Gallery */}
        <div className="container-x">
          <PropertyGallery images={r.gallery} name={r.name} />
        </div>

        {/* Body + sticky inquiry */}
        <div className="container-x mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <article className="lg:col-span-2">
            {/* Specs */}
            <div className="grid grid-cols-2 gap-y-6 border-y border-border py-8 md:grid-cols-4">
              <Spec icon="bed" label="Bedrooms" value={String(r.beds)} />
              <Spec icon="bath" label="Bathrooms" value={String(r.baths)} />
              <Spec icon="area" label="Interior" value={formatArea(r.interiorArea)} />
              <Spec icon="plot" label="Plot" value={formatArea(r.plotArea)} />
            </div>

            {/* Overview */}
            <h2 className="mt-12 font-display text-3xl tracking-tight">Overview</h2>
            <p className="mt-3 text-lg italic text-fg-muted">{r.tagline}</p>
            <div className="mt-6 space-y-5 text-[17px] leading-relaxed text-fg-muted">
              {r.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Features */}
            <h2 className="mt-12 font-display text-3xl tracking-tight">Features of note</h2>
            <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
              {r.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-fg">
                  <svg viewBox="0 0 24 24" className="mt-1 h-4 w-4 flex-shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            {/* Architect */}
            <h2 className="mt-12 font-display text-3xl tracking-tight">Architect</h2>
            <div className="mt-4 flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-fg">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M3 21l9-18 9 18M7 17h10" />
                </svg>
              </div>
              <div>
                <div className="font-medium">{r.architect.name}</div>
                <div className="text-sm text-fg-muted">
                  {r.architect.studio ?? "—"} · Completed {r.architect.year}
                </div>
              </div>
            </div>

            {/* Location */}
            <h2 className="mt-12 font-display text-3xl tracking-tight">Location</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-border">
              <div className="relative aspect-[16/9] bg-brand-soft">
                <iframe
                  title={`Map of ${r.name}`}
                  loading="lazy"
                  className="h-full w-full"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${r.location.lng - 0.05},${r.location.lat - 0.03},${r.location.lng + 0.05},${r.location.lat + 0.03}&marker=${r.location.lat},${r.location.lng}&layer=mapnik`}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4 text-sm">
                <div className="text-fg">
                  {r.location.town}, {r.location.country}
                </div>
                <div className="text-fg-muted tnum">{formatCoords(r.location.lat, r.location.lng)}</div>
              </div>
            </div>
          </article>

          {/* Sticky inquiry */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-[88px]">
              <InquiryPanel residenceName={r.name} residenceSlug={r.slug} agent={agent} />
            </div>
          </aside>
        </div>

        {/* Mortgage */}
        <div className="container-x mt-20">
          <MortgageCalc price={r.price} currency={r.currency} />
        </div>

        {/* Similar */}
        <section className="container-x mt-24">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-brand">
                Also in this portfolio
              </span>
              <h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">Similar residences</h2>
            </div>
            <Link href="/residences" className="btn btn-secondary">View all</Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => (
              <PropertyCard key={s.slug} r={s} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Spec({ icon, label, value }: { icon: "bed" | "bath" | "area" | "plot"; label: string; value: string }) {
  const paths = {
    bed: "M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 14h18M7 9V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2",
    bath: "M4 11h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3ZM7 11V6a2 2 0 0 1 4 0v1M5 18l-1 3M19 18l1 3",
    area: "M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6",
    plot: "M3 12h18M12 3v18",
  } as const;
  return (
    <div className="flex items-start gap-3">
      <svg viewBox="0 0 24 24" className="mt-1 h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d={paths[icon]} />
      </svg>
      <div>
        <div className="text-xs uppercase tracking-wider text-fg-subtle">{label}</div>
        <div className="mt-1 font-display text-xl text-fg tnum">{value}</div>
      </div>
    </div>
  );
}
