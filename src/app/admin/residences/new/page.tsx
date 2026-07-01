import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import AdminToolbar from "@/components/admin/AdminToolbar";
import ResidenceForm from "@/components/admin/ResidenceForm";

export const metadata = { title: "New residence — Admin" };

export default function NewResidencePage() {
  return (
    <AdminShell breadcrumb="Residences / New">
      <AdminToolbar title="New residence" description="Add a new residence to the current issue.">
        <Link href="/admin/residences" className="btn btn-secondary">← Cancel</Link>
      </AdminToolbar>
      <ResidenceForm mode="new" />
    </AdminShell>
  );
}
