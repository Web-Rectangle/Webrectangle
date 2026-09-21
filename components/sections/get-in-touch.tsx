import { ArrowRight, Megaphone, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { IconTile } from '@/components/brand/icon-tile';
import { SectionHeading } from '@/components/ui/section-heading';
import { getInTouch } from '@/lib/content/home';
import { whatsappLink } from '@/lib/content/site';
import { contact } from '@/lib/env';

/**
 * Closing conversion point.
 *
 * Two doors rather than one generic "contact us". Brands and creators want
 * opposite things from us, and making someone work out which form applies to
 * them is a real drop-off - asking them to self-identify in one tap is both
 * faster for them and better-qualified for us.
 *
 * Plain links, not a form. The form lives one click away on a page dedicated
 * to it; putting it here would make a short page long again.
 */
export function GetInTouch() {
  return (
    <section className="section-y" id="get-in-touch">
      <div className="container-wr">
        <SectionHeading
          eyebrow={getInTouch.eyebrow}
          title={getInTouch.title}
          description={getInTouch.description}
          align="center"
        />

        <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
          <Door
            href={getInTouch.brand.href}
            label={getInTouch.brand.label}
            body={getInTouch.brand.body}
            icon={<Megaphone />}
            primary
          />
          <Door
            href={getInTouch.creator.href}
            label={getInTouch.creator.label}
            body={getInTouch.creator.body}
            icon={<Sparkles />}
          />
        </div>

        <p className="text-muted mt-8 text-center text-[14px]">
          Or reach us directly at{' '}
          <a href={`mailto:${contact.email}`} className="text-accent font-semibold hover:underline">
            {contact.email}
          </a>{' '}
          &middot;{' '}
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-semibold hover:underline"
          >
            WhatsApp
          </a>
        </p>
      </div>
    </section>
  );
}

function Door({
  href,
  label,
  body,
  icon,
  primary = false,
}: {
  href: string;
  label: string;
  body: string;
  icon: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        primary
          ? 'group from-brand-fill-from to-brand-fill-to flex flex-col rounded-[var(--r-glass)] bg-gradient-to-br p-7 transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0'
          : 'group border-border bg-surface-alt hover:border-accent flex flex-col rounded-[var(--r-glass)] border p-7 transition-[transform,border-color] duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0'
      }
    >
      <IconTile
        variant={primary ? 'soft' : 'gradient'}
        className={primary ? 'bg-white/15 [&_svg]:stroke-white' : undefined}
      >
        {icon}
      </IconTile>

      <p
        className={`mt-5 text-[20px] font-extrabold tracking-[-0.02em] ${primary ? 'text-white' : 'text-ink'}`}
      >
        {label}
      </p>
      <p className={`mt-1 text-[14.5px] ${primary ? 'text-white/75' : ''}`}>{body}</p>

      <span
        className={`mt-5 inline-flex items-center gap-1.5 text-[14px] font-bold ${primary ? 'text-white' : 'text-accent'}`}
      >
        Get in touch
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-250 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        />
      </span>
    </Link>
  );
}
