import { listResidences } from "@/lib/residences";
import { agents } from "@/lib/agents";
import AdminResidencesClient from "./AdminResidencesClient";

export default async function AdminResidencesPage() {
  const residences = await listResidences();
  return <AdminResidencesClient residences={residences} agents={agents} />;
}
