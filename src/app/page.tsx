import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import AgentCardCompact from "@/components/AgentCardCompact";
import { listResidences } from "@/lib/residences";
import { agents } from "@/lib/agents";
import { articles } from "@/lib/articles";

const locationGrid = [
  { name: "Côte d'Azur", image: "/istockphoto-1.jpg", count: 3 },
  { name: "Mallorca", image: "/istockphoto-7.jpg", count: 1 },
  { name: "Lake Como", image: "/istockphoto-8.jpg", count: 2 },
  { name: "Marrakech", image: "/istockphoto-4.jpg", count: 1 },
  { name: "County Kerry", image: "/istockphoto-5.jpg", count: 1 },
];

const testimonials = [
  {
    quote:
      "They understood our brief in fifteen minutes, found the house in four months, and have looked after it ever since. The single best advisory relationship we've had.",
    name: "C. Vandenberg",
    role: "Owner, Villa Aurelia",
  },
  {
    quote:
      "What stood out was the quality of the no. Vila Estate told us, kindly, that two houses we loved weren't right. They were correct both times.",
    name: "Henrik A.",
    role: "Founder, private investor",
  },
  {
    quote:
      "The acquisition was meticulous. The year that followed — staffing, restoration, gardener — was the part that surprised us.",
    name: "Anaïs L.",
    role: "Collector",
  },
];

