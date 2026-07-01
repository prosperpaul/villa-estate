import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import AdminToolbar from "@/components/admin/AdminToolbar";
import AgentForm from "@/components/admin/AgentForm";

export const metadata = { title: "Add agent — Admin" };

export default function NewAgentPage() {
  return (
    <AdminShell breadcrumb="Agents / New">
      <AdminToolbar title="Add an agent" description="A new member of the practice.">
        <Link href="/admin/agents" className="btn btn-secondary">← Cancel</Link>
      </AdminToolbar>
      <AgentForm mode="new" />
    </AdminShell>
  );
}
