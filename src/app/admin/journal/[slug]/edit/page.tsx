import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import AdminToolbar from "@/components/admin/AdminToolbar";
import ArticleForm from "@/components/admin/ArticleForm";
import { articles, getArticle } from "@/lib/articles";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return notFound();

  return (
    <AdminShell breadcrumb={`Journal / ${a.title}`}>
      <AdminToolbar title={a.title} description={`${a.department} · ${a.author} · ${a.date}`}>
        <Link href={`/journal/${a.slug}`} className="btn btn-secondary">View on site</Link>
      </AdminToolbar>
      <ArticleForm mode="edit" initial={a} />
    </AdminShell>
  );
}
