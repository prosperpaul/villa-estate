import Link from "next/link";
import Logo from "./Logo";
import Icon from "./Icon";
import MobileTabBar from "./MobileTabBar";

// TODO: replace with the real WhatsApp business number (digits only, with country code)
const WHATSAPP = "2348000000000";

const cols = [
  {
    title: "Portfolios",
    links: [
      { label: "All residences", href: "/residences" },
      { label: "Properties in Ikoyi", href: "/residences?region=Ikoyi" },
      { label: "Lekki Phase 1 rentals", href: "/residences?region=Lekki" },
      { label: "Maitama homes", href: "/residences?region=Maitama" },
      { label: "Victoria Island suites", href: "/residences?region=Victoria%20Island" },
      { label: "Saved residences", href: "/saved" },
    ],
  },
  {
    title: "Trust & verification",
    links: [
      { label: "About Haven", href: "/about" },
      { label: "Our agents", href: "/agents" },
      { label: "The Haven journal", href: "/journal" },
      { label: "Diaspora buying guide", href: "/journal" },
      { label: "Fraud & impersonation warning", href: "/#list-property" },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="contact" className="scroll-mt-20 border-t border-border bg-surface pb-28 pt-[4.5rem] lg:pb-10">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-10 border-b border-border pb-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand + offices */}
          <div className="flex flex-col gap-3">
            <Logo />
            <p className="text-[13px] leading-5 text-fg-muted">
              A verified property platform for premier Nigerian real estate. Legal certainty for
              buyers, renters and the diaspora.
            </p>
            <div className="pt-1.5 text-[13px] leading-5 text-fg-muted">
              <p className="eyebrow pb-1">Offices</p>
              <p>Ikoyi, Lagos</p>
              <p>Maitama, Abuja</p>
            </div>
          </div>

          {/* Link columns */}
          {cols.map((c) => (
            <div key={c.title} className="flex flex-col gap-3">
              <h3 className="text-[14px] font-semibold uppercase leading-5 tracking-[0.04em] text-fg">{c.title}</h3>
              <ul className="flex flex-col gap-1.5 text-fg-muted">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="transition-colors hover:text-brand">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Concierge + newsletter */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[14px] font-semibold uppercase leading-5 tracking-[0.04em] text-fg">Direct concierge</h3>
            <p className="text-[13px] leading-5 text-fg-muted">
              Speak to an accredited partner on our private advisory line.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary w-fit !px-4 !py-2.5 text-[12px]"
            >
              <Icon name="chat" className="h-4 w-4 text-verified" />
              WhatsApp private desk
            </a>

            <div className="flex flex-col gap-1.5 pt-1.5">
              <span className="eyebrow">The Haven Gazette</span>
              <p className="text-[13px] leading-5 text-fg-muted">
                A monthly letter on Nigerian property, yields and architecture.
              </p>
              <form className="flex items-center gap-2">
                <label htmlFor="footer-email" className="sr-only">Email address</label>
                <input id="footer-email" type="email" placeholder="Your email address" className="input !py-2 text-[13px]" />
                <button type="submit" className="btn btn-primary shrink-0 !px-4 !py-2 text-[12px]">Join</button>
              </form>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-5 text-[13px] leading-5 text-fg-muted md:flex-row">
          <p>© {new Date().getFullYear()} Haven Properties Limited. All rights reserved.</p>
          <div className="flex items-center gap-5 text-[11px] font-semibold uppercase tracking-[0.08em]">
            <Link href="#" className="transition-colors hover:text-brand">Privacy</Link>
            <Link href="#" className="transition-colors hover:text-brand">Terms</Link>
            <Link href="#" className="transition-colors hover:text-brand">Regulatory filings</Link>
          </div>
        </div>
      </div>
      {/* Phones: fixed bottom navigation (the extra pb-28 above keeps it off the content) */}
      <MobileTabBar />
    </footer>
  );
}
