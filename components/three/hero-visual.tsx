'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import { IsometricMark } from '@/components/brand/isometric-mark';
import { cn } from '@/lib/utils/cn';

import { useDocumentHidden, useSceneGate } from './use-scene-gate';

/**
 * three plus the R3F reconciler is by far the heaviest thing on this page, and
 * it decorates a backdrop. It is therefore never part of any initial bundle -
 * the import only begins once the gate has approved the device AND the hero is
 * actually on screen.
 */
const HeroScene = dynamic(() => import('./hero-scene'), { ssr: false });

/**
 * Atmospheric backdrop behind the hero demo panel.
 *
 * Two layers. The static isometric mark is server-rendered and always present,
 * so there is never a blank frame and the visual works with JavaScript
 * disabled. On capable devices the WebGL scene fades in over it and the SVG
 * fades out.
 *
 * The SVG is not a degraded state - it is the legacy brand illustration, and on
 * the machines that get it the hero still looks finished. See use-scene-gate
 * for the conditions under which 3D is skipped.
 */
export function HeroVisual() {
  const { enabled } = useSceneGate();
  const hidden = useDocumentHidden();
  const ref = useRef<HTMLDivElement>(null);

  /** Latches once the hero has been seen, so the chunk is fetched only then. */
  const [hasEntered, setHasEntered] = useState(false);
  /** Tracks current visibility, so the render loop can park on scroll-away. */
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setHasEntered(true);
      },
      // Generous margin so the scene is ready slightly before it matters,
      // rather than popping in as the user scrolls back up.
      { rootMargin: '200px 0px', threshold: 0.01 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  const showCanvas = enabled && hasEntered;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 hidden items-center justify-center lg:flex"
    >
      <IsometricMark
        animated={!showCanvas}
        className={cn(
          'max-w-[560px] transition-opacity duration-700',
          showCanvas ? 'opacity-0' : 'opacity-[0.55]',
        )}
      />

      {showCanvas ? (
        <div className="absolute inset-0 animate-[fade-in_.9s_ease-out_both]">
          {/* Paused whenever the tab is backgrounded or the hero is off-screen;
              an animating canvas nobody can see is pure battery drain. */}
          <HeroScene paused={hidden || !inView} />
        </div>
      ) : null}
    </div>
  );
}
