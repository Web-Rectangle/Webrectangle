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
    'WebRectangle is an influencer marketing platform that helps brands discover the right creators, connect with them, manage collaborations, and measure campaign performance.',
  tagline: 'Find the right creators. Build better campaigns.',
  founders: ['Parth Maheshwari', 'Tarun'],
  contact,
} as const;

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

/**
 * Primary navigation.
 *
 * Deliberately three items. A visitor arriving cold is one of two people - a
 * brand or a creator - and the fastest thing we can do is let them self-select,
 * then hand them the product. Six items made that choice harder, not easier,
 * and pushed the bar wide enough that labels wrapped onto two lines.
 *
 * How It Works, Pricing and Resources are still full pages; they are reached
 * from the footer, from in-page calls to action, and from the command palette.
 * See secondaryNav.
 */
export const primaryNav: readonly NavItem[] = [
  { label: 'For Brands', href: '/for-brands', description: 'Find creators and run campaigns' },
  { label: 'For Creators', href: '/for-creators', description: 'Get discovered by brands' },
  { label: 'Discover Creators', href: '/discover', description: 'Try the discovery experience' },
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
  { label: 'Pricing', href: '/pricing', description: 'How working with us works' },
  { label: 'Resources', href: '/resources', description: 'Guides and playbooks' },
] as const;

export const footerNav: ReadonlyArray<{ heading: string; items: readonly NavItem[] }> = [
  {
    heading: 'Platform',
    items: [
      { label: 'Discover Creators', href: '/discover' },
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Pricing', href: '/pricing' },
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
