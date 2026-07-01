import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import AdminToolbar from "@/components/admin/AdminToolbar";
import StatusBadge from "@/components/admin/StatusBadge";
import { agents } from "@/lib/agents";

const extraStaff = [
  { name: "M. Aubert", role: "Operations Manager", basedIn: "Antibes", access: "Admin", lastSeen: "Now" },
  { name: "R. Berkowitz", role: "Legal Counsel", basedIn: "London", access: "Editor", lastSeen: "2 hours ago" },
  { name: "P. Chen", role: "Stewardship Lead", basedIn: "Antibes", access: "Editor", lastSeen: "Yesterday" },
];

export const metadata = { title: "Team — Admin" };

export default function TeamPage() {
  const all = [
    ...agents.map((a) => ({ name: a.name, role: a.role, basedIn: a.basedIn, access: "Editor", lastSeen: "Today" })),
    ...extraStaff,
  ];

  return (
    <AdminShell breadcrumb="Team">
      <AdminToolbar title="Team" description={`${all.length} members · ${agents.length} client-facing agents`}>
        <button className="btn btn-secondary">Roles & access</button>
        <button className="btn btn-primary">+ Invite member</button>
      </AdminToolbar>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2 text-left text-xs uppercase tracking-wider text-fg-subtle">
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Office</th>
              <th className="px-4 py-3">Access</th>
              <th className="px-4 py-3">Last seen</th>
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {all.map((m, i) => (
              <tr key={i} className="hover:bg-surface-2">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-xs font-medium text-brand">
                      {m.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                    </div>
                    <div className="font-medium text-fg">{m.name}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-fg-muted">{m.role}</td>
                <td className="px-4 py-3 text-fg-muted">{m.basedIn}</td>
                <td className="px-4 py-3"><StatusBadge status={m.access} /></td>
                <td className="px-4 py-3 text-fg-muted">{m.lastSeen}</td>
                <td className="px-4 py-3 text-right">
                  <Link href="#" className="text-fg-muted hover:text-brand">Manage</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
