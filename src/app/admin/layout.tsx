import { redirect } from "next/navigation";
import { getSession, isStudio } from "@/lib/auth";
import { SessionProvider } from "@/components/SessionProvider";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();

  // Proxy already redirects unauthenticated users — this is a safety net.
  if (!user) {
    redirect("/signin?next=/admin");
  }

  // Block public members from the studio dashboard.
  if (!isStudio(user)) {
    redirect("/");
  }

  return <SessionProvider user={user}>{children}</SessionProvider>;
}
