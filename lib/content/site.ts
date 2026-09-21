import type { FeatureStatus } from '@/components/ui/status-badge';
import { contact } from '@/lib/env';

/**
 * Site-wide copy and navigation.
 *
 * ALL user-facing strings live under lib/content. Nothing is hardcoded in JSX.
 * This keeps copy edits away from markup, makes the brand voice reviewable in
 * one place, and leaves the door open for localisation without a refactor.
 */

export const site = {
  name: 'WebRectangle',
  /** The one-line answer to "what is WebRectangle?" - used in metadata and JSON-LD. */
  description:
    'WebRectangle runs influencer marketing and talent management - connecting brands with creators who fit, managing the collaboration end to end, and measuring what the campaign actually did.',
  tagline: 'Find the right creators. Build better campaigns.',
  founders: ['Parth Maheshwari', 'Tarun'],
  contact,
} as const;

export type NavItem = {
  label: string;
  href: string;
  description?: string;
  /**
   * Marks a destination that is not fully live yet. Rendered as a small pill
   * beside the label so a visitor knows before they click, rather than working
   * it out once they are on the page.
   */
  status?: FeatureStatus;
};

/**
 * Primary navigation.
 *
 * Deliberately three items. A visitor arriving cold is one of two people - a
 * brand or a creator - and the fastest thing we can do is let them self-select,
 * then hand them the product. Six items made that choice harder, not easier,
 * and pushed the bar wide enough that labels wrapped onto two lines.
 *
 * How It Works, Resources and About are still full pages; they are reached
 * from the footer, from in-page calls to action, and from the command palette.
 * See secondaryNav.
 */
export const primaryNav: readonly NavItem[] = [
  { label: 'For Brands', href: '/for-brands', description: 'Find creators and run campaigns' },
  { label: 'For Creators', href: '/for-creators', description: 'Get discovered by brands' },
  {
    label: 'Discover Creators',
    href: '/discover',
    description: 'Try the discovery experience',
    // Runs on illustrative sample profiles while the real creator network is
    // onboarded, so it is flagged in the nav rather than only on the page.
    status: 'building',
  },
] as const;

/**
 * Real pages kept out of the top navigation.
 *
 * Not lesser content - these are reached once someone already knows what
 * WebRectangle is, which is a different moment from the first five seconds the
 * header has to serve. Indexed by the command palette and listed in the footer
 * so nothing here becomes orphaned.
 */
export const secondaryNav: readonly NavItem[] = [
  { label: 'How It Works', href: '/how-it-works', description: 'Discovery through measurement' },
  { label: 'Resources', href: '/resources', description: 'Guides and playbooks' },
  { label: 'About', href: '/about', description: 'Who we are and why' },
] as const;

export const footerNav: ReadonlyArray<{ heading: string; items: readonly NavItem[] }> = [
  {
    heading: 'What we do',
    items: [
      { label: 'Influencer Marketing', href: '/#offerings' },
      { label: 'Talent Management', href: '/#offerings' },
      { label: 'Discover Creators', href: '/discover' },
      { label: 'How It Works', href: '/how-it-works' },
    ],
  },
  {
    heading: 'For Brands',
    items: [
      { label: 'Overview', href: '/for-brands' },
      { label: 'Start a Campaign', href: '/join/brand' },
      { label: 'Talk to us', href: '/contact' },
    ],
  },
  {
    heading: 'For Creators',
    items: [
      { label: 'Overview', href: '/for-creators' },
      { label: 'Join as a Creator', href: '/join/creator' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { label: 'About', href: '/about' },
      { label: 'Resources', href: '/resources' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
] as const;

/** Prefilled WhatsApp deeplink. Also used as the zero-config lead fallback. */
export function whatsappLink(message = "Hi WebRectangle! I'd like to know more."): string {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
