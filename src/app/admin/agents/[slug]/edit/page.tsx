import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import AdminToolbar from "@/components/admin/AdminToolbar";
import AgentForm from "@/components/admin/AgentForm";
import { agents, getAgent } from "@/lib/agents";

export function generateStaticParams() {
  return agents.map((a) => ({ slug: a.slug }));
}

export default async function EditAgentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getAgent(slug);
  if (!a) return notFound();

  return (
    <AdminShell breadcrumb={`Agents / ${a.name}`}>
      <AdminToolbar title={a.name} description={`${a.role} · ${a.basedIn}`}>
        <Link href={`/agents/${a.slug}`} className="btn btn-secondary">View on site</Link>
      </AdminToolbar>
      <AgentForm mode="edit" initial={a} />
    </AdminShell>
  );
}
