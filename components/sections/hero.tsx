import { Eyebrow } from '@/components/brand/eyebrow';
import { HeroVisual } from '@/components/three/hero-visual';
import { BackgroundLayers } from '@/components/ui/background-layers';
import { Button } from '@/components/ui/button';
import { Highlight } from '@/components/ui/section-heading';
import { hero } from '@/lib/content/home';
import { getSeedCreators } from '@/lib/repositories/memory.adapter';

import { HeroDemo } from './hero-demo';

/**
 * Homepage hero.
 *
 * PERFORMANCE CONTRACT: the h1, subheading and CTAs are plain server-rendered
 * markup with no client dependency, so the Largest Contentful Paint element is
 * text that arrives in the initial HTML. The 3D canvas and the interactive
 * demo hydrate afterwards and must never become the LCP element - see
 * components/three/hero-visual for the gating.
 */
export function Hero() {
  const creators = getSeedCreators();

  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-20 md:pb-28">
      <BackgroundLayers />

      <div className="container-wr grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Eyebrow className="mb-4">{hero.eyebrow}</Eyebrow>

          <h1 className="mb-6 text-[clamp(38px,5.4vw,68px)]">
            {hero.headlineLead} <Highlight>{hero.headlineHighlight}</Highlight>
          </h1>

          <p className="mb-8 max-w-[540px] text-[18px]">{hero.subheadline}</p>

          <div className="mb-9 flex flex-wrap gap-4">
            <Button href={hero.primaryCta.href} size="lg" withArrow>
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} variant="outline" size="lg">
              {hero.secondaryCta.label}
            </Button>
          </div>

          {/* Capability strip, not a statistics strip. These are things the
              platform covers, all of which are verifiable on the site. */}
          <ul className="text-muted flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] font-semibold">
            {hero.trustLine.map((item, i) => (
              <li key={item} className="flex items-center gap-3">
                {i > 0 ? (
                  <span aria-hidden="true" className="bg-border size-1 rounded-full" />
                ) : null}
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* The product demo sits in front of the 3D scene, which is purely
            atmospheric and carries no information of its own. */}
        <div className="relative">
          <HeroVisual />
          <div className="relative">
            <HeroDemo creators={creators} />
          </div>
        </div>
      </div>
    </section>
  );
}
