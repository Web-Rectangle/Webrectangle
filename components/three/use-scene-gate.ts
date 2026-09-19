'use client';

import { useMemo, useSyncExternalStore } from 'react';

import { useIsMounted } from '@/lib/hooks/use-client-state';

/**
 * Decides whether this visitor should get the WebGL hero at all.
 *
 * THE PRINCIPLE: the 3D scene is atmosphere. It carries no information, so
 * every condition below is a case where the cost outweighs the decoration, and
 * skipping it costs the visitor nothing. The static isometric mark renders
 * instead and is designed to look deliberate on its own.
 *
 * The ladder, in order of how strongly it argues against rendering:
 *   1. prefers-reduced-motion  - an explicit accessibility request
 *   2. no WebGL2               - it simply cannot run
 *   3. viewport under 768px    - phones pay the most and see the least
 *   4. save-data               - the visitor asked us to use less bandwidth
 *   5. deviceMemory under 4 GB - low-end hardware, where jank is likely
 */

type Gate = {
  enabled: boolean;
  /** Why 3D was skipped, for debugging. Null when enabled. */
  reason: string | null;
};

function subscribeToMedia(query: string) {
  return (callback: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', callback);
    return () => mql.removeEventListener('change', callback);
  };
}

/** Subscribes to a media query, SSR-safe. */
function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    useMemo(() => subscribeToMedia(query), [query]),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/**
 * WebGL2 support, probed once per page load and cached.
 *
 * Creating a context is not free, and the answer cannot change during a
 * session, so this must never run on every render. The probe context is
 * explicitly released - browsers cap simultaneous WebGL contexts, and leaking
 * one here could starve the real canvas.
 */
let webgl2Support: boolean | null = null;

function supportsWebGL2(): boolean {
  if (webgl2Support !== null) return webgl2Support;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    webgl2Support = gl !== null;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    webgl2Support = false;
  }

  return webgl2Support;
}

/**
 * Non-standard but widely implemented hints. Both are absent on Safari and
 * Firefox, where we deliberately assume capable hardware rather than
 * pessimistically disabling - a false negative would deny 3D to most desktop
 * Safari users.
 */
type NetworkInformation = { saveData?: boolean };

function prefersLessData(): boolean {
  const nav = navigator as Navigator & { connection?: NetworkInformation };
  return nav.connection?.saveData === true;
}

function hasLowMemory(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4;
}

export function useSceneGate(): Gate {
  const mounted = useIsMounted();
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const wideEnough = useMediaQuery('(min-width: 768px)');

  return useMemo<Gate>(() => {
    // Never render on the server or during the first paint: the LCP heading
    // must land before anything WebGL-related is considered.
    if (!mounted) return { enabled: false, reason: 'not-mounted' };
    if (reducedMotion) return { enabled: false, reason: 'prefers-reduced-motion' };
    if (!wideEnough) return { enabled: false, reason: 'small-viewport' };
    if (prefersLessData()) return { enabled: false, reason: 'save-data' };
    if (hasLowMemory()) return { enabled: false, reason: 'low-memory' };
    if (!supportsWebGL2()) return { enabled: false, reason: 'no-webgl2' };

    return { enabled: true, reason: null };
  }, [mounted, reducedMotion, wideEnough]);
}

/**
 * True while the tab is hidden, so the render loop can be parked.
 *
 * An animating WebGL canvas in a background tab burns battery for nothing.
 * Browsers throttle rAF but do not stop it reliably, so this is handled
 * explicitly.
 */
function subscribeToVisibility(callback: () => void) {
  document.addEventListener('visibilitychange', callback);
  return () => document.removeEventListener('visibilitychange', callback);
}

export function useDocumentHidden(): boolean {
  return useSyncExternalStore(
    subscribeToVisibility,
    () => document.hidden,
    () => false,
  );
}
