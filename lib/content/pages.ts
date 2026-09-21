import type { FeatureStatus } from '@/components/ui/status-badge';

/**
 * Copy for every page other than the homepage.
 *
 * Same voice rules as lib/content/home.ts: specific, plain, no invented
 * numbers, and every capability claim carries an honest status.
 */

export const forBrands = {
  meta: {
    title: 'Influencer Marketing for Brands',
    description:
      'Find creators who match your audience, send structured briefs, and track every deliverable from one place.',
  },
  hero: {
    eyebrow: 'For brands',
    title: 'Run the whole campaign',
    highlight: 'from one place.',
    description:
      'Find creators who fit your audience, send briefs they can actually answer, and keep every deliverable and deadline in one view.',
    primaryCta: { label: 'Start a Campaign', href: '/join/brand' },
    secondaryCta: { label: 'Find Creators', href: '/discover' },
  },
  stages: [
    {
      title: 'Define the campaign',
      body: 'Objective, audience, location, platform, budget and deliverables. The brief you fill in once becomes the brief every creator receives.',
      status: 'beta' as FeatureStatus,
    },
    {
      title: 'Discover creators',
      body: 'Filter on niche, audience age and gender split, location, language, follower band and engagement. Not follower count alone.',
      status: 'beta' as FeatureStatus,
    },
    {
      title: 'Shortlist and compare',
      body: 'Save the ones worth approaching and put them side by side on the metrics that decide the call.',
      status: 'beta' as FeatureStatus,
    },
    {
      title: 'Invite to collaborate',
      body: 'Send a structured invitation carrying deliverables, timeline, budget and usage rights. Creators accept, decline or counter.',
      status: 'beta' as FeatureStatus,
    },
    {
      title: 'Manage the work',
      body: 'One workspace per campaign: brief, messages, submissions, approvals and deadlines.',
      status: 'building' as FeatureStatus,
    },
    {
      title: 'Measure and report',
      body: 'What each creator delivered, what it reached and what it cost, without rebuilding a spreadsheet.',
      status: 'building' as FeatureStatus,
    },
  ],
  models: [
    {
      title: 'Self-serve',
      body: 'You discover, shortlist, invite and manage creators yourself. We provide the platform and stay out of the way.',
    },
    {
      title: 'Managed',
      body: 'Our team handles discovery, outreach, negotiation and coordination, and you approve the decisions that matter. Most early brands start here.',
    },
  ],
} as const;

export const forCreators = {
  meta: {
    title: 'Get Discovered by Brands',
    description:
      'Build a creator profile that shows more than follower count, and receive complete campaign briefs from brands in your niche.',
  },
  hero: {
    eyebrow: 'For creators',
    title: 'Get briefs that actually',
    highlight: 'fit your content.',
    description:
      'Build a profile that shows what you actually make and who actually watches it, then receive complete briefs from brands in your niche - not one-line DMs.',
    primaryCta: { label: 'Join as a Creator', href: '/join/creator' },
    secondaryCta: { label: 'How it works', href: '/how-it-works' },
  },
  benefits: [
    {
      title: 'A profile that shows your work',
      body: 'Niche, content type, audience make-up, languages and past collaborations. Follower count is one line, not the headline.',
    },
    {
      title: 'Get found for the right campaigns',
      body: 'Brands filter on what they actually need. A 20K creator with the right audience beats a 200K creator with the wrong one.',
    },
    {
      title: 'Complete briefs, up front',
      body: 'Every invitation arrives with deliverables, timeline, budget and usage rights attached. You can judge it in one read.',
    },
    {
      title: 'Accept, decline or counter',
      body: 'Requesting changes is a first-class response, not an awkward reply. Negotiate scope or fee without starting over.',
    },
    {
      title: 'One place for the work',
      body: 'Brief, messages, submissions and approvals in a single thread instead of three apps.',
    },
    {
      title: 'A collaboration history that travels',
      body: 'Completed campaigns build a track record that makes the next brief easier to win.',
    },
  ],
  promise: {
    title: 'What we will not do',
    points: [
      'Sell or share your contact details outside a live collaboration.',
      'Send you briefs that have nothing to do with what you make.',
      'Publish your rates without your say-so.',
    ],
  },
} as const;

