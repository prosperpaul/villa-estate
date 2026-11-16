import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import Icon from "@/components/Icon";
import { listResidences } from "@/lib/residences";
import { agents } from "@/lib/agents";

/* ------------------------------------------------------------------
   Editorial content. These sections don't come from the database yet,
   so their copy lives here. Edit freely.
   ------------------------------------------------------------------ */

const corridors = [
  "Lekki", "Ikoyi", "Victoria Island", "Ajah", "Ikeja GRA",
  "Yaba", "Maitama", "Gwarinpa", "Wuse II", "GRA Port Harcourt",
];

const standards = [
  {
    title: "Verified listings only",
    tag: "Physical ground audit",
    body: "Every property is physically inspected on the ground and document-checked at the relevant state registry, Lagos Lands Bureau, FCDA Abuja or the Rivers State Ministry of Physical Planning, before it is published.",
  },
  {
    title: "Honest, uninflated pricing",
    tag: "No hidden markups",
    body: "No inflated markups, no ghost caution fees, and clear disclosure of service charges and statutory tenancy costs upfront. You pay what the owner or developer asks, nothing more.",
  },
  {
    title: "Escorted inspection support",
    tag: "On-ground officers",
    body: "Licensed Haven officers escort your in-person viewings, or host live video walkthroughs for diaspora clients in the UK, US and Canada.",
  },
  {
    title: "Scam protection & escrow",
    tag: "Custodial banking",
    body: "Your deposit and rent stay in escrow until the tenancy agreement is stamped, covenants are verified, and the keys are in your hands.",
  },
];

const cities = [
  { name: "Lagos", tag: "Centre of commerce", image: "/haven/city-lagos.jpg" },
  { name: "Abuja", tag: "Federal capital", image: "/haven/city-abuja.jpg" },
  { name: "Port Harcourt", tag: "Rivers State", image: "/haven/city-port-harcourt.jpg" },
  { name: "Ibadan", tag: "Oyo heritage", image: "/haven/city-ibadan.jpg" },
  { name: "Enugu", tag: "Coal City", image: "/haven/city-enugu.jpg" },
  { name: "Kano", tag: "Northern commerce", image: "/haven/city-kano.jpg" },
];

const plots = [
  {
    name: "Pan-Atlantic Corridor, Ibeju-Lekki",
    price: "₦35,000,000",
    size: "600 sqm",
    badge: "Dry land · Surveyed",
    image: "/haven/land-ibeju-lekki.jpg",
    rows: [
      ["Title", "Certificate of Occupancy"],
      ["Payment", "6 months, 0% interest"],
      ["Topography", "Dry, ready to build"],
    ],
    area: "Lekki Free Zone axis",
  },
  {
    name: "Idu Industrial Layout, Abuja",
    price: "₦85,000,000",
    size: "900 sqm",
    badge: "Commercial corner plot",
    image: "/haven/land-idu-abuja.jpg",
    rows: [
      ["Title", "FCDA Allocation & R of O"],
      ["Payment", "Outright, 5% discount"],
      ["Zoning", "Commercial / light industrial"],
    ],
    area: "Abuja FCT central hub",
  },
  {
    name: "Moniya, Iseyin Expressway, Ibadan",
    price: "₦16,000,000",
    size: "450 sqm",
    badge: "High growth area",
    image: "/haven/land-moniya-ibadan.jpg",
    rows: [
      ["Title", "Registered Survey & Gov. Consent"],
      ["Payment", "12-month flexible plan"],
      ["Access", "Direct expressway link"],
    ],
    area: "Near Ibadan train terminal",
  },
];

