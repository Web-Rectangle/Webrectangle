import { Eyebrow } from '@/components/brand/eyebrow';
import { BackgroundLayers } from '@/components/ui/background-layers';
import { Button } from '@/components/ui/button';
import { Highlight } from '@/components/ui/section-heading';

/**
 * Standard page header for everything except the homepage.
 *
 * Keeps the h1 as plain server-rendered text so it is reliably the Largest
 * Contentful Paint element on every route, and keeps the eyebrow/heading/lede
 * rhythm identical site-wide.
 */
export function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  title: string;
  /** Rendered in the brand highlight box. Use once, at the end of the title. */
  highlight?: string;
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}) {
  return (
    <section className="relative overflow-hidden pt-14 pb-12 md:pt-20 md:pb-16">
      <BackgroundLayers fade="y" />

      <div className="container-wr max-w-3xl">
        <Eyebrow className="mb-4">{eyebrow}</Eyebrow>

        <h1 className="mb-5 text-[clamp(34px,4.6vw,56px)]">
          {title} {highlight ? <Highlight>{highlight}</Highlight> : null}
        </h1>

        <p className="text-[18px]">{description}</p>

        {primaryCta || secondaryCta ? (
          <div className="mt-8 flex flex-wrap gap-4">
            {primaryCta ? (
              <Button href={primaryCta.href} size="lg" withArrow>
                {primaryCta.label}
              </Button>
            ) : null}
            {secondaryCta ? (
              <Button href={secondaryCta.href} variant="outline" size="lg">
                {secondaryCta.label}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
