import type { Metadata } from 'next';

import { Eyebrow } from '@/components/brand/eyebrow';
import { CreatorExplorer } from '@/components/discover/creator-explorer';
import { CtaBand } from '@/components/sections/cta-band';
import { BackgroundLayers } from '@/components/ui/background-layers';
import { Highlight } from '@/components/ui/section-heading';
import { filtersFromSearchParams } from '@/lib/creators/url';
import { getSeedCreators } from '@/lib/repositories/memory.adapter';
import { breadcrumbJsonLd, JsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Discover Creators',
  description:
    'Filter creators by platform, category, location, follower band and engagement. Shortlist the ones that fit your campaign and compare them side by side.',
  path: '/discover',
});

/**
 * Creator discovery.
 *
 * The filter state lives in the URL, so this page reads searchParams and hands
 * the parsed filters to the client explorer as its initial state. A cold load
 * of a shared link therefore renders the right result set server-side rather
 * than flashing everything and then narrowing.
 */
export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const initialFilters = filtersFromSearchParams(params);

  const creators = getSeedCreators();
  const cities = [...new Set(creators.map((c) => c.city))].sort((a, b) => a.localeCompare(b));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Discover Creators', path: '/discover' },
        ])}
      />

      <section className="relative overflow-hidden pt-14 pb-10">
        <BackgroundLayers fade="y" />
        <div className="container-wr max-w-3xl">
          <Eyebrow className="mb-4">Creator discovery</Eyebrow>
          <h1 className="mb-5 text-[clamp(34px,4.6vw,56px)]">
            Search the way you <Highlight>actually brief.</Highlight>
          </h1>
          <p className="text-[18px]">
            Narrow by platform, category, location, follower band and engagement. Shortlist what
            fits, then compare your picks side by side before you reach out.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <CreatorExplorer creators={creators} initialFilters={initialFilters} cities={cities} />
      </section>

      <CtaBand
        title="Want us to build the shortlist for you?"
        description="Tell us the campaign and we will come back with creators worth approaching."
        primary={{ label: 'Talk to us', href: '/contact' }}
        secondary={{ label: 'How it works', href: '/how-it-works' }}
      />
    </>
  );
}
