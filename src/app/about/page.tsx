import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About — Vila Estate",
  description:
    "A small international office representing the Mediterranean's most considered homes. Quietly sourced, carefully kept.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="pt-[72px]">
        {/* HERO */}
        <section className="border-b border-border bg-surface-2">
          <div className="container-x py-16 md:py-24">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
              <div className="md:col-span-7">
                <span className="text-[11px] font-medium uppercase tracking-wider text-brand">
                  The studio
                </span>
                <h1 className="mt-4 font-display text-4xl leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
                  Quiet work,
                  <br />
                  <span className="italic font-light">on a small scale.</span>
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted md:text-xl">
                  Vila Estate is a private international office representing the
                  Mediterranean&apos;s most considered homes. We work with a small
                  number of owners, over long horizons, with a great deal of
                  attention.
                </p>
              </div>

              {/* Founder note — small, like a signature on a letter */}
              <aside className="md:col-span-5 md:pt-12">
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8">
                  <div className="text-[11px] uppercase tracking-wider text-fg-subtle">
                    A note from
                  </div>
                  <div className="mt-1 font-display text-xl text-fg">
                    Léa Marchand
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed text-fg-muted">
                    “We started this studio because we wanted to do this work
                    differently, slower, kinder, with the same people for a
                    long time. Twelve years on, I&apos;m still surprised by how
                    much that one decision shapes everything else.”
                  </p>
                  <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-sm font-medium text-brand">
                      LM
                    </div>
                    <div className="text-sm text-fg-muted">
                      Founding Partner
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* STORY */}
        <section className="container-x py-16 md:py-24">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-brand">
                Our approach
              </span>
              <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight md:text-4xl">
                We represent few houses,
                <br />
                <span className="italic">very well.</span>
              </h2>
            </div>
            <div className="prose-like md:col-span-7 space-y-5 text-[17px] leading-relaxed text-fg-muted md:text-lg">
              <p>
                Most of what we do is invisible. Long walks through houses that
                are not yet for sale. Quiet introductions between people who
                share a sensibility. Letters, dinners, the patient construction
                of trust.
              </p>
              <p>
                When we list a residence, it is because we&apos;ve spent time
                with the architecture and the owners, and we believe, quietly,
                privately, that we know who it might be right for. We take on
                eight to twelve houses a year. Never more.
              </p>
              <p>
                The acquisition is only the first chapter. We stay involved
                for the years that follow, restoration, staffing, gardening,
                the occasional sale a decade later. Most of our owners came to
                us through someone we already work for.
              </p>
            </div>
          </div>
        </section>

        {/* PRINCIPLES */}
        <section className="border-y border-border bg-surface-2">
          <div className="container-x py-16 md:py-24">
            <div className="max-w-2xl">
              <span className="text-[11px] font-medium uppercase tracking-wider text-brand">
                Principles
              </span>
              <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight md:text-4xl">
                Four things that
                <br />
                <span className="italic">shape every decision.</span>
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-12 md:mt-16 md:grid-cols-2">
              <Principle
                n="01"
                title="Curation over volume"
                body="Eight to twelve residences a year. We turn down ten for every one we list, and we say so kindly. The work begins with the no."
              />
              <Principle
                n="02"
                title="Discretion"
                body="Most introductions happen off the record. We don't market what we represent in public; we tell the right person, once, privately."
              />
              <Principle
                n="03"
                title="The long view"
                body="A house is a chapter, not a transaction. Our average client relationship spans nine years and three houses. We are still useful in year ten."
              />
              <Principle
                n="04"
                title="The same hand"
                body="The advisor who shows you the residence is the same advisor who knows your housekeeper's name. No junior associates, no handoffs."
              />
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="container-x py-16 md:py-20">
          <div className="grid grid-cols-2 gap-y-8 md:grid-cols-4">
            <Stat n="8" label="Active residences" />
            <Stat n="€135M" label="Curated portfolio" />
            <Stat n="18" label="Countries served" />
            <Stat n="12 yrs" label="Quietly working" />
          </div>
        </section>

        {/* TEAM BRIDGE */}
        <section className="border-y border-border bg-surface-2">
          <div className="container-x py-16 md:py-20">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center md:gap-16">
              <div className="md:col-span-7">
                <span className="text-[11px] font-medium uppercase tracking-wider text-brand">
                  The team
                </span>
                <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight md:text-4xl">
                  Five advisors,
                  <br />
                  <span className="italic">four cities.</span>
                </h2>
                <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-fg-muted">
                  Antibes, London, Milan, Marrakech. Each advisor walks every
                  residence they represent and knows its owners well. They are
                  the studio.
                </p>
              </div>
              <div className="md:col-span-5 md:text-right">
                <Link href="/agents" className="btn btn-secondary">
                  Meet the studio
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
          <Image
            src="/istockphoto-2.jpg"
            alt="A villa at the water's edge"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/35" />
          <div className="container-x relative z-10 flex h-full flex-col justify-end pb-12 text-white md:justify-center md:pb-0">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl leading-tight tracking-tight md:text-5xl">
                If you&apos;re curious about
                <br />
                <span className="italic">a particular house —</span>
                <br />
                let&apos;s talk.
              </h2>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/residences" className="btn bg-white text-fg hover:bg-brand-soft">
                  Browse residences
                </Link>
                <Link href="#contact" className="btn border border-white/40 text-white hover:bg-white/10">
                  Speak with us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Principle({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div>
      <div className="font-display text-2xl italic text-brand">{n}</div>
      <h3 className="mt-3 font-display text-xl text-fg">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">{body}</p>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl tracking-tight text-fg md:text-4xl">{n}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-fg-subtle md:text-xs">
        {label}
      </div>
    </div>
  );
}
