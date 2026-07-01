import { listResidences } from "@/lib/residences";
import SavedClient from "./SavedClient";

export const metadata = { title: "Saved — Vila Estate" };

export default async function SavedPage() {
  const residences = await listResidences();
  return <SavedClient residences={residences} />;
}
