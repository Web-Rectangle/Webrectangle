'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useRef } from 'react';

import { Eyebrow } from '@/components/brand/eyebrow';
import { Logo } from '@/components/brand/logo';
import { BackgroundLayers } from '@/components/ui/background-layers';
import { Glass } from '@/components/ui/glass';
import { problem } from '@/lib/content/home';

/**
 * Scatter offsets, in the order the fragments are declared.
 *
 * Hand-picked rather than randomised so the composition is balanced and stable
 * across renders - random values would reshuffle on every hydration and could
 * push a fragment off-screen on narrow viewports. Units are percentages of the
 * element's own size, so the effect scales with the layout.
 */
const SCATTER = [
  { x: -55, y: -40, r: -8 },
  { x: 60, y: -55, r: 6 },
  { x: -70, y: 25, r: 5 },
  { x: 75, y: 15, r: -7 },
  { x: -35, y: 70, r: 9 },
  { x: 45, y: 60, r: -5 },
] as const;

/**
 * The problem section: fragmented tools converging into one system.
 *
 * WHY THE ANIMATION EARNS ITS PLACE: the argument is literally "your workflow
 * is scattered, we bring it together". Showing that as motion communicates it
 * faster than a paragraph, and the interaction is driven by scroll position so
 * the visitor controls the pace rather than waiting through a timed sequence.
 *
 * Transform and opacity only, so everything stays on the compositor. Under
 * prefers-reduced-motion the fragments render pre-assembled, which is the
 * meaningful end state rather than a degraded one.
 */
export function Problem() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // Runs from the section entering the lower third of the viewport to it
    // reaching the middle, so assembly completes while the text is readable.
    offset: ['start 0.85', 'center 0.55'],
  });

  return (
    <section className="section-y defer-paint relative overflow-hidden" ref={ref}>
      <BackgroundLayers fade="y" aurora={false} />

      <div className="container-wr">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Eyebrow className="mb-4">{problem.eyebrow}</Eyebrow>
          <h2 className="text-[clamp(30px,4vw,42px)]">{problem.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-[17px]">{problem.description}</p>
        </div>

        <div className="mx-auto max-w-3xl">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {problem.fragments.map((fragment, i) => (
              <Fragment
                key={fragment}
                label={fragment}
                scatter={SCATTER[i] ?? { x: 0, y: 0, r: 0 }}
                progress={scrollYProgress}
                reduced={Boolean(reduced)}
              />
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-center gap-4">
            <ArrowDown aria-hidden="true" className="text-accent size-5" />

            <Glass className="glass-readable flex w-full flex-col items-center gap-3 px-6 py-7 text-center">
              <Logo asLink={false} size="sm" />
              <p className="text-ink max-w-md text-[17px] font-semibold">{problem.resolution}</p>
            </Glass>
          </div>
        </div>
      </div>
    </section>
  );
}

function Fragment({
  label,
  scatter,
  progress,
  reduced,
}: {
  label: string;
  scatter: { x: number; y: number; r: number };
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  reduced: boolean;
}) {
  // Hooks must run unconditionally, so the motion values are always created
  // and simply ignored when reduced motion is requested.
  const x = useTransform(progress, [0, 1], [`${scatter.x}%`, '0%']);
  const y = useTransform(progress, [0, 1], [`${scatter.y}%`, '0%']);
  const rotate = useTransform(progress, [0, 1], [scatter.r, 0]);
  const opacity = useTransform(progress, [0, 0.35], [0.45, 1]);

  return (
    <motion.li
      style={reduced ? undefined : { x, y, rotate, opacity }}
      className="border-border bg-surface-raised text-body rounded-[var(--r-card)] border px-4 py-3.5 text-center text-[13.5px] font-semibold shadow-[var(--shadow)]"
    >
      {label}
    </motion.li>
  );
}
