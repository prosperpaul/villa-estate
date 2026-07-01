import { agents } from "@/lib/agents";
import { listResidences } from "@/lib/residences";
import AdminAgentsClient from "./AdminAgentsClient";

export default async function AdminAgentsPage() {
  const residences = await listResidences();
  return <AdminAgentsClient agents={agents} residences={residences} />;
}
