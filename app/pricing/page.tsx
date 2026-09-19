import { Check } from 'lucide-react';
import type { Metadata } from 'next';

import { CtaBand } from '@/components/sections/cta-band';
import { PageHero } from '@/components/sections/page-hero';
import { Button } from '@/components/ui/button';
import { Glass } from '@/components/ui/glass';
import { SectionHeading } from '@/components/ui/section-heading';
import { pricingPage } from '@/lib/content/pages';
import { breadcrumbJsonLd, JsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: pricingPage.meta.title,
  description: pricingPage.meta.description,
  path: '/pricing',
});

/**
 * Pricing.
 *
 * There are deliberately no numbers and no tiers on this page. The business
 * model is not finalised, and publishing invented prices would be the single
 * most damaging thing we could do to trust with early customers - they would
 * find out at the first call. Explaining the two ways of working and offering
 * a straight answer converts better at this stage than a fake price table.
 */
export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Pricing', path: '/pricing' },
        ])}
      />

      <PageHero {...pricingPage.hero} />

      <section className="section-y">
        <div className="container-wr">
          <SectionHeading
            eyebrow="Two ways to work"
            title="Pick how much of it you want to do."
            align="center"
          />

          <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
            {pricingPage.models.map((model) => (
              <Glass key={model.title} className="flex flex-col p-8">
                <h3 className="mb-1.5 text-[22px]">{model.title}</h3>
                <p className="text-muted mb-4 text-[13px] font-semibold tracking-[0.02em] uppercase">
                  {model.forWho}
                </p>
                <p className="mb-6 text-[15px]">{model.body}</p>

                <ul className="mb-8 grid gap-2.5">
                  {model.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className="bg-accent text-accent-contrast mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full"
                      >
                        <Check className="size-2.5" strokeWidth={3.5} />
                      </span>
                      <span className="text-[14px]">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Button href={pricingPage.cta.href} variant="outline" fullWidth withArrow>
                    {pricingPage.cta.label}
                  </Button>
                </div>
              </Glass>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-surface-alt">
        <div className="container-wr max-w-2xl text-center">
          <h2 className="mb-4 text-[clamp(24px,2.8vw,32px)]">{pricingPage.honesty.title}</h2>
          <p className="text-[17px]">{pricingPage.honesty.body}</p>
        </div>
      </section>

      <CtaBand
        title="Tell us the campaign, get a number."
        description="No discovery-call gauntlet. Describe what you are planning and we will come back with real pricing."
        primary={{ label: 'Talk to us', href: '/contact' }}
        secondary={{ label: 'For Brands', href: '/for-brands' }}
      />
    </>
  );
}
