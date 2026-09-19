'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Two-pixel reading-progress bar pinned under the header.
 *
 * Driven by `useScroll` and smoothed with a spring so it does not jitter on
 * trackpads with momentum. `scaleX` on a transform-only element keeps this off
 * the main thread; animating `width` here would cause layout on every frame.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 36, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="from-brand-400 to-brand-600 fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r"
    />
  );
}
