import { listAllResidences } from "@/lib/residences";
import { agents } from "@/lib/agents";
import AdminResidencesClient from "./AdminResidencesClient";

export default async function AdminResidencesPage() {
  const residences = await listAllResidences();
  return <AdminResidencesClient residences={residences} agents={agents} />;
}
