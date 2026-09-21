import type { FeatureStatus } from '@/components/ui/status-badge';

/**
 * Homepage copy.
 *
 * VOICE: clear, modern, confident, human. Short sentences, specific benefits,
 * real examples. No corporate jargon, no invented numbers, no superlatives we
 * cannot evidence. Capability claims carry an honest status.
 *
 * STRUCTURE: the page is deliberately short - hero, offerings, a pull quote
 * and a way to get in touch. An early-stage company earns attention with a
 * clear proposition and a fast route to a conversation, not with twelve
 * scrolling sections.
 */

export const hero = {
  eyebrow: 'Influencer marketing',
  headlineLead: 'Find the right creators.',
  // The newline is load-bearing, not formatting: <Highlight> uses
  // `white-space: pre-line` so the explicit break lets the box shrink to the
  // longest line instead of stretching to the full column width.
  headlineHighlight: 'Build better\ncampaigns.',
  subheadline:
    'We connect brands with creators who actually fit, manage the collaboration end to end, and show you what the campaign really did.',
  primaryCta: { label: 'I am a brand', href: '/join/brand' },
  secondaryCta: { label: 'I am a creator', href: '/join/creator' },
  trustLine: ['Instagram', 'YouTube', 'Discovery', 'Campaigns', 'Analytics'],
} as const;

export type Offering = {
  title: string;
  tagline: string;
  body: string;
  points: readonly string[];
  status: FeatureStatus;
  icon: 'search' | 'users' | 'link';
};

export const offerings = {
  eyebrow: 'Our offerings',
  title: 'What we do.',
  description:
    'Two things we run today, and one we are building because every brand we speak to asks for it.',
  items: [
    {
      title: 'Influencer marketing',
      tagline: 'Reach real audiences through creators they already trust',
      body: 'We find creators who match your audience rather than just your budget, handle the outreach and negotiation, and run the campaign through to delivery.',
      points: [
        'Creator discovery matched to your brief',
        'Outreach, negotiation and contracting',
        'Full campaign management',
        'Reporting you can act on',
      ],
      status: 'live',
      icon: 'search',
    },
    {
      title: 'Talent management',
      tagline: 'End-to-end support for creators building a career',
      body: 'We represent creators properly: finding the right brand partnerships, negotiating terms that hold up, and handling the admin so they can keep making things.',
      points: [
        'Brand partnership sourcing',
        'Deal negotiation and contracts',
        'Campaign coordination',
        'Long-term career strategy',
      ],
      status: 'live',
      icon: 'users',
    },
    {
      title: 'Link tracking',
      tagline: 'Know which creator actually drove the result',
      body: 'Trackable links issued per creator, so clicks, traffic and conversions are attributed to the person who earned them instead of disappearing into a single campaign total.',
      points: [
        'A unique tracked link per creator',
        'Clicks and traffic attributed individually',
        'Conversion tracking',
        'Per-creator performance comparison',
      ],
      status: 'building',
      icon: 'link',
    },
  ] satisfies readonly Offering[],
} as const;

/**
 * Pull quotes.
 *
 * Statements of what we believe, not testimonials. We are pre-launch and have
 * no client quotes about the platform, and inventing some would be the fastest
 * way to lose the trust this whole site is built on. A position you could
 * disagree with carries more weight than a fabricated compliment anyway.
 */
export const pullQuote = {
  quote: 'The right creator with 20,000 followers beats the wrong one with 200,000.',
  attribution: 'How we pick every creator we put in front of a brand',
} as const;

export const closingQuote = {
  quote: 'Influencer marketing should not live in DMs, inboxes and spreadsheets.',
  attribution: 'Why we are building WebRectangle',
} as const;

export const getInTouch = {
  eyebrow: 'Get in touch',
  title: 'Tell us which one you are.',
  description:
    'Brands and creators want different things from us, so pick your side and we will reply within 24 hours.',
  brand: {
    label: 'I am a brand',
    href: '/join/brand',
    body: 'Looking for creators for a campaign.',
  },
  creator: {
    label: 'I am an influencer / creator',
    href: '/join/creator',
    body: 'Looking for brand partnerships.',
  },
} as const;