export default async function Home() {
  const residences = await listResidences();
  const featured = residences.slice(0, 6);

  return (
    <>
      <Nav transparent />

      {/* HERO */}
      <section className="relative h-[90svh] min-h-[560px] w-full overflow-hidden md:h-[100svh] md:min-h-[680px]">
        <Image
          src="/istockphoto-1.jpg"
          alt="Modern villa at twilight with infinity pool"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Lighter overlay — only darkens the bottom so the headline reads */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

        <div className="container-x relative z-10 flex h-full flex-col justify-center pt-24 pb-10 text-white md:pt-20 md:pb-0">
          <div className="max-w-3xl rise">
            {/* Badge hidden on mobile — it visually fights the logo */}
            <span className="hidden md:inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Spring 2026
            </span>
            <h1 className="font-display text-3xl font-normal leading-[1.1] tracking-tight md:mt-6 md:text-6xl md:leading-[1.05] lg:text-7xl">
              Architect-designed villas,{" "}
              <span className="italic font-light text-white/95">for a quieter life.</span>
            </h1>
            {/* Subhead hidden on mobile — headline says enough on its own */}
            <p className="mt-4 hidden max-w-xl text-base leading-relaxed text-white/85 md:mt-6 md:block md:text-lg">
              The Mediterranean&apos;s most considered homes. Quietly sourced, carefully kept.
            </p>
          </div>

          <div className="mt-8 max-w-4xl md:mt-12">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* STATS strip — moved out of the hero so the image gets to breathe */}
      <section className="border-b border-border bg-surface">
        <div className="container-x grid grid-cols-2 gap-y-6 py-8 md:grid-cols-4 md:py-10">
          <Stat n="8" label="Active residences" />
          <Stat n="€135M" label="Curated portfolio" />
          <Stat n="18" label="Countries served" />
          <Stat n="12 yrs" label="Quietly working" />
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-border bg-surface">
        <div className="container-x flex flex-wrap items-center justify-between gap-x-12 gap-y-5 py-8">
          <p className="text-sm text-fg-muted">As featured in</p>
          {["Architectural Digest", "Wallpaper*", "Monocle", "Financial Times", "The Modern House"].map((p) => (
            <span key={p} className="font-display text-lg italic text-fg/70">
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-x py-24">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="text-[11px] font-medium uppercase tracking-wider text-brand">
              Featured residences
            </span>
            <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
              A small selection,
              <br />
              from this season&apos;s issue.
            </h2>
          </div>
          <Link
            href="/residences"
            className="btn btn-secondary self-start md:self-auto"
          >
            View all 8 residences
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((r, i) => (
            <PropertyCard key={r.slug} r={r} priority={i < 3} />
          ))}
        </div>
      </section>

      {/* ABOUT split */}
      <section id="about" className="bg-surface-2">
        <div className="container-x grid grid-cols-1 gap-12 py-24 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <div className="photo relative aspect-[4/5] overflow-hidden rounded-3xl">
              <Image
                src="/photo-13.avif"
                alt="A considered interior"
                fill
                sizes="(min-width:1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-[11px] font-medium uppercase tracking-wider text-brand">
              Our practice
            </span>
            <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight md:text-5xl">
              The right house, found
              <br />
              <span className="italic">on your behalf.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
              Vila Estate was founded in 2013 to represent a small number of architect-designed
              homes with the quietness their owners — and their architecture — deserve. We
              publish a new portfolio each quarter, never longer than ten residences. Each is
              walked, vetted and personally introduced by a partner of the practice.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3">
              <Pillar n="01" title="Private acquisition" body="Off-market sourcing through a discreet international network." />
              <Pillar n="02" title="Architectural counsel" body="Every residence vetted on architecture, light, stewardship." />
              <Pillar n="03" title="Concierge & care" body="Year-round stewardship — staffing, openings, restoration." />
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/agents" className="btn btn-primary">Meet the team</Link>
              <Link href="/journal" className="btn btn-secondary">Read the journal</Link>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="container-x py-24">
        <div className="max-w-2xl">
          <span className="text-[11px] font-medium uppercase tracking-wider text-brand">
            Where we work
          </span>
          <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
            Quietly active in
            <br />a handful of places.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {locationGrid.map((l) => (
            <Link
              key={l.name}
              href="/residences"
              className="group photo relative block aspect-[3/4] overflow-hidden rounded-2xl"
            >
              <Image
                src={l.image}
                alt={l.name}
                fill
                sizes="(min-width:1024px) 20vw, (min-width:768px) 33vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <div className="font-display text-xl">{l.name}</div>
                <div className="text-sm text-white/80">{l.count} residence{l.count !== 1 ? "s" : ""}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AGENTS preview */}
      <section className="bg-surface-2">
        <div className="container-x py-24">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="text-[11px] font-medium uppercase tracking-wider text-brand">
                Our agents
              </span>
              <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
                A small studio
                <br />
                of advisors.
              </h2>
            </div>
            <Link href="/agents" className="btn btn-secondary self-start md:self-auto">
              Meet the team <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {agents.slice(0, 3).map((a) => {
              const count = residences.filter((r) => r.agentSlug === a.slug).length;
              return <AgentCardCompact key={a.slug} a={a} listings={count} />;
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-x py-24">
        <div className="max-w-2xl">
          <span className="text-[11px] font-medium uppercase tracking-wider text-brand">
            In confidence
          </span>
          <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
            A few words
            <br />
            from our clients.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-2xl border border-border bg-surface p-7 lift">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand" fill="currentColor">
                <path d="M7 11h3v6H4v-5a5 5 0 0 1 5-5V9a3 3 0 0 0-2 2zm10 0h3v6h-6v-5a5 5 0 0 1 5-5V9a3 3 0 0 0-2 2z" />
              </svg>
              <blockquote className="mt-4 flex-1 font-display text-xl leading-snug text-fg">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <div className="font-medium text-fg">{t.name}</div>
                <div className="text-sm text-fg-muted">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* JOURNAL preview */}
      <section className="container-x pb-24">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="text-[11px] font-medium uppercase tracking-wider text-brand">
              From the journal
            </span>
            <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
              Field notes &
              <br />
              conversations.
            </h2>
          </div>
          <Link href="/journal" className="btn btn-secondary self-start md:self-auto">
            All articles <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {articles.map((a) => (
            <Link key={a.slug} href={`/journal/${a.slug}`} className="group block lift">
              <div className="photo relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src={a.cover}
                  alt={a.title}
                  fill
                  sizes="(min-width:1024px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-4 text-[11px] font-medium uppercase tracking-wider text-brand">
                {a.department}
              </div>
              <h3 className="mt-2 font-display text-xl leading-tight text-fg group-hover:text-brand">
                {a.title}
              </h3>
              <p className="mt-2 text-sm text-fg-muted">{a.dek}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative h-[60vh] min-h-[460px] w-full overflow-hidden">
        <Image
          src="/istockphoto-2.jpg"
          alt="An evening at the water's edge"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        <div className="container-x relative z-10 flex h-full flex-col justify-center text-white">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl leading-tight tracking-tight md:text-6xl">
              Tell us how you&apos;d like to live.
            </h2>
            <p className="mt-5 max-w-lg text-lg text-white/85">
              A short conversation in writing or in person. We respond within two
              working days.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#contact" className="btn bg-white text-fg hover:bg-brand-soft">
                Book a viewing
              </Link>
              <Link href="/agents" className="btn border border-white/40 text-white hover:bg-white/10">
                Speak to an agent
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl tracking-tight text-fg md:text-3xl">{n}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-fg-subtle md:text-xs">{label}</div>
    </div>
  );
}

function Pillar({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div>
      <div className="font-display text-2xl italic text-brand">{n}</div>
      <h3 className="mt-2 font-medium text-fg">{title}</h3>
      <p className="mt-1 text-sm text-fg-muted leading-relaxed">{body}</p>
    </div>
  );
}
