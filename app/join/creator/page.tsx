import type { Metadata } from 'next';

import { LeadForm } from '@/components/forms/lead-form';
import { PageHero } from '@/components/sections/page-hero';
import { CheckItem } from '@/components/ui/check-item';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Join as a Creator',
  description:
    'Build a WebRectangle creator profile and receive complete campaign briefs from brands in your niche. Free, non-exclusive, no obligation.',
  path: '/join/creator',
});

/**
 * Creator onboarding.
 *
 * The objections a creator actually has - is this exclusive, will you sell my
 * details, will I get spammed - are answered beside the form rather than
 * buried in the terms. Those are the reasons someone abandons this page, so
 * they belong where the decision is made.
 */
export default function JoinCreatorPage() {
  return (
    <>
      <PageHero
        eyebrow="For creators"
        title="Get found by brands in"
        highlight="your niche."
        description="Tell us what you make, where your audience is and what you are open to. We will set up your profile and send briefs that actually fit."
      />

      <section className="pb-20">
        <div className="container-wr grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="mb-5 text-[20px]">Worth knowing</h2>
            <ul className="grid gap-4">
              <CheckItem title="Free and non-exclusive">
                Keep working with anyone else. Nothing here is a lock-in.
              </CheckItem>
              <CheckItem title="Your details stay private">
                We do not sell or share contact details outside a live collaboration.
              </CheckItem>
              <CheckItem title="Decline freely">
                Every brief can be accepted, declined or countered. Declining costs you nothing.
              </CheckItem>
              <CheckItem title="Include your links">
                Add your handles and a couple of recent pieces in the message - it speeds things up.
              </CheckItem>
            </ul>
          </div>

          <LeadForm
            source="creator-waitlist"
            defaultAudience="creator"
            heading="Your creator profile"
          />
        </div>
      </section>
    </>
  );
}
