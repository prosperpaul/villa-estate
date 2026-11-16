import Link from "next/link";

// Haven Properties wordmark: a roofline mark + serif name.
// `light` flips it to cream for dark backgrounds.
export default function Logo({ light = false }: { light?: boolean }) {
  const color = light ? "text-bg" : "text-fg";
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${color}`}>
      <svg viewBox="0 0 28 28" className="h-7 w-7" fill="none" aria-hidden>
        <rect x="0.5" y="0.5" width="27" height="27" rx="4" className="fill-brand" stroke="none" />
        <path d="M6 14 14 7.5 22 14" stroke="#f6f1e9" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8.5 12.5V21h11v-8.5M12.5 21v-4.5h3V21" stroke="#f6f1e9" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <span className="font-display text-[22px] leading-none tracking-tight transition-colors group-hover:text-brand">
        Haven Properties
      </span>
    </Link>
  );
}
