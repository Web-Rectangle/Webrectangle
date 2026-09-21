import { BackgroundLayers } from '@/components/ui/background-layers';
import { cn } from '@/lib/utils/cn';

/**
 * Large statement of position.
 *
 * Not a testimonial. We have no client quotes about the platform yet, and
 * inventing them would undo the credibility the rest of the site is built on.
 * A claim you could argue with does more work than a compliment nobody
 * believes - and it costs nothing to stand behind.
 *
 * The attribution line says what the quote *is*, rather than pretending
 * someone said it.
 */
export function PullQuote({
  quote,
  attribution,
  tone = 'light',
}: {
  quote: string;
  attribution: string;
  tone?: 'light' | 'brand';
}) {
  const brand = tone === 'brand';

  return (
    <section
      className={cn(
        'relative overflow-hidden py-20 md:py-28',
        brand && 'from-brand-fill-from to-brand-fill-to bg-gradient-to-br',
      )}
    >
      {brand ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255_/_0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255_/_0.05)_1px,transparent_1px)] bg-[length:40px_40px]"
        />
      ) : (
        <BackgroundLayers fade="y" />
      )}

      <figure className="container-wr relative max-w-4xl text-center">
        <blockquote
          className={cn(
            'text-[clamp(26px,3.6vw,44px)] leading-[1.2] font-extrabold tracking-[-0.02em] text-balance',
            brand ? 'text-white' : 'text-ink',
          )}
        >
          {quote}
        </blockquote>

        <figcaption
          className={cn(
            'mt-6 text-[13px] font-bold tracking-[0.1em] uppercase',
            brand ? 'text-white/70' : 'text-muted',
          )}
        >
          {attribution}
        </figcaption>
      </figure>
    </section>
  );
}
