import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { articles, getArticle } from "@/lib/articles";
import { agents } from "@/lib/agents";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return notFound();
  const author = agents.find((ag) => ag.name === a.author);
  const more = articles.filter((x) => x.slug !== a.slug).slice(0, 3);

  return (
    <>
      <Nav />
      <main className="pt-20">
        {/* Header */}
        <article>
          <header className="container-x pt-12 pb-10 max-w-4xl">
            <Link
              href="/journal"
              className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M15 6l-6 6 6 6" />
              </svg>
              Journal
            </Link>

            <div className="mt-8">
              <span className="text-[11px] font-medium uppercase tracking-wider text-brand">
                {a.department}
              </span>
              <h1 className="mt-3 font-display text-[clamp(2.4rem,5.5vw,4.6rem)] leading-[1.05] tracking-tight">
                {a.title}
              </h1>
              <p className="mt-5 max-w-2xl text-xl italic text-fg-muted">{a.dek}</p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 border-y border-border py-4 text-sm">
              <div className="flex items-center gap-3">
                {author && (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-xs font-medium text-brand">
                    {author.initials}
                  </div>
                )}
                <div>
                  <div className="font-medium text-fg">{a.author}</div>
                  <div className="text-xs text-fg-muted">{a.authorRole}</div>
                </div>
              </div>
              <span className="text-fg-subtle">·</span>
              <span className="text-fg-muted">{a.date}</span>
              <span className="text-fg-subtle">·</span>
              <span className="text-fg-muted">{a.readingMinutes} min read</span>
              <div className="ml-auto flex items-center gap-2">
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-fg-muted hover:bg-surface-2 hover:text-fg" aria-label="Share">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
                  </svg>
                </button>
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-fg-muted hover:bg-surface-2 hover:text-fg" aria-label="Save">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Cover */}
          <div className="container-x">
            <div className="photo relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-surface-2">
              <Image
                src={a.cover}
                alt={a.title}
                fill
                priority
                sizes="(min-width:1024px) 1100px, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Body */}
          <div className="container-x mt-16 mb-20 max-w-3xl">
            {a.body.map((p, i) => {
              const isLastPara = i === a.body.length - 1;
              const insertPullquote =
                a.pullquote && i === Math.floor(a.body.length / 2) - 1;
              return (
                <div key={i}>
                  {i === 0 ? (
                    <p className="text-[19px] leading-[1.75] text-fg first-letter:font-display first-letter:text-[5rem] first-letter:leading-[0.85] first-letter:float-left first-letter:pr-3 first-letter:pt-1">
                      {p}
                    </p>
                  ) : (
                    <p className="mt-6 text-[18px] leading-[1.75] text-fg-muted">{p}</p>
                  )}
                  {insertPullquote && (
                    <blockquote className="my-12 border-l-2 border-brand pl-8">
                      <p className="font-display text-3xl leading-snug text-fg md:text-4xl">
                        “{a.pullquote}”
                      </p>
                    </blockquote>
                  )}
                  {isLastPara && (
                    <div className="mt-14 border-t border-border pt-6 text-sm text-fg-muted">
                      <div className="font-medium text-fg">{a.author}</div>
                      <div className="text-xs">{a.authorRole}, Vila Estate · {a.date}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </article>

        {/* More */}
        {more.length > 0 && (
          <section className="border-t border-border bg-surface-2">
            <div className="container-x py-16">
              <div className="flex items-end justify-between">
                <h2 className="font-display text-3xl tracking-tight">Continue reading</h2>
                <Link href="/journal" className="btn btn-secondary">All articles</Link>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3">
                {more.map((m) => (
                  <Link key={m.slug} href={`/journal/${m.slug}`} className="group block lift">
                    <div className="photo relative aspect-[4/5] overflow-hidden rounded-2xl">
                      <Image src={m.cover} alt={m.title} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover" />
                    </div>
                    <div className="mt-4 text-[11px] font-medium uppercase tracking-wider text-brand">
                      {m.department}
                    </div>
                    <h3 className="mt-2 font-display text-xl leading-tight text-fg group-hover:text-brand">
                      {m.title}
                    </h3>
                    <p className="mt-1 text-sm text-fg-muted">{m.author} · {m.readingMinutes} min</p>
                  </Link>
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
