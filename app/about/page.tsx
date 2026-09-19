import type { Metadata } from 'next';

import { IsometricMark } from '@/components/brand/isometric-mark';
import { CtaBand } from '@/components/sections/cta-band';
import { PageHero } from '@/components/sections/page-hero';
import { Card } from '@/components/ui/card';
import { Glass } from '@/components/ui/glass';
import { PartnerLogo } from '@/components/ui/partner-logo';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { aboutPage } from '@/lib/content/pages';
import { partnerLogos, priorWorkContext, priorWorkTestimonials } from '@/lib/content/proof';
import { site } from '@/lib/content/site';
import { breadcrumbJsonLd, JsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: aboutPage.meta.title,
  description: aboutPage.meta.description,
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />

      <PageHero {...aboutPage.hero} />

      <section className="section-y">
        <div className="container-wr grid items-center gap-14 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="mb-4 text-[clamp(26px,3vw,36px)]">{aboutPage.whyRectangle.title}</h2>
            <p className="text-[17px]">{aboutPage.whyRectangle.body}</p>
          </div>

          <Reveal from="right" className="hidden justify-self-center lg:block">
            <IsometricMark variant="compact" className="max-w-[300px]" />
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-surface-alt">
        <div className="container-wr grid gap-5 md:grid-cols-2">
          <Glass className="p-8">
            <h2 className="mb-3 text-[24px]">{aboutPage.mission.title}</h2>
            <p className="text-[15.5px]">{aboutPage.mission.body}</p>
          </Glass>
          <Glass className="p-8">
            <h2 className="mb-3 text-[24px]">{aboutPage.vision.title}</h2>
            <p className="text-[15.5px]">{aboutPage.vision.body}</p>
          </Glass>
        </div>
      </section>

      <section className="section-y">
        <div className="container-wr">
          <SectionHeading eyebrow="Values" title="How we decide things." align="center" />

          <div className="grid gap-5 md:grid-cols-2">
            {aboutPage.values.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.06}>
                <Card className="h-full p-6">
                  <h3 className="mb-2 text-[18px]">{value.title}</h3>
                  <p className="text-[14.5px]">{value.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-surface-alt">
        <div className="container-wr max-w-3xl">
          <h2 className="mb-4 text-[clamp(24px,2.8vw,32px)]">{aboutPage.stage.title}</h2>
          <p className="mb-8 text-[17px]">{aboutPage.stage.body}</p>

          <p className="text-[15px]">
            WebRectangle is built by <strong className="text-ink">{site.founders[0]}</strong> and{' '}
            <strong className="text-ink">{site.founders[1]}</strong>, from {site.contact.city}.
          </p>
        </div>
      </section>

      {/*
        PROOF FRAMING - read lib/content/proof.ts before touching this.
        These references are real, but they are for digital and social work the
        team delivered before WebRectangle became an influencer marketing
        platform. They sit here, under an explicit "where we come from"
        heading with context, and must never be presented on the homepage as
        praise for the platform.
      */}
      <section className="section-y">
        <div className="container-wr">
          <SectionHeading
            eyebrow="Track record"
            title="Where we come from."
            description={priorWorkContext}
          />

          <ul className="mb-12 flex flex-wrap items-center gap-x-11 gap-y-6">
            {partnerLogos.map((logo) => (
              <li key={logo.name}>
                <PartnerLogo logo={logo} />
              </li>
            ))}
          </ul>

          <div className="grid gap-5 md:grid-cols-2">
            {priorWorkTestimonials.map((testimonial) => (
              <Card key={testimonial.role} as="article" className="p-7">
                <blockquote className="text-ink text-[15.5px] leading-relaxed font-medium">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <footer className="border-border mt-5 border-t pt-4">
                  <p className="text-ink text-[14.5px] font-bold">{testimonial.role}</p>
                  <p className="text-[13px]">{testimonial.organisation}</p>
                </footer>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Working on something? Tell us."
        description="We reply within 24 hours, and it is one of the founders replying."
        primary={{ label: 'Talk to us', href: '/contact' }}
        secondary={{ label: 'Find Creators', href: '/discover' }}
      />
    </>
  );
}
