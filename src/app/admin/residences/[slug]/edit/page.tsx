import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import AdminToolbar from "@/components/admin/AdminToolbar";
import ResidenceForm from "@/components/admin/ResidenceForm";
import ReviewPanel from "@/components/admin/ReviewPanel";
import { getAnyResidence } from "@/lib/residences";

export default async function EditResidencePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = await getAnyResidence(slug);
  if (!r) return notFound();

  return (
    <AdminShell breadcrumb={`Residences / ${r.name}`}>
      <AdminToolbar title={r.name} description={`${r.issueNumber} · ${r.location.town}, ${r.location.country}`}>
        {r.published !== false && <Link href={`/residences/${r.slug}`} className="btn btn-secondary">View on site</Link>}
      </AdminToolbar>
      <ReviewPanel r={r} />
      <ResidenceForm mode="edit" initial={r} />
    </AdminShell>
  );
}
