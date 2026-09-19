import { ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

import { IconTile } from '@/components/brand/icon-tile';
import { CtaBand } from '@/components/sections/cta-band';
import { PageHero } from '@/components/sections/page-hero';
import { Card } from '@/components/ui/card';
import { CheckItem } from '@/components/ui/check-item';
import { Glass } from '@/components/ui/glass';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { forCreators } from '@/lib/content/pages';
import { breadcrumbJsonLd, JsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: forCreators.meta.title,
  description: forCreators.meta.description,
  path: '/for-creators',
});

export default function ForCreatorsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'For Creators', path: '/for-creators' },
        ])}
      />

      <PageHero {...forCreators.hero} />

      <section className="section-y">
        <div className="container-wr">
          <SectionHeading
            eyebrow="What you get"
            title="Built for the side of the deal that usually gets ignored."
          />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {forCreators.benefits.map((benefit, i) => (
              <Reveal key={benefit.title} delay={i * 0.06}>
                <Card className="h-full p-6">
                  <h3 className="mb-2 text-[18px]">{benefit.title}</h3>
                  <p className="text-[14.5px]">{benefit.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/*
        Creators are cautious about handing their data to a platform, and with
        good reason. Stating the limits explicitly is more reassuring than
        another benefit card would be.
      */}
      <section className="section-y bg-surface-alt">
        <div className="container-wr">
          <Glass className="mx-auto max-w-3xl p-8 md:p-10">
            <div className="mb-6 flex items-center gap-4">
              <IconTile variant="soft">
                <ShieldCheck />
              </IconTile>
              <h2 className="text-[clamp(22px,2.4vw,28px)]">{forCreators.promise.title}</h2>
            </div>

            <ul className="grid gap-4">
              {forCreators.promise.points.map((point) => (
                <CheckItem key={point}>{point}</CheckItem>
              ))}
            </ul>
          </Glass>
        </div>
      </section>

      <CtaBand
        title="Build your profile in a few minutes."
        description="No cost, no exclusivity, no obligation to accept anything."
        primary={{ label: 'Join as a Creator', href: '/join/creator' }}
        secondary={{ label: 'How it works', href: '/how-it-works' }}
      />
    </>
  );
}
