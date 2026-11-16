import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import PropertyGallery from "@/components/PropertyGallery";
import MortgageCalc from "@/components/MortgageCalc";
import InquiryPanel from "@/components/InquiryPanel";
import DetailActions from "@/components/DetailActions";
import Icon from "@/components/Icon";
import VideoTour from "@/components/VideoTour";
import InspectionScheduler from "@/components/InspectionScheduler";
import { getResidence, listResidences } from "@/lib/residences";
import { isLand, isRent, moveInBreakdown, specLine } from "@/lib/listing";
import { getAgent } from "@/lib/agents";
import { formatArea, formatCoords, formatPrice } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

// Each residence gets its own browser-tab title and search snippet
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const r = await getResidence(slug);
  if (!r) return { title: "Residence not found, Haven Properties" };
  return {
    title: `${r.name}, ${r.location.town}, Haven Properties`,
    description: r.tagline || r.abstract,
  };
}

export default async function ResidencePage({ params }: Props) {
  const { slug } = await params;
  const r = await getResidence(slug);
  if (!r) return notFound();

  const agent = getAgent(r.agentSlug);
  const all = await listResidences();
  // Comparables: same region first, then anything else, three in total
  const others = all.filter((x) => x.slug !== r.slug);
  const similar = [
    ...others.filter((x) => x.location.region === r.location.region),
    ...others.filter((x) => x.location.region !== r.location.region),
  ].slice(0, 3);

  const place = [r.location.town, r.location.region, r.location.country].filter(Boolean).join(", ");
  const perSqm = r.interiorArea ? Math.round(r.price / r.interiorArea) : null;

  const land = isLand(r);
  const rent = isRent(r);
  const moveIn = moveInBreakdown(r); // only used for rentals
  // Spec grid: the custom ledger if the listing has one, otherwise a sensible default
  const matrix =
    r.ledger?.length
      ? r.ledger.map((l) => ({ k: l.label, v: l.value, sub: l.note ?? "" }))
      : land
        ? [
            { k: "Plot size", v: formatArea(r.plotArea), sub: "Surveyed land area" },
            { k: "Tenure", v: r.tenure, sub: "Title held" },
            { k: "Status", v: r.status, sub: r.issueNumber },
            { k: "Use", v: "Land", sub: r.location.town },
          ]
        : [
            { k: "Bedrooms", v: String(r.beds), sub: r.type },
            { k: "Bathrooms", v: String(r.baths), sub: `${r.receptionRooms} reception rooms` },
            { k: "Interior area", v: formatArea(r.interiorArea), sub: "Net enclosed floor" },
            { k: "Plot", v: r.plotArea ? formatArea(r.plotArea) : "n/a", sub: "Total land holding" },
            { k: "Tenure", v: r.tenure, sub: "Title held" },
            { k: "Pool", v: r.pool ? "Yes" : "No", sub: r.pool ? "Private" : "None on site" },
            { k: "Completed", v: String(r.architect.year), sub: r.architect.name },
            { k: "Status", v: r.status, sub: r.issueNumber },
          ];
  const ledgerMode = !!r.ledger?.length; // ledger rows have longer text, so use a roomier grid

  const osm = `https://www.openstreetmap.org/export/embed.html?bbox=${r.location.lng - 0.05},${r.location.lat - 0.03},${r.location.lng + 0.05},${r.location.lat + 0.03}&marker=${r.location.lat},${r.location.lng}&layer=mapnik`;

  // Optional extras: each section renders only when filled in admin
  const titleDocs = r.titleDocs ?? [];
  const faqs = r.faqs ?? [];
  const nearby = r.nearby ?? [];
  const plans = r.paymentPlans ?? [];
  const fees = r.fees ?? [];
  const hasAuthority = titleDocs.some((d) => d.authority);
  const lowestMonthly = Math.min(...plans.map((p) => p.monthly ?? Infinity));

  // Number chapters by what's actually on the page, so they never skip
  const chapterOrder = [
    "spec",
    titleDocs.length ? "title" : null,
    "story",
    r.videoUrl ? "tour" : null,
    plans.length || fees.length ? "plans" : null,
    land || rent ? null : "payment", // no mortgage modelling for raw land or rentals
    faqs.length ? "faq" : null,
    r.features?.length ? "register" : null,
    "location",
  ].filter(Boolean) as string[];
  const ch = (key: string) => `Dossier chapter ${String(chapterOrder.indexOf(key) + 1).padStart(2, "0")}`;

  return (
    <>
      <Nav />
      <main className="pt-20">
        {/* ============ DOSSIER META STRIP ============ */}
        <div className="border-b border-border bg-fg text-bg">
          <div className="container-x flex flex-wrap items-center justify-between gap-2 py-2 text-[11px] font-semibold uppercase leading-[14px] tracking-[0.08em]">
            <span className="text-bg/80">
              Private treaty · {r.location.region} · Ref {r.issueNumber}
            </span>
            {titleDocs.length > 0 && (
              <span className="flex items-center gap-1.5 text-[#9ed1bd]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#9ed1bd]" />
                Title documents on file
              </span>
            )}
          </div>
        </div>

        {/* ============ BREADCRUMB ============ */}
        <div className="border-b border-border">
          <nav aria-label="Breadcrumb" className="container-x flex flex-wrap items-center gap-2 py-3 text-[12px] font-medium tracking-[0.06em] text-fg-muted">
            <Link href="/" className="hover:text-brand">Home</Link>
            <span className="text-border">/</span>
            <Link href="/residences" className="hover:text-brand">Residences</Link>
            <span className="text-border">/</span>
            <Link href={`/residences?region=${encodeURIComponent(r.location.region)}`} className="hover:text-brand">
              {r.location.region}
            </Link>
            <span className="text-border">/</span>
            <span className="font-semibold text-fg">{r.name}</span>
          </nav>
        </div>

        {/* ============ MASTHEAD ============ */}
        <section className="container-x flex flex-col justify-between gap-5 pb-5 pt-10 lg:flex-row lg:items-end">
          <div className="max-w-4xl">
            {/* Max two badges, per the design system. Green "Verified" only when title docs exist */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {titleDocs.length > 0 ? (
                <span className="badge badge-verified">
                  <Icon name="verified" className="h-3.5 w-3.5" />
                  Verified title
                </span>
              ) : (
                <span className="badge">{rent ? "For rent" : r.tenure}</span>
              )}
              <span className="badge">{r.status}</span>
              <span className="eyebrow">{r.issueNumber}</span>
            </div>
            <h1 className="display-lg">{r.name}</h1>
            {r.tagline && <p className="pt-1 font-display text-[22px] italic leading-[30px] text-fg-muted">{r.tagline}</p>}
            <p className="flex flex-wrap items-center gap-1.5 pt-3 text-fg-muted">
              <Icon name="pin" className="h-4 w-4 text-brand" />
              {place}
              <span className="text-border">•</span>
              <a href="#location" className="link-editorial text-[13px]">View on map</a>
            </p>
          </div>
          <DetailActions slug={r.slug} name={r.name} />
        </section>

        {/* ============ GALLERY ============ */}
        <section className="container-x">
          <PropertyGallery
            images={r.gallery?.length ? r.gallery : [r.cover]}
            name={r.name}
            videoHref={r.videoUrl ? "#tour" : undefined}
          />
        </section>

        {/* ============ TWO-COLUMN DOSSIER ============ */}
        <div className="container-x grid grid-cols-1 items-start gap-10 py-[4.5rem] lg:grid-cols-12">
          {/* ---------- LEFT: the dossier ---------- */}
          <div className="min-w-0 space-y-[4.5rem] lg:col-span-7">
            {/* Specifications */}
            <section>
              <Chapter label={ch("spec")} title={land || ledgerMode ? "Technical ledger" : "Residence specifications"} />
              <dl className={`grid border-t border-border ${ledgerMode ? "grid-cols-1 sm:grid-cols-2 sm:gap-x-8" : "grid-cols-2 sm:grid-cols-4"}`}>
                {matrix.map((m) => (
                  <div key={m.k} className="border-b border-border py-4 pr-3">
                    <dt className="eyebrow">{m.k}</dt>
                    <dd className="pt-1 font-display text-[22px] leading-7">{m.v}</dd>
                    {m.sub && <dd className={`text-[12px] text-fg-muted ${ledgerMode ? "leading-[18px]" : "truncate"}`}>{m.sub}</dd>}
                  </div>
                ))}
              </dl>
            </section>

            {/* Title verification (optional) */}
            {titleDocs.length > 0 && (
              <section id="title" className="scroll-mt-24 rounded-lg border border-border bg-surface p-5 md:p-8">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <Chapter label={ch("title")} title="Title verification & conveyance" />
                  <span className="badge badge-verified shrink-0">
                    <Icon name="verified" className="h-3.5 w-3.5" />
                    {titleDocs.length} document{titleDocs.length === 1 ? "" : "s"} checked
                  </span>
                </div>
                {/* Audit ledger: a 3-column table when any row names its issuing authority */}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] border-y border-border text-left">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="eyebrow py-2 pr-4 font-semibold">Instrument</th>
                        {hasAuthority && <th className="eyebrow py-2 pr-4 font-semibold">Issuing authority</th>}
                        <th className="eyebrow py-2 text-right font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {titleDocs.map((d) => (
                        <tr key={d.name} className="align-top">
                          <td className="py-3 pr-4">
                            <p className="font-medium">{d.name}</p>
                            {d.detail && <p className="text-[12px] leading-[18px] text-fg-muted">{d.detail}</p>}
                          </td>
                          {hasAuthority && <td className="py-3 pr-4 text-[13px] leading-5 text-fg-muted">{d.authority}</td>}
                          <td className="py-3 text-right">
                            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.04em] text-verified">
                              <Icon name="check" className="h-4 w-4" strokeWidth={2} />
                              {d.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-5 flex flex-col justify-between gap-3 rounded border border-border bg-bg p-4 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3">
                    <Icon name="doc" className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                    <div>
                      <p className="text-[14px] font-semibold tracking-[0.02em]">Legal title pack</p>
                      <p className="text-[12px] leading-[18px] text-fg-muted">
                        Certified copies of the documents above, plus a non-encumbrance search.
                      </p>
                    </div>
                  </div>
                  <a href="#book-legal" className="btn btn-primary shrink-0 !px-5 !py-2 text-[12px]">Request legal pack</a>
                </div>
              </section>
            )}

            {/* Land: mandatory due-diligence advisory */}
            {land && (
              <aside className="flex gap-3 rounded-lg border border-brand/30 bg-brand-soft p-5">
                <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <span className="eyebrow block !text-brand">Legal due-diligence advisory</span>
                  <p className="pt-1 text-[14px] leading-6 text-fg">
                    Always verify land documents with an accredited property lawyer before signing or sending money.
                    Never pay purchase money into a personal account. We hold client funds in escrow until the
                    conveyance and beacon handover are complete.
                  </p>
                </div>
              </aside>
            )}

            {/* Monograph */}
            <article>
              <Chapter label={ch("story")} title={`Monograph: ${r.name}`} />
              {r.abstract && <p className="pb-5 text-[18px] leading-7 text-fg">{r.abstract}</p>}
              <div className="space-y-4 text-fg-muted">
                {r.body?.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              {r.architect?.name && (
                <div className="mt-10 flex gap-4 rounded-lg border border-border bg-surface p-5">
                  <Icon name="compass" className="h-6 w-6 shrink-0 text-brand" />
                  <div>
                    <h3 className="headline-sm">Architectural pedigree</h3>
                    <p className="pt-1 text-[13px] leading-5 text-fg-muted">
                      Designed by {r.architect.name}
                      {r.architect.studio ? `, ${r.architect.studio}` : ""}, completed in {r.architect.year}.
                    </p>
                  </div>
                </div>
              )}
            </article>

            {/* Video tour (optional) */}
            {r.videoUrl && (
              <section id="tour" className="scroll-mt-24">
                <Chapter label={ch("tour")} title="Cinematic tour" />
                <VideoTour url={r.videoUrl} poster={r.cover} title={r.name} />
              </section>
            )}

            {/* Payment structures */}
            {/* Vendor payment schedule + statutory fees (optional) */}
            {(plans.length > 0 || fees.length > 0) && (
              <section>
                <Chapter label={ch("plans")} title="Payment schedule" />
                {plans.length > 0 && (
                  <>
                    <p className="-mt-2 pb-5 text-fg-muted">The vendor&apos;s acquisition terms, secured by legal contract.</p>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[560px] border-y border-border text-left text-[13px] leading-5">
                        <thead>
                          <tr className="border-b border-border">
                            {["Tenor", "Initial deposit", "Monthly", "Total", "Handover"].map((h) => (
                              <th key={h} className="eyebrow py-2 pr-4 font-semibold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {plans.map((p, i) => {
                            const pct = p.total ? Math.round((p.deposit / p.total) * 1000) / 10 : 0;
                            return (
                              <tr key={p.tenor} className={i === 0 ? "bg-sand/40" : ""}>
                                <td className="py-3 pr-4 font-semibold">{p.tenor}</td>
                                <td className="py-3 pr-4 tnum">
                                  {formatPrice(p.deposit, r.currency)} <span className="text-fg-muted">({pct}%)</span>
                                </td>
                                <td className="py-3 pr-4 tnum">{p.monthly ? `${formatPrice(p.monthly, r.currency)} / mo` : "n/a"}</td>
                                <td className="py-3 pr-4 font-display text-[16px] font-medium text-brand tnum">{formatPrice(p.total, r.currency)}</td>
                                <td className="py-3 text-fg-muted">{p.handover}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
                {fees.length > 0 && (
                  <div className="mt-5 rounded-lg border border-border bg-surface p-5">
                    <span className="eyebrow block pb-3">Statutory & conveyance fees</span>
                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {fees.map((f) => (
                        <div key={f.label}>
                          <dt className="text-[13px] font-medium">{f.label}</dt>
                          <dd className="font-display text-[20px] text-brand tnum">{formatPrice(f.amount, r.currency)}</dd>
                          {f.note && <dd className="text-[12px] leading-[18px] text-fg-muted">{f.note}</dd>}
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </section>
            )}

            {!land && !rent && <MortgageCalc price={r.price} currency={r.currency} label={ch("payment")} />}

            {/* Questions before conveyance (optional) */}
            {faqs.length > 0 && (
              <section>
                <Chapter label={ch("faq")} title="Questions to ask before conveyance" />
                <p className="-mt-2 pb-5 text-fg-muted">
                  Our legal desk has answered the questions that matter most for this residence.
                </p>
                <ol className="divide-y divide-border border-y border-border">
                  {faqs.map((f, i) => (
                    <li key={f.q} className="grid grid-cols-[40px_1fr] gap-3 py-5">
                      <span className="headline-sm text-brand">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <h3 className="font-display text-[19px] font-medium leading-snug">{f.q}</h3>
                        <p className="pt-1.5 text-[14px] leading-6 text-fg-muted">{f.a}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Specification register */}
            {r.features?.length > 0 && (
              <section>
                <Chapter label={ch("register")} title="Specification register" />
                <ul className="grid grid-cols-1 border-t border-border sm:grid-cols-2 sm:gap-x-10">
                  {r.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 border-b border-border py-3">
                      <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Environs + map */}
            <section id="location" className="scroll-mt-24">
              <Chapter label={ch("location")} title={`Environs: ${r.location.town}`} />
              {nearby.length > 0 && (
                <ul className="mb-5 grid grid-cols-2 border-l border-t border-border sm:grid-cols-4">
                  {nearby.map((n) => (
                    <li key={n.place} className="border-b border-r border-border p-4">
                      <span className="block font-display text-[26px] leading-8 text-brand tnum">
                        {n.minutes} <span className="text-[15px]">min{n.minutes === 1 ? "" : "s"}</span>
                      </span>
                      <span className="eyebrow block pt-1 !text-fg-muted">{n.place}</span>
                      {n.note && <span className="block pt-0.5 text-[12px] leading-[18px] text-fg-subtle">{n.note}</span>}
                    </li>
                  ))}
                </ul>
              )}
              <div className="relative overflow-hidden rounded-lg border border-border">
                <iframe title={`Map of ${r.name}`} loading="lazy" src={osm} className="block aspect-[16/10] w-full grayscale-[35%] sepia-[15%]" />
                <div className="absolute left-3 top-3 max-w-[260px] rounded-lg border border-border bg-bg p-3">
                  <span className="eyebrow block">Coordinates</span>
                  <p className="font-display text-[17px] leading-6 tnum">{formatCoords(r.location.lat, r.location.lng)}</p>
                  <p className="text-[12px] text-fg-muted">{place}</p>
                </div>
              </div>
            </section>
          </div>

          {/* ---------- RIGHT: acquisition console (sticky) ---------- */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:col-span-5">
            <div className="rounded-lg border border-border bg-surface p-5">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow">{rent ? "Annual rent" : land ? "Outright acquisition" : "Guide price"}</span>
                <span className="eyebrow">{rent ? "For rent" : r.tenure}</span>
              </div>
              <p className="pt-1 font-display text-[40px] font-medium leading-[44px] tracking-[-0.02em] text-brand">
                {formatPrice(r.price, r.currency)}
                {rent && <span className="pl-1 font-sans text-[13px] font-normal tracking-normal text-fg-muted">/ year</span>}
                {land && r.plotArea > 0 && (
                  <span className="pl-1 font-sans text-[13px] font-normal tracking-normal text-fg-muted">/ {formatArea(r.plotArea)}</span>
                )}
              </p>
              {Number.isFinite(lowestMonthly) && (
                <p className="pt-1 text-[13px] font-medium text-verified">
                  Instalment plans from {formatPrice(lowestMonthly, r.currency)} / month
                </p>
              )}
              <dl className="mt-4 space-y-2 border-t border-border pt-4 text-[13px] leading-5">
                {rent ? (
                  /* Rentals: what the tenant pays before moving in */
                  <>
                    {moveIn.rows.map((row) => <Row key={row.label} k={row.label} v={formatPrice(row.amount, r.currency)} />)}
                    <div className="flex items-baseline justify-between gap-4 border-t border-border pt-2">
                      <dt className="font-display text-[17px]">Move-in total</dt>
                      <dd className="font-display text-[20px] font-medium text-brand tnum">{formatPrice(moveIn.total, r.currency)}</dd>
                    </div>
                  </>
                ) : land ? (
                  <>
                    {r.plotArea > 0 && <Row k="Price per m²" v={formatPrice(Math.round(r.price / r.plotArea), r.currency)} />}
                    <Row k="Plot" v={formatArea(r.plotArea)} />
                    <Row k="Title" v={titleDocs[0]?.name ?? r.tenure} />
                  </>
                ) : (
                  <>
                    {perSqm && <Row k="Price per m² (interior)" v={formatPrice(perSqm, r.currency)} />}
                    <Row k="Interior" v={formatArea(r.interiorArea)} />
                    {r.plotArea > 0 && <Row k="Plot" v={formatArea(r.plotArea)} />}
                    <Row k="Bedrooms / bathrooms" v={`${r.beds} / ${r.baths}`} />
                  </>
                )}
              </dl>
              <a href="#schedule" className="btn btn-primary mt-5 w-full">
                <Icon name="calendar" className="h-4 w-4" />
                {land ? "Book site inspection" : "Schedule inspection"}
              </a>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <a href="#book-offer" className="btn btn-secondary !px-4 text-[12px]">Make a price offer</a>
                <a href="#book-legal" className="btn btn-secondary !px-4 text-[12px]">Request legal pack</a>
              </div>
            </div>

            <InquiryPanel residenceName={r.name} residenceSlug={r.slug} agent={agent} land={land} />
          </aside>
        </div>

        {/* ============ COMPARABLES ============ */}
        {similar.length > 0 && (
          <section className="border-t border-border bg-surface py-[4.5rem]">
            <div className="container-x">
              <div className="flex flex-col justify-between gap-3 pb-10 md:flex-row md:items-end">
                <div>
                  <span className="eyebrow !text-brand tracking-widest">Portfolio curation</span>
                  <h2 className="headline-lg pt-1">Comparable residences</h2>
                </div>
                <Link href="/residences" className="link-editorial text-[12px] font-medium tracking-[0.06em]">
                  Explore all residences
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                {similar.map((s) => <PropertyCard key={s.slug} r={s} />)}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Inspection booking modal, opened by any link to #schedule */}
      <InspectionScheduler
        land={land}
        residence={{
          slug: r.slug,
          name: r.name,
          place,
          region: r.location.region,
          cover: r.cover,
          priceLabel: formatPrice(r.price, r.currency) + (rent ? " / yr" : ""),
          chips: [
            specLine(r).slice(0, 2).join(" · "),
            titleDocs[0]?.name ?? r.tenure,
            r.features?.[0],
          ].filter(Boolean) as string[],
        }}
        agent={
          agent && {
            name: agent.name,
            role: agent.role,
            initials: agent.initials,
            photo: agent.photo,
            accreditation: agent.accreditation,
            letter: agent.letter,
          }
        }
      />
      <Footer />
    </>
  );
}

/* Chapter heading: "Dossier chapter 03" eyebrow + serif title */
function Chapter({ label, title }: { label: string; title: string }) {
  return (
    <div className="pb-5">
      <span className="eyebrow !text-brand tracking-widest">{label}</span>
      <h2 className="headline-md pt-1">{title}</h2>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-fg-muted">{k}</dt>
      <dd className="font-medium tnum">{v}</dd>
    </div>
  );
}
