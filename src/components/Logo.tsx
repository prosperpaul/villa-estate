import Link from "next/link";

export default function Logo({ light = false }: { light?: boolean }) {
  const color = light ? "text-white" : "text-fg";
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${color}`}>
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5 10v10h14V10" />
        <path d="M10 20v-5h4v5" />
      </svg>
      <span className="font-display text-[22px] tracking-tight leading-none">
        Vila<span className="font-display italic font-medium"> Estate</span>
      </span>
    </Link>
  );
}
