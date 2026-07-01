import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import AdminToolbar from "@/components/admin/AdminToolbar";
import ArticleForm from "@/components/admin/ArticleForm";

export const metadata = { title: "New article — Admin" };

export default function NewArticlePage() {
  return (
    <AdminShell breadcrumb="Journal / New article">
      <AdminToolbar title="New article">
        <Link href="/admin/journal" className="btn btn-secondary">← Cancel</Link>
      </AdminToolbar>
      <ArticleForm mode="new" />
    </AdminShell>
  );
}
