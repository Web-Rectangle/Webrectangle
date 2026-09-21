import { GetInTouch } from '@/components/sections/get-in-touch';
import { Hero } from '@/components/sections/hero';
import { Offerings } from '@/components/sections/offerings';
import { PullQuote } from '@/components/sections/pull-quote';
import { WorkedWith } from '@/components/sections/worked-with';
import { closingQuote, pullQuote } from '@/lib/content/home';
import { JsonLd, organisationJsonLd } from '@/lib/seo';

/**
 * Homepage.
 *
 * Five sections. The previous version ran to twelve and buried the offer
 * somewhere around the sixth - a visitor deciding whether to contact us does
 * not need the entire product thesis first, they need to know what we do and
 * how to reach us.
 *
 * What we sell is above the fold plus one scroll; everything that explains
 * *how* lives on the dedicated pages and is reached from the footer.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={organisationJsonLd()} />

      <Hero />
      <WorkedWith />
      <PullQuote quote={pullQuote.quote} attribution={pullQuote.attribution} />
      <Offerings />
      <PullQuote quote={closingQuote.quote} attribution={closingQuote.attribution} tone="brand" />
      <GetInTouch />
    </>
  );
}
