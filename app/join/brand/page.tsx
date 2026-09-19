import type { Metadata } from 'next';

import { LeadForm } from '@/components/forms/lead-form';
import { PageHero } from '@/components/sections/page-hero';
import { CheckItem } from '@/components/ui/check-item';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Start a Campaign',
  description:
    'Tell us about your campaign - product, audience, platform and budget - and we will come back within 24 hours with creators worth approaching.',
  path: '/join/brand',
});

/**
 * Brand onboarding.
 *
 * Deliberately one form rather than a multi-step wizard. We are pre-launch and
 * a real person reads every submission, so a long structured intake would cost
 * completions to collect fields we would ask about on the call anyway. The
 * wizard makes sense once this is genuinely self-serve.
 */
export default function JoinBrandPage() {
  return (
    <>
      <PageHero
        eyebrow="For brands"
        title="Tell us about your"
        highlight="campaign."
        description="Product, audience, platform and rough budget. That is enough for us to come back with creators worth approaching."
      />

      <section className="pb-20">
        <div className="container-wr grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="mb-5 text-[20px]">What happens next</h2>
            <ul className="grid gap-4">
              <CheckItem title="Within 24 hours">
                A reply from one of the founders, not an autoresponder.
              </CheckItem>
              <CheckItem title="A shortlist, not a pitch deck">
                Creators that match your brief, with the reasoning for each.
              </CheckItem>
              <CheckItem title="A straight price">
                Based on your actual scope. No range designed to get you on a call.
              </CheckItem>
            </ul>
          </div>

          <LeadForm source="brand-waitlist" defaultAudience="brand" heading="Campaign details" />
        </div>
      </section>
    </>
  );
}