const testimonials = [
  {
    quote: "Haven took all the heartbreak out of renting in Lagos. We found our Lekki 3-bed in three days, with complete peace of mind.",
    name: "Engr. Tunde Adeleke",
    role: "Tenant, Lekki Phase 1, Lagos",
  },
  {
    quote: "Relocating from London to Abuja was stress-free. Haven did live video walkthroughs of our Maitama duplex and handled the legal paperwork cleanly.",
    name: "Dr. Amina Yusuf-Bello",
    role: "Diaspora buyer, Maitama, Abuja",
  },
  {
    quote: "Sold two commercial plots in Port Harcourt within three weeks, without a single ghost buyer. Serious, vetted buyers only.",
    name: "Barr. Kenneth Nwachukwu",
    role: "Land owner, Trans-Amadi, Rivers State",
  },
];

const metrics = [
  { n: "7.4 days", label: "Average lease execution time" },
  { n: "<0.2%", label: "Tenant default rate across portfolio" },
  { n: "100%", label: "Escrowed upfront rental security" },
];

// Lays out the 6 featured listings like the design:
// row 1 = 7 + 5 columns, row 2 = 4 + 4 + 4, row 3 = one full-width strip.
const featuredLayout = [
  { span: "lg:col-span-7", variant: "lead" },
  { span: "lg:col-span-5", variant: "standard" },
  { span: "lg:col-span-4", variant: "standard" },
  { span: "lg:col-span-4", variant: "standard" },
  { span: "lg:col-span-4", variant: "standard" },
  { span: "lg:col-span-12", variant: "wide" },
] as const;

