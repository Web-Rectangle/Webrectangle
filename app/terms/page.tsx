import type { Metadata } from 'next';

import { LegalPage } from '@/components/sections/legal-page';
import { termsSections } from '@/lib/content/legal';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Terms of Service',
  description:
    'The terms covering use of the WebRectangle website, what the platform does today, and what we do not promise.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      description="What this site is, how to use it, and what we do and do not promise."
      sections={termsSections}
    />
  );
}
