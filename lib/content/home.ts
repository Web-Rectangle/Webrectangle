import type { FeatureStatus } from '@/components/ui/status-badge';

/**
 * Homepage copy.
 *
 * VOICE: clear, modern, confident, human. Short sentences, specific benefits,
 * real examples. No corporate jargon, no "10X your growth", no invented
 * numbers. Every capability claim carries an honest status.
 */

export const hero = {
  eyebrow: 'Influencer marketing platform',
  headlineLead: 'Find the right creators.',
  // The newline is load-bearing, not formatting: <Highlight> uses
  // `white-space: pre-line` so the explicit break lets the box shrink to the
  // longest line instead of stretching to the full column width.
  headlineHighlight: 'Build better\ncampaigns.',
  subheadline:
    'Discover relevant creators, send structured collaboration invites, manage the work and measure what actually performed - in one place.',
  primaryCta: { label: 'Find Creators', href: '/discover' },
  secondaryCta: { label: 'Join as a Creator', href: '/join/creator' },
  trustLine: ['Instagram', 'YouTube', 'Discovery', 'Outreach', 'Campaigns', 'Analytics'],
} as const;

export const problem = {
  eyebrow: 'The problem',
  title: "Influencer marketing shouldn't live in 14 browser tabs.",
  description:
    'Most teams run campaigns across DMs, inboxes and spreadsheets. Nothing is connected, so nothing is measurable.',
  /** The scattered tools that snap together on scroll. */
  fragments: [
    'Instagram DMs',
    'Email threads',
    'WhatsApp groups',
    'Google Sheets',
    'Manual research',
    'Screenshot analytics',
  ],
  resolution: 'WebRectangle brings the whole workflow into one place.',
} as const;

export type SolutionPillar = {
  title: string;
  outcome: string;
  status: FeatureStatus;
  icon: 'search' | 'send' | 'layers' | 'chart';
};

export const solution = {
  eyebrow: 'The platform',
  title: 'One workflow, end to end.',
  description:
    'Four connected stages instead of four disconnected tools. Each one feeds the next, so context is never re-entered.',
  pillars: [
    {
      title: 'Discovery',
      outcome: 'Filter by niche, audience, location and engagement - not follower count alone.',
      status: 'beta',
      icon: 'search',
    },
    {
      title: 'Outreach and invites',
      outcome: 'Send a structured brief with deliverables, timeline and budget attached.',
      status: 'beta',
      icon: 'send',
    },
    {
      title: 'Campaign management',
      outcome: 'Track every creator, deliverable and deadline in one workspace.',
      status: 'building',
      icon: 'layers',
    },
    {
      title: 'Analytics and reporting',
      outcome: 'See what each creator actually delivered, without rebuilding a spreadsheet.',
      status: 'building',
      icon: 'chart',
    },
  ] satisfies readonly SolutionPillar[],
} as const;

export const discovery = {
  eyebrow: 'Creator discovery',
  title: 'Search the way you actually brief.',
  description:
    'Narrow by platform, category, location, audience and engagement. Shortlist what fits, invite when you are ready.',
  exampleQuery: 'Find 20 Instagram fitness creators in Delhi NCR with 20K-100K followers.',
  naturalLanguage: {
    status: 'building' as FeatureStatus,
    title: 'Natural-language search',
    body: 'Describe the campaign in a sentence and get structured filters back. In development - the filters below work today.',
  },
} as const;

export const howItWorks = {
  eyebrow: 'How it works',
  title: 'Five steps, one system.',
  steps: [
    { number: '01', title: 'Discover', body: 'Find creators that fit your campaign requirements.' },
    { number: '02', title: 'Shortlist', body: 'Save and compare the ones worth approaching.' },
    {
      number: '03',
      title: 'Connect',
      body: 'Send a structured invitation and talk in one thread.',
    },
    {
      number: '04',
      title: 'Collaborate',
      body: 'Agree the brief, track deliverables and deadlines.',
    },
    { number: '05', title: 'Measure', body: 'See what each creator delivered and what it cost.' },
  ],
} as const;

export const audiences = {
  brands: {
    eyebrow: 'For brands',
    title: 'Run the whole campaign from one place.',
    points: [
      'Find creators who match your audience, not just your budget',
      'Compare shortlisted creators side by side',
      'Send briefs with deliverables and timelines attached',
      'Track every deliverable without chasing DMs',
    ],
    cta: { label: 'Start a Campaign', href: '/for-brands' },
  },
  creators: {
    eyebrow: 'For creators',
    title: 'Get briefs that actually fit your content.',
    points: [
      'Build a profile that shows more than follower count',
      'Get found by brands in your niche and city',
      'Receive complete briefs, not one-line DMs',
      'Accept, decline or request changes - your call',
    ],
    cta: { label: 'Join as a Creator', href: '/for-creators' },
  },
} as const;

