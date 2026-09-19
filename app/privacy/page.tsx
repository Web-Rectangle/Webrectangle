import type { Metadata } from 'next';

import { LegalPage } from '@/components/sections/legal-page';
import { privacySections } from '@/lib/content/legal';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'What WebRectangle collects, why, and what we do with it. No advertising cookies, no data selling, no third-party enrichment.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="What we collect, why we collect it, and what we will never do with it. Written to be read."
      sections={privacySections}
    />
  );
}
