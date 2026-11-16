import { agents } from "@/lib/agents";
import { listAllResidences } from "@/lib/residences";
import AdminAgentsClient from "./AdminAgentsClient";

export default async function AdminAgentsPage() {
  const residences = await listAllResidences();
  return <AdminAgentsClient agents={agents} residences={residences} />;
}
