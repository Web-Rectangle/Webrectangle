import { Info } from 'lucide-react';
import type { Metadata } from 'next';

import { CtaBand } from '@/components/sections/cta-band';
import { PageHero } from '@/components/sections/page-hero';
import { Glass } from '@/components/ui/glass';
import { SectionHeading } from '@/components/ui/section-heading';
import { howItWorksPage } from '@/lib/content/pages';
import { CAMPAIGN_STATUS_LABEL, CAMPAIGN_STATUSES } from '@/lib/schemas/campaign';
import { breadcrumbJsonLd, JsonLd, pageMetadata } from '@/lib/seo';
import { cn } from '@/lib/utils/cn';

export const metadata: Metadata = pageMetadata({
  title: howItWorksPage.meta.title,
  description: howItWorksPage.meta.description,
  path: '/how-it-works',
});

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'How It Works', path: '/how-it-works' },
        ])}
      />

      <PageHero {...howItWorksPage.hero} />

      <section className="section-y">
        <div className="container-wr grid gap-6 lg:grid-cols-2">
          <Track title={howItWorksPage.brandTrack.title} steps={howItWorksPage.brandTrack.steps} />
          <Track
            title={howItWorksPage.creatorTrack.title}
            steps={howItWorksPage.creatorTrack.steps}
            tone="dark"
          />
        </div>
      </section>

      {/*
        The campaign status pipeline, rendered from the same enum the database
        uses. Showing the real state machine rather than a marketing diagram
        means this can never drift from what the product actually does.
      */}
      <section className="section-y bg-surface-alt">
        <div className="container-wr">
          <SectionHeading
            eyebrow="Campaign states"
            title="Every campaign moves through the same pipeline."
            description="One shared vocabulary for brands and creators, so nobody has to ask where things stand."
            align="center"
          />

          <ol className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2">
            {CAMPAIGN_STATUSES.map((status, i) => (
              <li key={status} className="flex items-center gap-2">
                <span className="border-border bg-surface text-ink rounded-[var(--r-pill)] border px-3.5 py-1.5 text-[13px] font-semibold">
                  {CAMPAIGN_STATUS_LABEL[status]}
                </span>
                {i < CAMPAIGN_STATUSES.length - 1 ? (
                  <span aria-hidden="true" className="text-muted text-[13px]">
                    &rarr;
                  </span>
                ) : null}
              </li>
            ))}
          </ol>

          <Glass className="mx-auto mt-10 flex max-w-2xl items-start gap-3 p-5">
            <Info aria-hidden="true" className="text-accent mt-0.5 size-4 shrink-0" />
            <p className="text-[14px]">{howItWorksPage.statusNote}</p>
          </Glass>
        </div>
      </section>

      <CtaBand
        title="Want to see it on your campaign?"
        description="Tell us what you are planning and we will walk you through it."
        primary={{ label: 'Talk to us', href: '/contact' }}
        secondary={{ label: 'Find Creators', href: '/discover' }}
      />
    </>
  );
}

function Track({
  title,
  steps,
  tone = 'light',
}: {
  title: string;
  steps: readonly string[];
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';

  return (
    <div
      className={cn(
        'rounded-[var(--r-glass)] border p-8 md:p-10',
        dark
          ? 'border-transparent bg-[linear-gradient(140deg,#0A0F1E_0%,#04255A_100%)]'
          : 'border-border bg-accent-softer',
      )}
    >
      <h2 className={cn('mb-7 text-[clamp(22px,2.4vw,28px)]', dark && 'text-white')}>{title}</h2>

      <ol className="grid gap-4">
        {steps.map((step, i) => (
          <li key={step} className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className={cn(
                'mt-px flex size-7 shrink-0 items-center justify-center rounded-[9px] text-[12px] font-extrabold',
                dark ? 'bg-brand-400/20 text-brand-300' : 'bg-accent text-accent-contrast',
              )}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className={cn('text-[15px]', dark ? 'text-white/80' : 'text-ink')}>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
