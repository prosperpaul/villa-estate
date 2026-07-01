import Link from "next/link";
import Logo from "./Logo";

const cols = [
  {
    title: "Residences",
    links: [
      { label: "All residences", href: "/residences" },
      { label: "Côte d'Azur", href: "/residences" },
      { label: "Mallorca", href: "/residences" },
      { label: "Lake Como", href: "/residences" },
      { label: "Marrakech", href: "/residences" },
    ],
  },
  {
    title: "Practice",
    links: [
      { label: "About Vila Estate", href: "#about" },
      { label: "Our agents", href: "/agents" },
      { label: "Journal", href: "/journal" },
      { label: "Press", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Acquisitions", href: "#" },
      { label: "Stewardship", href: "#" },
      { label: "Mortgage advisory", href: "#" },
      { label: "Estate planning", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="contact" className="mt-32 border-t border-border bg-surface-2">
      <div className="container-x py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-fg-muted">
              Vila Estate represents architect-designed villas across the Mediterranean,
              Morocco and the British Isles. Quiet acquisitions, considered stewardship.
            </p>

            <div className="mt-10 max-w-md">
              <div className="text-[11px] font-medium uppercase tracking-wider text-fg-subtle">
                Receive new listings
              </div>
              <form className="mt-3 flex items-center gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="input rounded-full"
                />
                <button className="btn btn-primary">Subscribe</button>
              </form>
              <p className="mt-3 text-xs text-fg-subtle">
                A short letter, four times a year. Unsubscribe anytime.
              </p>
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title} className="md:col-span-2">
              <div className="text-[11px] font-medium uppercase tracking-wider text-fg-subtle">
                {c.title}
              </div>
              <ul className="mt-5 space-y-3 text-[15px]">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-fg-muted hover:text-fg">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-1">
            <div className="text-[11px] font-medium uppercase tracking-wider text-fg-subtle">
              Offices
            </div>
            <ul className="mt-5 space-y-3 text-[15px] text-fg-muted">
              <li>Antibes</li>
              <li>London</li>
              <li>Milan</li>
              <li>Marrakech</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-sm text-fg-subtle md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Vila Estate. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-fg">Privacy</Link>
            <Link href="#" className="hover:text-fg">Terms</Link>
            <Link href="#" className="hover:text-fg">Cookies</Link>
            <Link href="#" className="hover:text-fg">Sitemap</Link>
          </div>
          <div className="flex gap-4">
            <Social label="Instagram" path="M3 7.5A4.5 4.5 0 0 1 7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5z M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z M17.2 6.3v.01" />
            <Social label="LinkedIn" path="M4 4h4v16H4zM6 2v.01M10 8h4v2a3 3 0 1 1 6 0v10h-4v-9a1.5 1.5 0 0 0-3 0v9h-3z" />
            <Social label="Pinterest" path="M9 21l3-9M8 9a4 4 0 1 1 7.5 2c-.4 1.2-2 2.5-3.5 2.5" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function Social({ label, path }: { label: string; path: string }) {
  return (
    <a href="#" aria-label={label} className="text-fg-subtle hover:text-fg">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d={path} />
      </svg>
    </a>
  );
}
