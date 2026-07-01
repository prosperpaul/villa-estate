export default function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "Available" || status === "Open" || status === "Published"
      ? "bg-brand-soft text-brand"
      : status === "Reserved" || status === "Draft"
        ? "bg-amber-100 text-amber-800"
        : status === "Sold" || status === "Archived"
          ? "bg-surface-2 text-fg-muted"
          : "bg-surface-2 text-fg";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}
