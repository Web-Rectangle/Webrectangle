'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { SectionHeading } from '@/components/ui/section-heading';
import { howItWorks } from '@/lib/content/home';

/**
 * The five-step lifecycle, revealed as the visitor scrolls.
 *
 * The legacy site drew a dashed line between process steps; here that line
 * fills with the brand gradient in step with scroll progress, so the visual
 * reinforces that these stages are one connected pipeline rather than five
 * separate services.
 *
 * The connector is horizontal on desktop and vertical on mobile, because a
 * five-column row on a phone would reduce each step to two words.
 */
export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.6'],
  });

  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="section-y defer-paint">
      <div className="container-wr" ref={ref}>
        <SectionHeading eyebrow={howItWorks.eyebrow} title={howItWorks.title} align="center" />

        <div className="relative">
          {/* Connector track. Inset so it starts and ends at the first and
              last step markers rather than the container edges. */}
          <div
            aria-hidden="true"
            className="bg-border absolute top-5 left-[10%] hidden h-0.5 w-[80%] lg:block"
          >
            <motion.div
              style={reduced ? { width: '100%' } : { width: fill }}
              className="from-brand-400 to-brand-600 h-full bg-gradient-to-r"
            />
          </div>

          <div
            aria-hidden="true"
            className="bg-border absolute top-4 bottom-4 left-5 w-0.5 lg:hidden"
          >
            <motion.div
              style={reduced ? { height: '100%' } : { height: fill }}
              className="from-brand-400 to-brand-600 w-full bg-gradient-to-b"
            />
          </div>

          <ol className="relative grid gap-8 lg:grid-cols-5 lg:gap-6">
            {howItWorks.steps.map((step, i) => (
              <Step
                key={step.number}
                step={step}
                index={i}
                progress={scrollYProgress}
                reduced={Boolean(reduced)}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Step({
  step,
  index,
  progress,
  reduced,
}: {
  step: { number: string; title: string; body: string };
  index: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  reduced: boolean;
}) {
  // Each marker activates as the fill line reaches it. Five steps, so the
  // thresholds sit at even fifths with a short ramp.
  const start = index / 5;
  const activeOpacity = useTransform(progress, [start, start + 0.08], [0.35, 1]);
  const activeScale = useTransform(progress, [start, start + 0.08], [0.9, 1]);

  return (
    <li className="flex gap-5 lg:flex-col lg:gap-0 lg:text-center">
      <motion.span
        style={reduced ? undefined : { opacity: activeOpacity, scale: activeScale }}
        className="from-brand-500 to-brand-700 text-accent-contrast z-10 flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br text-[13px] font-extrabold shadow-[0_8px_20px_rgb(1_101_251_/_0.3)] lg:mx-auto"
      >
        {step.number}
      </motion.span>

      <div className="lg:mt-5">
        <h3 className="mb-1.5 text-[19px]">{step.title}</h3>
        <p className="text-[14.5px]">{step.body}</p>
      </div>
    </li>
  );
}
