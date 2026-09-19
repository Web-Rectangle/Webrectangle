'use client';

import { useEffect, useRef } from 'react';

/**
 * Reading-progress bar pinned to the top of the viewport.
 *
 * WHY NOT framer-motion: this is a two-pixel decoration, and importing an
 * animation library into the root layout for it would put ~35 KB gzipped on
 * every page. A scroll listener writing one CSS custom property is smaller,
 * has no hydration cost, and drives a compositor-only `scaleX`.
 *
 * Writes directly to the DOM rather than through React state on purpose: this
 * updates on every scroll frame, and re-rendering the tree that often would be
 * wasteful for something no other component reads.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
      el.style.transform = `scaleX(${progress})`;
    };

    // Coalesce bursts of scroll events into one write per animation frame.
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ transform: 'scaleX(0)' }}
      className="from-brand-400 to-brand-600 fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r will-change-transform"
    />
  );
}
