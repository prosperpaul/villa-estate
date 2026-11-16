import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import ConsultationForm from "@/components/ConsultationForm";
import AgentListingsTabs from "@/components/AgentListingsTabs";
import { agents, getAgent } from "@/lib/agents";
import { listResidences } from "@/lib/residences";
import { formatPriceShort } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return agents.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getAgent(slug);
  if (!a) return { title: "Agent not found, Haven Properties" };
  return { title: `${a.name}, ${a.role}, Haven Properties`, description: a.bio[0] };
}

export default async function AgentPage({ params }: Props) {
  const { slug } = await params;
  const a = getAgent(slug);
  if (!a) return notFound();

  const residences = await listResidences();
  const theirs = residences.filter((r) => r.agentSlug === a.slug);
  const active = theirs.filter((r) => r.status !== "Sold");
  const sold = theirs.filter((r) => r.status === "Sold");

  // Real stats only: years with Haven, active listings, and the value of what's listed now
  const years = Math.max(1, new Date().getFullYear() - a.joined);
  const tally = new Map<string, number>();
  active.forEach((r) => tally.set(r.currency, (tally.get(r.currency) ?? 0) + 1));
  const mainCurrency = [...tally.entries()].sort((x, y) => y[1] - x[1])[0]?.[0] as (typeof active)[number]["currency"] | undefined;
  const portfolio = mainCurrency
    ? active.filter((r) => r.currency === mainCurrency).reduce((sum, r) => sum + r.price, 0)
    : 0;

  const first = a.name.split(" ")[0];
  const wa = a.phone.replace(/\D/g, "");

  return (
    <>
      <Nav />
      <main className="pt-20">
        <div className="container-x pt-6">
          <Link href="/agents" className="eyebrow inline-flex items-center gap-1.5 hover:!text-brand">
            <span aria-hidden>←</span> All advisors
          </Link>
        </div>

        <div className="container-x grid grid-cols-1 items-start gap-10 pb-[4.5rem] pt-5 lg:grid-cols-12">
          {/* ---------- LEFT: dossier ---------- */}
          <div className="min-w-0 space-y-10 lg:col-span-7">
            {/* Header card */}
            <section className="relative overflow-hidden rounded-lg border border-border bg-surface p-5 md:p-8">
              {/* Adire-style diamond watermark */}
              <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 text-brand/10" fill="none" stroke="currentColor" strokeWidth="1">
                <polygon points="50,5 95,50 50,95 5,50" />
                <polygon points="50,20 80,50 50,80 20,50" />
                <circle cx="50" cy="50" r="10" />
              </svg>

              <div className="relative flex gap-5">
                <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded bg-sand">
                  {a.photo ? (
                    <Image src={a.photo} alt={a.name} fill sizes="96px" priority className="object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center font-display text-[34px]">{a.initials}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <span className="eyebrow !text-brand">Haven advisory · {a.basedIn}</span>
                  <h1 className="headline-lg pt-1 leading-tight">{a.name}</h1>
                  <p className="text-fg-muted">{a.role}</p>
                </div>
              </div>

              {a.accreditation && (
                <p className="relative mt-5 flex items-center gap-2 rounded border border-verified/30 bg-verified-soft px-3 py-2 text-[13px] font-medium text-verified">
                  <Icon name="verified" className="h-4 w-4 shrink-0" />
                  {a.accreditation}
                </p>
              )}

              {/* Stats trio */}
              <dl className="relative mt-5 grid grid-cols-3 divide-x divide-border border-y border-border">
                <Stat value={`${years} yr${years === 1 ? "" : "s"}`} label="With Haven" />
                <Stat value={String(active.length)} label="Active listings" />
                <Stat value={portfolio && mainCurrency ? formatPriceShort(portfolio, mainCurrency) : "n/a"} label="Listed value" />
              </dl>

              <div className="relative mt-5 grid grid-cols-2 gap-2">
                <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary !px-3 text-[12px]">
                  <Icon name="chat" className="h-4 w-4 text-verified" /> WhatsApp
                </a>
                <a href={`tel:${a.phone.replace(/\s/g, "")}`} className="btn btn-primary !px-3 text-[12px]">
                  <Icon name="phone" className="h-4 w-4" /> Direct call
                </a>
                <a href={`/agents/${a.slug}/vcard`} download className="btn btn-ghost col-span-2 rounded-full border border-border !py-2 text-[12px]">
                  <Icon name="user" className="h-4 w-4" /> Save contact card (vCard)
                </a>
              </div>
            </section>

            {/* Biography */}
            <section>
              <div className="flex items-baseline justify-between gap-3 border-b border-border pb-3">
                <h2 className="headline-md">Biography</h2>
                <span className="eyebrow">Since {a.joined}</span>
              </div>
              <div className="space-y-4 pt-5 text-fg-muted">
                {a.bio.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              {a.letter && (
                <blockquote className="mt-6 border-l-2 border-brand pl-4 font-display text-[20px] italic leading-8">
                  “{a.letter}”
                </blockquote>
              )}

              <span className="eyebrow mb-2 mt-6 block">Focus areas</span>
              <div className="flex flex-wrap gap-2">
                {a.expertise.map((e) => (
                  <Link key={e} href={`/residences?region=${encodeURIComponent(e)}`} className="badge !normal-case !tracking-[0.02em] hover:!text-brand">
                    {e}
                  </Link>
                ))}
              </div>

              <p className="mt-6 flex items-start gap-2 border-t border-border pt-4 text-[13px] leading-5 text-fg-muted">
                <Icon name="chat" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>
                  <strong className="font-semibold text-fg">Languages:</strong> {a.languages.join(", ")}
                  {a.accreditation && (
                    <>
                      {" · "}<strong className="font-semibold text-fg">Registration:</strong> {a.accreditation}
                    </>
                  )}
                </span>
              </p>
            </section>

            <AgentListingsTabs active={active} sold={sold} firstName={first} />
          </div>

          {/* ---------- RIGHT: consultation (sticky on desktop) ---------- */}
          <aside className="lg:sticky lg:top-24 lg:col-span-5">
            <ConsultationForm agentName={a.name} />
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    // dt (label) comes first in the HTML for screen readers; flex-col-reverse shows the number on top
    <div className="flex flex-col-reverse px-2 py-3 text-center first:pl-0 last:pr-0">
      <dt className="eyebrow pt-0.5">{label}</dt>
      <dd className="font-display text-[22px] leading-7 text-fg tnum">{value}</dd>
    </div>
  );
}
