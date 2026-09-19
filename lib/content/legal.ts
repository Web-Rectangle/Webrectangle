import { site } from './site';

/**
 * Privacy and terms copy.
 *
 * NOT LEGAL ADVICE. These are written in plain English and describe what the
 * product actually does today, which is more useful to a visitor than
 * boilerplate copied from a template that describes things we do not do.
 * Have a lawyer review before any material launch, particularly around India's
 * DPDP Act obligations once real personal data is being processed at volume.
 */

export const LAST_UPDATED = '19 September 2026';

export type LegalSection = { heading: string; paragraphs: readonly string[] };

export const privacySections: readonly LegalSection[] = [
  {
    heading: 'What this covers',
    paragraphs: [
      `This policy explains what ${site.name} collects when you use this website, why we collect it, and what we do with it. It is written to be read, not to be skimmed past.`,
    ],
  },
  {
    heading: 'What we collect',
    paragraphs: [
      'When you submit a form: your name, email address, and optionally your company, phone number and whatever you write in the message field. That is the only personal data this website collects directly.',
      'We do not use advertising cookies, tracking pixels, or third-party marketing scripts. If analytics is enabled on this site it is cookieless and aggregate - page paths and referrers, never individuals.',
    ],
  },
  {
    heading: 'Why we collect it',
    paragraphs: [
      'To reply to you, and to run any campaign we go on to work on together. That is the entire purpose. We do not build advertising profiles and we do not enrich your details against third-party databases.',
    ],
  },
  {
    heading: 'Who else sees it',
    paragraphs: [
      'Our email provider and internal messaging tools, because that is how a submission reaches a human. Our hosting provider, because the site runs on their infrastructure.',
      'We do not sell personal data. We do not share creator contact details with brands outside a live collaboration that the creator has accepted.',
    ],
  },
  {
    heading: 'Creator data',
    paragraphs: [
      'If you join as a creator, the profile information you give us is shown to brands searching on the platform. Your contact details are not - a brand reaches you through a collaboration invitation, and you decide whether to respond.',
      'The creator profiles currently shown in the discovery experience on this website are illustrative samples we created to demonstrate the product. They are not real people.',
    ],
  },
  {
    heading: 'How long we keep it',
    paragraphs: [
      'Enquiries are kept while there is an active conversation and for a reasonable period afterwards. Ask us to delete your data and we will, unless we are legally required to retain it.',
    ],
  },
  {
    heading: 'Your rights',
    paragraphs: [
      `You can ask what we hold about you, ask us to correct it, or ask us to delete it. Email ${site.contact.email} and a person will action it.`,
    ],
  },
  {
    heading: 'Changes',
    paragraphs: [
      'If this policy changes materially, we will update the date at the top. We will not quietly broaden what we do with your data.',
    ],
  },
];

export const termsSections: readonly LegalSection[] = [
  {
    heading: 'About these terms',
    paragraphs: [
      `These terms cover use of the ${site.name} website. Separate written terms govern any paid campaign or managed service - those are agreed before work starts, not buried here.`,
    ],
  },
  {
    heading: 'What this website is',
    paragraphs: [
      `${site.name} is an early-stage influencer marketing platform. Parts of the product are live, parts are in beta, and parts are still being built. We label which is which on the pages themselves.`,
      'The creator profiles in the discovery experience are illustrative samples created to demonstrate the product, and are clearly marked as such. Nothing shown there should be treated as a representation about a real creator, their audience, or their availability.',
    ],
  },
  {
    heading: 'Using the site',
    paragraphs: [
      'Use it for its intended purpose. Do not attempt to scrape it at volume, disrupt it, or probe it for vulnerabilities without telling us first - if you find something, email us and we will be grateful.',
    ],
  },
  {
    heading: 'Brands and creators',
    paragraphs: [
      'A collaboration is an agreement between a brand and a creator. Where we operate a managed service we act as an intermediary and coordinate the work, but the commercial arrangement and the content itself remain between those two parties.',
      'Creators are responsible for disclosing paid partnerships as required by the ASCI guidelines and any other applicable advertising rules.',
    ],
  },
  {
    heading: 'What we do not promise',
    paragraphs: [
      'We do not guarantee campaign outcomes. Reach, engagement and conversion depend on the creator, the content, the product and the platform algorithm, and anyone who guarantees numbers on those is guessing.',
      'Where we surface engagement-quality signals, they are indicators for your judgement, not verdicts. We do not claim to definitively detect fake followers or fraud.',
    ],
  },
  {
    heading: 'Our content',
    paragraphs: [
      `The ${site.name} name, logo, site design and written content belong to us. Campaign content created by a creator belongs to whoever the collaboration agreement says it belongs to.`,
    ],
  },
  {
    heading: 'Liability',
    paragraphs: [
      'This website is provided as-is. To the extent the law allows, we are not liable for indirect or consequential loss arising from its use. Nothing here limits liability that cannot legally be limited.',
    ],
  },
  {
    heading: 'Governing law and contact',
    paragraphs: [
      `These terms are governed by the laws of India, with courts in Uttar Pradesh having jurisdiction. Questions go to ${site.contact.email}.`,
    ],
  },
];