export const howItWorksPage = {
  meta: {
    title: 'How It Works',
    description:
      'The full collaboration lifecycle on WebRectangle, from creator discovery through to campaign reporting - for brands and for creators.',
  },
  hero: {
    eyebrow: 'How it works',
    title: 'Discovery to reporting,',
    highlight: 'one system.',
    description:
      'The same campaign, seen from both sides. Brands run the workflow; creators see only the parts that concern them.',
  },
  brandTrack: {
    title: 'The brand track',
    steps: [
      'Create a campaign and define the brief',
      'Discover creators against your requirements',
      'Shortlist and compare the strongest fits',
      'Send collaboration invitations',
      'Agree scope, timeline and fee',
      'Track deliverables through to publication',
      'Review performance and report',
    ],
  },
  creatorTrack: {
    title: 'The creator track',
    steps: [
      'Build a profile and connect your accounts',
      'Get discovered by brands in your niche',
      'Receive a complete campaign brief',
      'Accept, decline, or request changes',
      'Agree the final scope and fee',
      'Submit content and handle revisions',
      'Build a collaboration history',
    ],
  },
  statusNote:
    'Campaign workspaces and reporting are still being built. Discovery, shortlisting and invitations are what you can use today.',
} as const;

export const aboutPage = {
  meta: {
    title: 'About',
    description:
      'WebRectangle is an early-stage influencer marketing platform founded by Parth Maheshwari and Tarun, building from Noida, India.',
  },
  hero: {
    eyebrow: 'About',
    title: 'A technology company working on',
    highlight: 'influencer marketing.',
    description:
      'Not an agency that built a website. We are building the system we wanted when we were running campaigns out of spreadsheets.',
  },
  whyRectangle: {
    title: 'Why "Rectangle"?',
    body: 'Every interface you have ever used is built from rectangles - the most boring, most structural shape there is. Influencer marketing currently has no structure at all: it lives in DMs, inboxes and untitled spreadsheets. The name is the whole thesis. We are the structure underneath something that currently has none.',
  },
  mission: {
    title: 'Mission',
    body: 'Make influencer marketing a workflow rather than a scramble - so a brand can find the right creators, brief them properly and know what actually worked.',
  },
  vision: {
    title: 'Vision',
    body: 'An operating system for influencer marketing, where discovery, matching, outreach, collaboration, management and analytics are one system rather than seven tools.',
  },
  values: [
    {
      title: 'Relevance over reach',
      body: 'The right 20K creator beats the wrong 200K creator. We build for fit, not for vanity numbers.',
    },
    {
      title: 'Say what is true',
      body: 'We label what is live, what is in beta and what we are still building. We would rather look small than look dishonest.',
    },
    {
      title: 'Creators are users, not inventory',
      body: 'A creator on WebRectangle gets a real product experience and real briefs, not a database row sold to the highest bidder.',
    },
    {
      title: 'Manual before automated',
      body: 'We do things by hand until we understand them well enough to automate them properly.',
    },
  ],
  stage: {
    title: 'Where we are',
    body: 'Early. Creator discovery, shortlisting and collaboration invitations are usable; campaign workspaces, analytics and the AI layer are being built. The creator network is onboarding now, which is why the discovery experience on this site runs on sample profiles.',
  },
} as const;

export const contactPage = {
  meta: {
    title: 'Contact',
    description:
      'Tell us about your campaign or your creator profile. We reply within 24 hours - by email or WhatsApp.',
  },
  hero: {
    eyebrow: 'Contact',
    title: 'Tell us what you are',
    highlight: 'planning.',
    description:
      'Brands, creators or anyone curious. Real replies from the founders, usually the same day and always within 24 hours.',
  },
  responsePromise: 'We reply within 24 hours.',
} as const;
