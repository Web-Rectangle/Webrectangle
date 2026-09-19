'use client';

import { motion, useReducedMotion } from 'framer-motion';

type RevealProps = {
  children: React.ReactNode;
  /** Stagger offset in seconds. The legacy site used .07-.10s between siblings. */
  delay?: number;
  /** Direction the element travels from. */
  from?: 'bottom' | 'left' | 'right' | 'none';
  as?: 'div' | 'section' | 'li' | 'article' | 'span';
  className?: string;
};

/** Legacy reveal distance and easing, preserved exactly. */
const DISTANCE = 28;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Scroll-triggered entrance animation.
 *
 * Reimplementation of the legacy `.reveal` / `.reveal.in` IntersectionObserver
 * pattern. The 28px travel, 0.7s duration and cubic-bezier(.22,1,.36,1) easing
 * are carried over unchanged - the cadence of these reveals is a large part of
 * why the old site felt considered, and changing it would make the rebrand
 * read as a different product.
 *
 * `once` prevents re-animation on scroll-back, matching the legacy behaviour
 * of unobserving after the first intersection.
 */
export function Reveal({
  children,
  delay = 0,
  from = 'bottom',
  as = 'div',
  className,
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  // Honour the OS preference by rendering the final state immediately.
  if (reduced) {
    const StaticTag = as;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  const offset =
    from === 'bottom'
      ? { y: DISTANCE }
      : from === 'left'
        ? { x: -DISTANCE }
        : from === 'right'
          ? { x: DISTANCE }
          : {};

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px', amount: 0.12 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}
