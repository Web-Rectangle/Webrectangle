import { Clock, Mail, MapPin, MessageCircle } from 'lucide-react';
import type { Metadata } from 'next';

import { IconTile } from '@/components/brand/icon-tile';
import { LeadForm } from '@/components/forms/lead-form';
import { PageHero } from '@/components/sections/page-hero';
import { Glass } from '@/components/ui/glass';
import { contactPage } from '@/lib/content/pages';
import { site, whatsappLink } from '@/lib/content/site';
import { env, features } from '@/lib/env';
import { breadcrumbJsonLd, JsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: contactPage.meta.title,
  description: contactPage.meta.description,
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />

      <PageHero {...contactPage.hero} />

      <section className="pb-20">
        <div className="container-wr grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Glass className="mb-6 flex items-center gap-4 p-5">
              <IconTile variant="soft" size="sm">
                <Clock />
              </IconTile>
              <div>
                <p className="text-ink text-[15px] font-bold">{contactPage.responsePromise}</p>
                <p className="text-[13.5px]">Usually the same day, from one of the founders.</p>
              </div>
            </Glass>

            <ul className="grid gap-5">
              <Channel
                icon={<Mail />}
                label="Email"
                value={site.contact.email}
                href={`mailto:${site.contact.email}`}
              />
              <Channel
                icon={<MessageCircle />}
                label="WhatsApp"
                value={site.contact.phoneDisplay}
                href={whatsappLink('Hi WebRectangle! I have a question about the platform.')}
                external
              />
              <Channel icon={<MapPin />} label="Where we are" value={site.contact.city} />
            </ul>

            {/*
              Scheduling is env-gated. Without NEXT_PUBLIC_CAL_LINK the section
              is simply absent rather than rendering a dead "Book a call"
              button that goes nowhere.
            */}
            {features.scheduling ? (
              <div className="mt-8">
                <h2 className="mb-3 text-[18px]">Rather talk?</h2>
                <a
                  href={`https://cal.com/${env.NEXT_PUBLIC_CAL_LINK}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent text-[15px] font-bold hover:underline"
                >
                  Book a 20-minute call
                </a>
              </div>
            ) : null}
          </div>

          <LeadForm source="contact" heading="Tell us about it" />
        </div>
      </section>
    </>
  );
}

function Channel({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <IconTile variant="soft" size="sm">
        {icon}
      </IconTile>
      <div>
        <p className="text-ink text-[15px] font-bold">{label}</p>
        <p className="text-[14px]">{value}</p>
      </div>
    </>
  );

  return (
    <li>
      {href ? (
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="hover:text-accent flex items-center gap-4 transition-colors"
        >
          {content}
        </a>
      ) : (
        <div className="flex items-center gap-4">{content}</div>
      )}
    </li>
  );
}
