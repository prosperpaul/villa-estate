import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { agents, getAgent } from "@/lib/agents";
import { listResidences } from "@/lib/residences";

export function generateStaticParams() {
  return agents.map((a) => ({ slug: a.slug }));
}

export default async function AgentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getAgent(slug);
  if (!a) return notFound();
  const residences = await listResidences();
  const theirs = residences.filter((r) => r.agentSlug === a.slug);

  return (
    <>
      <Nav />
      <main className="pt-[72px]">
        {/* Header */}
        <section className="border-b border-border bg-surface-2">
          <div className="container-x py-16 md:py-20">
            <Link href="/agents" className="text-sm text-fg-muted hover:text-fg">
              ← Back to agents
            </Link>

            <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-brand">
                  {a.role}
                </span>
                <h1 className="mt-3 font-display text-5xl tracking-tight md:text-6xl">{a.name}</h1>
                <p className="mt-2 text-lg text-fg-muted">{a.basedIn}</p>

                <p className="mt-8 max-w-2xl font-display text-2xl italic leading-snug text-fg md:text-3xl">
                  “{a.letter}”
                </p>
              </div>

              <aside className="rounded-2xl border border-border bg-surface p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-2xl font-medium text-brand">
                    {a.initials}
                  </div>
                  <div>
                    <div className="font-display text-xl">{a.name}</div>
                    <div className="text-sm text-fg-muted">Joined {a.joined}</div>
                  </div>
                </div>

                <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
                  <Row label="Languages" value={a.languages.join(", ")} />
                  <Row label="Currently listing" value={`${theirs.length} residences`} />
                  <Row label="Telephone" value={a.phone} />
                  <Row label="Email" value={a.email} link={`mailto:${a.email}`} />
                </dl>

                <a href={`mailto:${a.email}`} className="btn btn-primary mt-6 w-full">
                  Get in touch
                </a>
              </aside>
            </div>
          </div>
        </section>

        {/* Bio */}
        <section className="container-x py-16 md:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-brand">
                Biography
              </span>
              <h2 className="mt-3 font-display text-3xl tracking-tight">About {a.name.split(" ")[0]}</h2>
            </div>
            <div className="lg:col-span-2 space-y-5 text-[17px] leading-relaxed text-fg-muted">
              {a.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {a.expertise.map((e) => (
              <div key={e} className="rounded-xl border border-border bg-surface px-4 py-3 text-sm">
                <span className="text-fg-subtle">Area</span>
                <div className="font-medium text-fg">{e}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Listings */}
        {theirs.length > 0 && (
          <section className="bg-surface-2">
            <div className="container-x py-16 md:py-20">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-brand">
                    Currently representing
                  </span>
                  <h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">
                    {theirs.length} active residence{theirs.length !== 1 ? "s" : ""}
                  </h2>
                </div>
              </div>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                {theirs.map((r) => (
                  <PropertyCard key={r.slug} r={r} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

function Row({ label, value, link }: { label: string; value: string; link?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-fg-subtle">{label}</dt>
      <dd className="text-fg text-right">
        {link ? (
          <a href={link} className="hover:text-brand">{value}</a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
