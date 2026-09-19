import { Check } from 'lucide-react';

import { Eyebrow } from '@/components/brand/eyebrow';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { audiences } from '@/lib/content/home';
import { cn } from '@/lib/utils/cn';

/**
 * Side-by-side entry points for the two audiences.
 *
 * WHY THE PANELS LOOK DIFFERENT: brands and creators are both first-class
 * users, and a visitor should be able to tell within a glance which half is
 * theirs. Identical cards would force them to read both. The brands panel is
 * light and the creators panel is inverted, so the split is legible
 * peripherally, before any text is processed.
 */
export function AudienceSplit() {
  return (
    <section className="section-y defer-paint">
      <div className="container-wr grid gap-6 lg:grid-cols-2">
        <Reveal from="left">
          <Panel
            eyebrow={audiences.brands.eyebrow}
            title={audiences.brands.title}
            points={audiences.brands.points}
            cta={audiences.brands.cta}
            tone="light"
          />
        </Reveal>

        <Reveal from="right" delay={0.08}>
          <Panel
            eyebrow={audiences.creators.eyebrow}
            title={audiences.creators.title}
            points={audiences.creators.points}
            cta={audiences.creators.cta}
            tone="dark"
          />
        </Reveal>
      </div>
    </section>
  );
}

function Panel({
  eyebrow,
  title,
  points,
  cta,
  tone,
}: {
  eyebrow: string;
  title: string;
  points: readonly string[];
  cta: { label: string; href: string };
  tone: 'light' | 'dark';
}) {
  const dark = tone === 'dark';

  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-[var(--r-glass)] border p-8 md:p-10',
        dark
          ? 'border-transparent bg-[linear-gradient(140deg,#0A0F1E_0%,#04255A_100%)]'
          : 'border-border bg-accent-softer',
      )}
    >
      <Eyebrow className={cn('mb-4', dark && 'text-brand-300')}>{eyebrow}</Eyebrow>

      <h2 className={cn('mb-6 text-[clamp(24px,2.6vw,30px)]', dark && 'text-white')}>{title}</h2>

      <ul className="mb-8 grid gap-3">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className={cn(
                'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full',
                dark ? 'bg-brand-400/20 text-brand-300' : 'bg-accent text-accent-contrast',
              )}
            >
              <Check className="size-3" strokeWidth={3} />
            </span>
            <span className={cn('text-[14.5px]', dark && 'text-white/75')}>{point}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <Button href={cta.href} variant={dark ? 'white' : 'primary'} withArrow>
          {cta.label}
        </Button>
      </div>
    </div>
  );
}
