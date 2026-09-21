import { Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

import { IsometricMark } from '@/components/brand/isometric-mark';
import { Logo } from '@/components/brand/logo';
import { InstagramIcon, LinkedInIcon, WhatsAppIcon } from '@/components/ui/social-icons';
import { footerNav, site, whatsappLink } from '@/lib/content/site';

const YEAR = 2026;

export function Footer() {
  return (
    <footer className="border-border relative overflow-hidden border-t pt-16">
      {/* Oversized, heavily clipped brand mark - a quiet sign-off rather than
          another content block. Decorative only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -bottom-28 w-[420px] opacity-[0.06]"
      >
        <IsometricMark variant="compact" animated={false} />
      </div>

      <div className="container-wr relative">
        <div className="grid gap-12 pb-14 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[280px] text-[14.5px]">{site.description}</p>

            <div className="mt-6 flex gap-2.5">
              <Social
                href={site.contact.instagram}
                label="WebRectangle on Instagram"
                icon={<InstagramIcon />}
              />
              <Social
                href="https://www.linkedin.com/company/webrectangle"
                label="WebRectangle on LinkedIn"
                icon={<LinkedInIcon />}
              />
              <Social
                href={whatsappLink()}
                label="Message WebRectangle on WhatsApp"
                icon={<WhatsAppIcon />}
              />
            </div>
          </div>

          {footerNav.map((group) => (
            <div key={group.heading}>
              <h2 className="text-ink mb-4 text-[15px] font-bold">{group.heading}</h2>
              <ul className="grid gap-2.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="hover:text-accent text-[14.5px] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <ul className="border-border grid gap-3 border-t py-8 sm:grid-cols-3">
          <ContactRow icon={<Mail />} href={`mailto:${site.contact.email}`}>
            {site.contact.email}
          </ContactRow>
          <ContactRow icon={<Phone />} href={whatsappLink()}>
            {site.contact.phoneDisplay}
          </ContactRow>
          <ContactRow icon={<MapPin />}>{site.contact.city}</ContactRow>
        </ul>

        <div className="border-border flex flex-wrap justify-between gap-4 border-t py-6 text-[13.5px]">
          <span>
            &copy; {YEAR} {site.name}. All rights reserved.
          </span>
          <span className="flex gap-5">
            <Link href="/privacy" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-accent transition-colors">
              Terms of Service
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

function Social({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="border-border text-body hover:bg-accent hover:border-accent hover:text-accent-contrast flex size-11 items-center justify-center rounded-full border transition-all duration-250 hover:-translate-y-0.5 [&_svg]:size-4"
    >
      {icon}
    </a>
  );
}

function ContactRow({
  icon,
  href,
  children,
}: {
  icon: React.ReactNode;
  href?: string;
  children: React.ReactNode;
}) {
  const body = (
    <>
      <span aria-hidden="true" className="text-accent mt-0.5 shrink-0 [&_svg]:size-4">
        {icon}
      </span>
      {children}
    </>
  );

  return (
    <li className="flex items-start gap-2.5 text-[14.5px]">
      {href ? (
        <a
          href={href}
          className="hover:text-accent flex items-start gap-2.5 transition-colors"
          {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {body}
        </a>
      ) : (
        body
      )}
    </li>
  );
}
