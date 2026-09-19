import type { PartnerLogoData } from '@/components/ui/partner-logo';

/**
 * Genuine credibility material. This file is the allowlist.
 *
 * THE RULE: nothing goes in here that did not actually happen. No invented
 * client logos, no written-for-us testimonials, no campaign counts, no
 * satisfaction percentages, no "trusted by 200+ brands". If we do not have
 * proof of something, the site talks about the product and the plan instead.
 *
 * FRAMING CAVEAT: the two testimonials below are real, but they are about
 * digital and social work our team delivered *before* WebRectangle became an
 * influencer marketing platform. Presenting them as praise for the platform
 * would be misleading, so they are confined to /about under a "where we come
 * from" heading with explicit context. Do not move them to the homepage.
 */

/**
 * Organisations the team has genuinely worked with.
 *
 * `src` is null until the real asset files are committed to /public/logos -
 * see the README there. A null src renders a neutral wordmark rather than a
 * broken image, and must never be substituted with a brand we have not worked
 * with.
 */
export const partnerLogos: readonly PartnerLogoData[] = [
  { name: 'MEITY', src: null },
  { name: 'Govt. of Uttar Pradesh', src: null },
  { name: 'MyBigGuide', src: null },
  { name: 'PC School', src: null },
] as const;

export const partnerLogosHeading = 'Teams we have worked with';

export type Testimonial = {
  quote: string;
  role: string;
  organisation: string;
};

/**
 * Verbatim testimonials. Wording and attribution are exactly as given; do not
 * paraphrase, shorten for layout, or attach a photograph.
 */
export const priorWorkTestimonials: readonly Testimonial[] = [
  {
    quote:
      'Web Rectangle has shown commendable dedication in supporting social media management initiatives for the District Administration. Their team maintained a professional approach, ensured timely delivery, and contributed effectively toward enhancing digital engagement and public outreach.',
    role: 'Joint Director (I.T.)',
    organisation:
      'National Informatics Centre (NIC), Ministry of Electronics & Information Technology',
  },
  {
    quote:
      'From planning to execution, Web Rectangle showcased a structured and result-oriented approach. Their team proved to be a reliable technology and digital partner.',
    role: 'E-District Manager',
    organisation: 'District Administration, Govt of Uttar Pradesh',
  },
] as const;

/** Honest context shown immediately above the testimonials on /about. */
export const priorWorkContext =
  'Before WebRectangle became an influencer marketing platform, our team delivered digital and social programmes for government and education organisations. These references are for that earlier work.';
