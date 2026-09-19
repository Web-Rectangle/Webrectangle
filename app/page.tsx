import { AiCapabilities } from '@/components/sections/ai-capabilities';
import { AudienceSplit } from '@/components/sections/audience-split';
import { CtaBand } from '@/components/sections/cta-band';
import { DiscoveryShowcase } from '@/components/sections/discovery-showcase';
import { FaqSection } from '@/components/sections/faq-section';
import { Hero } from '@/components/sections/hero';
import { HowItWorks } from '@/components/sections/how-it-works';
import { InviteToCollaborate } from '@/components/sections/invite-to-collaborate';
import { Problem } from '@/components/sections/problem';
import { Solution } from '@/components/sections/solution';
import { WhyWebRectangle } from '@/components/sections/why-webrectangle';
import { WorkedWith } from '@/components/sections/worked-with';
import { finalCta } from '@/lib/content/home';
import { getSeedCreators } from '@/lib/repositories/memory.adapter';

/**
 * Homepage.
 *
 * Section order answers, in sequence: what is this, who trusts it, what is
 * broken today, how this fixes it, what it looks like, how it works, which
 * half is for me, what makes it different, where AI fits, why you, what about
 * my objections, and what should I do next.
 *
 * Deliberately shorter than the legacy site: the previous version repeated
 * itself across three near-identical card grids, which the redesign brief
 * called out as the main reason the page felt long.
 */
export default function HomePage() {
  const creators = getSeedCreators();

  return (
    <>
      <Hero />
      <WorkedWith />
      <Problem />
      <Solution />
      <DiscoveryShowcase creators={creators} />
      <HowItWorks />
      <AudienceSplit />
      <InviteToCollaborate />
      <AiCapabilities />
      <WhyWebRectangle />
      <FaqSection />
      <CtaBand
        title={finalCta.title}
        description={finalCta.description}
        primary={finalCta.primary}
        secondary={finalCta.secondary}
      />
    </>
  );
}
