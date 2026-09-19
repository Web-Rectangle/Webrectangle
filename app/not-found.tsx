import type { Metadata } from 'next';
import Link from 'next/link';

import { IsometricMark } from '@/components/brand/isometric-mark';
import { BackgroundLayers } from '@/components/ui/background-layers';
import { Button } from '@/components/ui/button';
import { primaryNav } from '@/lib/content/site';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

/**
 * 404.
 *
 * Offers the actual navigation rather than a lone "go home" button - someone
 * who followed a broken link usually wants a specific thing, and a list of
 * destinations recovers the visit better than bouncing them to the homepage.
 */
export default function NotFound() {
  return (
    <div className="relative flex min-h-[70dvh] items-center overflow-hidden py-20">
      <BackgroundLayers />

      <div className="container-wr grid items-center gap-14 lg:grid-cols-[1fr_0.7fr]">
        <div>
          <p className="text-accent mb-3 text-[13px] font-bold tracking-[0.12em] uppercase">404</p>
          <h1 className="mb-4 text-[clamp(34px,4.6vw,52px)]">This page does not exist.</h1>
          <p className="mb-8 max-w-md text-[17px]">
            The link may be out of date, or we may have moved something. Here is everything else.
          </p>

          <div className="mb-10 flex flex-wrap gap-4">
            <Button href="/" withArrow>
              Back to home
            </Button>
            <Button href="/contact" variant="outline">
              Tell us what broke
            </Button>
          </div>

          <nav aria-label="Site sections">
            <ul className="flex flex-wrap gap-x-6 gap-y-2.5">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-accent text-[14.5px] font-semibold transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div aria-hidden="true" className="hidden justify-self-center lg:block">
          <IsometricMark variant="compact" className="max-w-[280px] opacity-70" />
        </div>
      </div>
    </div>
  );
}
