import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { articles } from "@/lib/articles";

export const metadata = {
  title: "Journal — Vila Estate",
  description: "Field notes, architects in conversation, and the occasional letter.",
};

export default function JournalPage() {
  const [lead, ...rest] = articles;

  return (
    <>
      <Nav />
      <main className="pt-[72px]">
        <section className="border-b border-border bg-surface-2">
          <div className="container-x py-16 md:py-20">
            <span className="text-[11px] font-medium uppercase tracking-wider text-brand">
              The journal
            </span>
            <h1 className="mt-3 font-display text-5xl tracking-tight md:text-6xl">
              Field notes &
              <br />
              <span className="italic">conversations.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-fg-muted">
              Stories from the houses, the architects who shaped them, and the small
              problems of restoration and stewardship that occupy our days.
            </p>
          </div>
        </section>

        {/* Lead article */}
        {lead && (
          <section className="container-x py-16">
            <Link href={`/journal/${lead.slug}`} className="group grid grid-cols-1 gap-10 lg:grid-cols-12">
              <div className="photo relative aspect-[5/4] overflow-hidden rounded-3xl lg:col-span-7">
                <Image src={lead.cover} alt={lead.title} fill sizes="(min-width:1024px) 58vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-col justify-center lg:col-span-5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-brand">
                  Lead article · {lead.department}
                </span>
                <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight md:text-5xl group-hover:text-brand">
                  {lead.title}
                </h2>
                <p className="mt-5 max-w-md text-lg italic leading-relaxed text-fg-muted">
                  {lead.dek}
                </p>
                <div className="mt-8 flex items-center gap-3 text-sm text-fg-muted">
                  <span>{lead.author}</span>
                  <span>·</span>
                  <span>{lead.date}</span>
                  <span>·</span>
                  <span>{lead.readingMinutes} min read</span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Article grid */}
        <section className="border-t border-border bg-surface-2">
          <div className="container-x py-16 md:py-20">
            <h2 className="font-display text-3xl tracking-tight">More from the journal</h2>
            <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((a) => (
                <Link key={a.slug} href={`/journal/${a.slug}`} className="group block lift">
                  <div className="photo relative aspect-[4/5] overflow-hidden rounded-2xl">
                    <Image src={a.cover} alt={a.title} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover" />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-brand">
                      {a.department}
                    </span>
                    <span className="text-xs text-fg-muted">{a.readingMinutes} min</span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl leading-tight text-fg group-hover:text-brand">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{a.dek}</p>
                  <div className="mt-3 text-xs text-fg-subtle">{a.author} — {a.date}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
