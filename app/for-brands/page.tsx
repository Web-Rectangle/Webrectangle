import type { Metadata } from 'next';

import { CtaBand } from '@/components/sections/cta-band';
import { PageHero } from '@/components/sections/page-hero';
import { Card } from '@/components/ui/card';
import { Glass } from '@/components/ui/glass';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { StatusBadge } from '@/components/ui/status-badge';
import { forBrands } from '@/lib/content/pages';
import { breadcrumbJsonLd, JsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: forBrands.meta.title,
  description: forBrands.meta.description,
  path: '/for-brands',
});

export default function ForBrandsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'For Brands', path: '/for-brands' },
        ])}
      />

      <PageHero {...forBrands.hero} />

      <section className="section-y">
        <div className="container-wr">
          <SectionHeading
            eyebrow="The workflow"
            title="Six stages, one brief."
            description="Everything you enter at the start flows through the rest. No re-typing the campaign into a DM."
          />

          <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {forBrands.stages.map((stage, i) => (
              <Reveal as="li" key={stage.title} delay={i * 0.06}>
                <Card className="h-full p-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span
                      aria-hidden="true"
                      className="text-accent text-[13px] font-extrabold tracking-[0.1em]"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <StatusBadge status={stage.status} />
                  </div>
                  <h3 className="mb-2 text-[18px]">{stage.title}</h3>
                  <p className="text-[14.5px]">{stage.body}</p>
                </Card>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y bg-surface-alt">
        <div className="container-wr">
          <SectionHeading
            eyebrow="Two ways to work"
            title="Run it yourself, or have us run it."
            description="Both use the same platform. The difference is who does the legwork."
            align="center"
          />

          <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
            {forBrands.models.map((model) => (
              <Glass key={model.title} className="p-7">
                <h3 className="mb-2.5 text-[20px]">{model.title}</h3>
                <p className="text-[15px]">{model.body}</p>
              </Glass>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready to brief your first campaign?"
        description="Tell us the product, the audience and the budget. We reply within 24 hours."
        primary={{ label: 'Start a Campaign', href: '/join/brand' }}
        secondary={{ label: 'Find Creators', href: '/discover' }}
      />
    </>
  );
}