export default async function Home() {
  const residences = await listResidences();
  const featured = residences.slice(0, featuredLayout.length);
  // Unique regions from the real data, for the search dropdown
  const regions = [...new Set(residences.map((r) => r.location.region).filter(Boolean))];

  return (
    <>
      <Nav />

      <main className="pt-20">
        {/* Adire accent line: terracotta and forest diagonals */}
        <div
          aria-hidden
          className="h-1.5 w-full opacity-60"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #b5471f 0 3px, transparent 3px 12px), repeating-linear-gradient(-45deg, #1b4d3e 0 3px, transparent 3px 12px)",
          }}
        />

        {/* ============ 1. HERO ============ */}
        <section className="border-b border-border pb-10 pt-10 lg:pt-[4.5rem]">
          <div className="container-x">
            <div className="flex flex-wrap items-center justify-between gap-1.5 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-verified" />
                <span className="eyebrow tracking-widest">
                  Verified Nigerian realty · Lagos · Abuja · Port Harcourt · Ibadan
                </span>
              </div>
              <div className="hidden items-center gap-1.5 text-[12px] tracking-[0.06em] text-fg-muted sm:flex">
                <Icon name="shield" className="h-4 w-4 text-verified" />
                Escrow protected transactions
              </div>
            </div>

            <div className="max-w-4xl pt-1.5">
              <h1 className="display-lg lg:!text-[68px] lg:!leading-[74px]">
                Find a home you can trust, anywhere in Nigeria.
              </h1>
              <p className="max-w-2xl pt-3 text-[18px] leading-7 text-fg-muted">
                The verified property journal for discerning buyers and renters. Legal certainty,
                no ghost caution fees, and physically vetted deeds across West Africa&apos;s most
                sought-after addresses.
              </p>
            </div>

            <div className="mt-5">
              <SearchBar regions={regions} listingCount={residences.length} />
            </div>

            <div className="group relative mt-5 h-[380px] overflow-hidden rounded-lg border border-border sm:h-[480px] lg:h-[560px]">
              <Image
                src="/haven/hero.jpg"
                alt="Modern tropical villa with timber louvres and royal palms, Banana Island, Ikoyi"
                fill
                priority
                sizes="(min-width:1400px) 1272px, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-fg/70 via-transparent to-transparent" />
              <div className="absolute inset-x-4 bottom-4 flex flex-col justify-between gap-1.5 sm:inset-x-6 sm:bottom-6 sm:flex-row sm:items-end">
                <div className="max-w-lg rounded-lg border border-border bg-bg p-3 sm:px-4 sm:py-2.5">
                  <span className="eyebrow !text-brand">Featured commission</span>
                  <p className="headline-sm pt-0.5 leading-tight">Private Residence, Banana Island, Ikoyi</p>
                  <p className="text-[13px] leading-5 text-fg-muted">
                    Direct C of O with Governor&apos;s Consent
                  </p>
                </div>
                <div className="hidden items-center gap-2 rounded-full border border-border bg-bg px-4 py-2 text-[12px] font-medium tracking-[0.06em] md:flex">
                  <span className="h-2 w-2 rounded-full bg-verified" />
                  Available for private acquisition
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 2. KEY CORRIDORS ============ */}
        <section className="border-b border-border bg-surface py-3">
          <div className="container-x flex flex-col justify-between gap-1.5 md:flex-row md:items-center">
            <span className="eyebrow shrink-0 tracking-widest">Key corridors</span>
            <div className="flex items-center divide-x divide-border overflow-x-auto text-[13px] font-medium text-fg-muted [scrollbar-width:none]">
              {corridors.map((c) => (
                <Link
                  key={c}
                  href={`/residences?region=${encodeURIComponent(c)}`}
                  className="shrink-0 px-3 py-1 transition-colors hover:text-brand"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 3. FEATURED RESIDENCES (real data) ============ */}
        <section className="border-b border-border py-[4.5rem]">
          <div className="container-x">
            <SectionHead
              eyebrow="Curated real estate"
              title="Handpicked residences"
              body="Every home in this dossier carries a validated survey, clean registry records and our direct oversight."
              aside={
                <Link href="/residences" className="link-editorial text-[12px] font-medium tracking-[0.06em]">
                  View all {residences.length} residences
                </Link>
              }
              divided
            />

            {featured.length === 0 ? (
              <p className="pt-10 text-fg-muted">No residences published yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-10 pt-10 lg:grid-cols-12">
                {featured.map((r, i) => (
                  <div key={r.slug} className={featuredLayout[i].span}>
                    <PropertyCard r={r} variant={featuredLayout[i].variant} priority={i < 2} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ============ 4. THE HAVEN STANDARD ============ */}
        <section className="border-b border-border bg-surface py-[4.5rem]">
          <div className="container-x">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow !text-brand tracking-widest">Our governance</span>
              <h2 className="headline-lg pt-1">The Haven Standard</h2>
              <p className="pt-2 text-[18px] leading-7 text-fg-muted">
                Property in Nigeria should bring pride, not anxiety. Here is how we protect buyers,
                renters and the diaspora.
              </p>
            </div>

            <ol className="divide-y divide-border border-y border-border">
              {standards.map((s, i) => (
                <li key={s.title} className="group grid grid-cols-1 items-baseline gap-3 py-5 md:grid-cols-12">
                  <div className="headline-md text-brand md:col-span-1">{String(i + 1).padStart(2, "0")}</div>
                  <div className="md:col-span-4">
                    <h3 className="headline-sm transition-colors group-hover:text-brand">{s.title}</h3>
                    <span className="eyebrow">{s.tag}</span>
                  </div>
                  <p className="leading-relaxed text-fg-muted md:col-span-7">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ============ 5. BROWSE BY CITY ============ */}
        <section className="border-b border-border py-[4.5rem]">
          <div className="container-x">
            <SectionHead
              eyebrow="Where we work"
              title="Curated markets across Nigeria"
              aside={
                <Link href="/residences" className="flex items-center gap-1 text-[12px] font-medium tracking-[0.06em] text-brand hover:underline hover:underline-offset-4">
                  Explore all locations <Icon name="arrow" />
                </Link>
              }
            />
            <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {cities.map((c) => (
                <Link
                  key={c.name}
                  href={`/residences?region=${encodeURIComponent(c.name)}`}
                  className="group relative flex h-80 flex-col justify-end overflow-hidden rounded-lg border border-border p-4"
                >
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(min-width:1024px) 16vw, (min-width:768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-fg/90 via-fg/30 to-transparent" />
                  <div className="relative text-bg">
                    <span className="block text-[11px] font-semibold uppercase leading-[14px] tracking-widest text-[#ffb59d]">
                      {c.tag}
                    </span>
                    <h3 className="headline-sm">{c.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 6. LAND & TITLED PLOTS ============ */}
        <section className="border-b border-border bg-surface py-[4.5rem]">
          <div className="container-x">
            <SectionHead
              eyebrow="Titled land"
              title="Verified land & titled plots"
              body="No Omo-Onile interference. Every plot is checked against state gazettes, acquisition exclusions and active beacon numbers."
              aside={
                <Link href="/residences" className="btn btn-secondary !px-5 !py-2.5">
                  Search all land <Icon name="arrow" />
                </Link>
              }
            />
            <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3">
              {plots.map((p) => (
                <article key={p.name} className="flex flex-col justify-between rounded-lg border border-border bg-bg p-3">
                  <div className="relative mb-3 h-56 overflow-hidden rounded">
                    <Image src={p.image} alt={p.name} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
                    <span className="badge absolute left-3 top-3">{p.badge}</span>
                  </div>
                  <div className="flex flex-grow flex-col gap-1.5">
                    <div className="flex items-baseline justify-between">
                      <span className="price-display text-brand">{p.price}</span>
                      <span className="eyebrow">{p.size}</span>
                    </div>
                    <h3 className="headline-sm">{p.name}</h3>
                    <dl className="space-y-1.5 border-y border-border py-1.5 text-[13px] leading-5 text-fg-muted">
                      {p.rows.map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-4">
                          <dt>{k}</dt>
                          <dd className={`text-right ${k === "Title" ? "font-semibold text-fg" : "text-fg"}`}>{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div className="flex items-center justify-between pt-3">
                    <span className="text-xs text-fg-muted">{p.area}</span>
                    <span className="flex items-center gap-1 text-[12px] font-semibold tracking-[0.06em] text-brand">
                      Survey dossier <Icon name="arrow" className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 7. AGENTS (real data) ============ */}
        <section className="border-b border-border py-[4.5rem]">
          <div className="container-x">
            <SectionHead
              eyebrow="On-ground representation"
              title="Vetted neighbourhood partners"
              body="Every Haven partner has passed our background clearance and holds an active licence. No gatekeeping fees."
              aside={
                <Link href="/agents" className="link-editorial text-[12px] font-medium tracking-[0.06em]">
                  Meet all agents
                </Link>
              }
            />
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {agents.slice(0, 4).map((a) => {
                const count = residences.filter((r) => r.agentSlug === a.slug).length;
                const wa = a.phone.replace(/\D/g, ""); // WhatsApp links need digits only
                return (
                  <div key={a.slug} className="flex flex-col justify-between rounded-lg border border-border bg-surface p-3">
                    <Link href={`/agents/${a.slug}`} className="group flex items-center gap-3">
                      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border bg-sand font-display text-xl text-fg">
                        {a.initials}
                      </span>
                      <div>
                        <h3 className="headline-sm leading-tight transition-colors group-hover:text-brand">{a.name}</h3>
                        <p className="text-[13px] leading-5 text-fg-muted">{a.role}, {a.basedIn}</p>
                        <p className="pt-0.5 text-[12px] font-semibold tracking-[0.06em] text-brand">
                          {count} active listing{count === 1 ? "" : "s"}
                        </p>
                      </div>
                    </Link>
                    <a
                      href={`https://wa.me/${wa}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary mt-5 w-full !py-2 text-[12px]"
                    >
                      <Icon name="chat" className="h-4 w-4 text-verified" />
                      WhatsApp direct
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============ 8. TESTIMONIALS ============ */}
        <section className="border-b border-border bg-surface py-[4.5rem]">
          <div className="container-x">
            <span className="eyebrow !text-brand tracking-widest">Client record</span>
            <h2 className="headline-lg pb-10 pt-1">Client voices & diaspora experiences</h2>
            <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
              {testimonials.map((t, i) => (
                <figure
                  key={t.name}
                  className={`flex flex-col justify-between py-5 md:py-0 ${
                    i === 0 ? "md:pr-5" : i === testimonials.length - 1 ? "md:pl-5" : "md:px-5"
                  }`}
                >
                  <blockquote className="headline-sm !font-normal leading-snug">“{t.quote}”</blockquote>
                  <figcaption className="pt-5">
                    <p className="text-[14px] font-semibold tracking-[0.04em]">{t.name}</p>
                    <p className="text-[13px] leading-5 text-fg-muted">{t.role}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 9. SAFETY NOTICE ============ */}
        <section className="border-b border-border bg-sand py-5">
          <div className="container-x flex flex-col items-center justify-between gap-3 md:flex-row">
            <div className="flex items-start gap-3 md:items-center">
              <Icon name="shield" className="h-8 w-8 shrink-0 text-brand" />
              <div>
                <span className="eyebrow !font-bold !text-brand">Haven integrity shield</span>
                <p className="font-medium text-fg-muted">
                  Never pay inspection fees upfront or send money to a personal account before a
                  property is physically verified. Report anything suspicious to our compliance desk.
                </p>
              </div>
            </div>
            <a href="#contact" className="btn shrink-0 border-brand !px-5 !py-2 text-[12px] text-brand hover:bg-brand hover:text-bg">
              <Icon name="phone" className="h-4 w-4" />
              Contact fraud desk
            </a>
          </div>
        </section>

        {/* ============ 10. LIST YOUR PROPERTY ============ */}
        <section id="list-property" className="scroll-mt-20 bg-fg py-[4.5rem] text-bg">
          <div className="container-x grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="block text-[11px] font-semibold uppercase leading-[14px] tracking-widest text-[#ffb59d]">
                For landlords & owners
              </span>
              <h2 className="headline-lg pt-2 text-bg">Own a property in Nigeria? List on Haven.</h2>
              <p className="max-w-2xl pt-2 text-[18px] leading-7 text-bg/75">
                Reach pre-qualified executive tenants, corporate expats and serious diaspora buyers.
                We handle legal vetting, background screening and secure escrow.
              </p>
              <div className="grid grid-cols-2 gap-5 pt-10 sm:grid-cols-3">
                {metrics.map((m, i) => (
                  <div key={m.label} className={`border-l border-bg/25 pl-4 ${i === 2 ? "col-span-2 sm:col-span-1" : ""}`}>
                    <span className="price-display text-[#ffb59d]">{m.n}</span>
                    <p className="pt-0.5 text-[13px] leading-5 text-bg/70">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="flex w-full flex-col gap-3 rounded-lg border border-bg/25 p-5">
                <h3 className="headline-sm text-bg">Start your listing</h3>
                <p className="text-[13px] leading-5 text-bg/70">
                  Request an accredited surveyor to inspect and onboard your residential or
                  commercial property.
                </p>
                <Link href="/list-property" className="btn btn-primary w-full !py-3.5">
                  List your property today
                </Link>
                <span className="text-center text-[11px] font-semibold uppercase leading-[14px] tracking-[0.08em] text-bg/60">
                  Legal deed validation included
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* Section header: eyebrow + serif title + optional intro and right-side link */
function SectionHead({
  eyebrow,
  title,
  body,
  aside,
  divided = false,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  aside?: React.ReactNode;
  divided?: boolean;
}) {
  return (
    <div
      className={`flex flex-col justify-between gap-3 md:flex-row md:items-end ${
        divided ? "border-b border-border pb-10" : ""
      }`}
    >
      <div className="max-w-2xl">
        <span className="eyebrow !text-brand tracking-widest">{eyebrow}</span>
        <h2 className="headline-lg pt-1">{title}</h2>
        {body && <p className="pt-2 text-fg-muted">{body}</p>}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
  );
}