export const invite = {
  eyebrow: 'Invite to collaborate',
  title: 'A real brief, not a cold DM.',
  description:
    'Every invitation carries the campaign, deliverables, timeline, budget and usage rights up front. The creator has everything needed to give a straight answer.',
  /**
   * Illustrative invitation shown in the UI. Clearly a sample - the brand and
   * campaign are invented and labelled as such in the component.
   */
  sample: {
    brand: 'Sample D2C skincare brand',
    campaign: 'Winter range launch',
    deliverables: '2 Reels + 3 Stories',
    timeline: '3 weeks',
    budget: 'Shared in the invite',
    usageRights: '30 days paid usage',
  },
  responses: [
    { key: 'accepted', label: 'Accept', body: 'Moves straight into a shared campaign workspace.' },
    {
      key: 'changes-requested',
      label: 'Request changes',
      body: 'Counter on scope, timeline or fee without starting over.',
    },
    { key: 'rejected', label: 'Decline', body: 'One tap, no awkward follow-up needed.' },
  ],
} as const;

export const ai = {
  eyebrow: 'AI',
  title: 'AI that does the boring parts.',
  description:
    'Narrowing a list, drafting a first message, summarising a report. The judgement stays with you.',
  principle: 'AI narrows the field. You make the call.',
  capabilities: [
    {
      title: 'Natural-language search',
      body: 'Turn "premium skincare, women 18-30, metros" into structured filters.',
      status: 'building' as FeatureStatus,
    },
    {
      title: 'Creator-campaign matching',
      body: 'Rank a shortlist on fit across niche, audience, location and past work.',
      status: 'building' as FeatureStatus,
    },
    {
      title: 'Outreach drafting',
      body: 'A first-pass message per creator, personalised from their content. You edit before it sends.',
      status: 'building' as FeatureStatus,
    },
    {
      title: 'Quality signals',
      body: 'Flag engagement patterns worth a closer look. Signals and risk indicators, never verdicts.',
      status: 'building' as FeatureStatus,
    },
  ],
} as const;

export const why = {
  eyebrow: 'Why WebRectangle',
  title: 'Built around relevance, not reach.',
  points: [
    {
      title: 'Relevance over reach',
      body: 'Matching is on niche, audience and location. Follower count is one input, not the answer.',
    },
    {
      title: 'Structured outreach',
      body: 'Every approach carries the full brief, so creators can decide properly and faster.',
    },
    {
      title: 'One workflow, end to end',
      body: 'Discovery through reporting in one system, so nothing is retyped and nothing is lost.',
    },
  ],
} as const;

export const faq = {
  eyebrow: 'FAQ',
  title: 'Questions, answered straight.',
  items: [
    {
      q: 'How does creator discovery work?',
      a: 'You filter by platform, category, location, follower band, engagement and audience profile, then shortlist the creators worth approaching. The discovery experience on this site runs on illustrative sample profiles while we onboard our creator network.',
    },
    {
      q: 'Which platforms do you cover?',
      a: 'Instagram and YouTube at launch. We would rather do two platforms properly than list six and cover them thinly. Others follow based on what brands and creators actually ask for.',
    },
    {
      q: 'Can I run campaigns myself, or do you manage them?',
      a: 'Both. Self-serve means you discover, invite and manage creators yourself. Managed means our team handles discovery, outreach and coordination for you. Most early brands start managed and move to self-serve.',
    },
    {
      q: 'How are creators vetted?',
      a: 'Creators build a profile and connect their accounts, and our team reviews each one before it goes live. We surface engagement-quality signals where the data supports it, but we do not claim to definitively detect fake followers - nobody honestly can.',
    },
    {
      q: 'What does it cost?',
      a: 'We are in early access and pricing directly with our first brands rather than publishing tiers we would have to change. Tell us about your campaign and you will get a straight number.',
    },
    {
      q: 'What happens to my data?',
      a: 'Campaign and contact data is used to run your campaigns and nothing else. We do not sell data, and we do not share creator contact details outside a live collaboration. Full detail is in the privacy policy.',
    },
    {
      q: 'How do I get started?',
      a: 'Brands: tell us about your campaign and we will come back within 24 hours. Creators: build a profile and you are in the pool for relevant briefs. Neither costs anything to start.',
    },
  ],
} as const;

export const finalCta = {
  title: 'Ready to find your creators?',
  description: 'Tell us about the campaign. We reply within 24 hours.',
  primary: { label: 'Find Creators', href: '/discover' },
  secondary: { label: 'Talk to us', href: '/contact' },
} as const;
