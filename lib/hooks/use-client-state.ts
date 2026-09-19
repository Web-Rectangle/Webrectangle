'use client';

import { useSyncExternalStore } from 'react';

/**
 * Hydration-safe subscriptions to browser state.
 *
 * WHY useSyncExternalStore RATHER THAN useState + useEffect: the familiar
 * `const [mounted, setMounted] = useState(false)` pattern calls setState
 * synchronously inside an effect, which triggers a cascading second render and
 * is flagged by React's own lint rules. useSyncExternalStore expresses the
 * same intent directly - "this value comes from outside React, and differs
 * between server and client" - with one render and no effect.
 */

/** Subscription that never fires; the value only differs between snapshots. */
const neverChanges = () => () => {};

/**
 * False during SSR and the first render, true once hydrated.
 *
 * Use to defer rendering anything whose correct value is unknowable on the
 * server, such as the resolved colour theme.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  );
}

function subscribeToScroll(callback: () => void): () => void {
  window.addEventListener('scroll', callback, { passive: true });
  return () => window.removeEventListener('scroll', callback);
}

/** True once the page has scrolled past `threshold` pixels. */
export function useScrolledPast(threshold = 10): boolean {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > threshold,
    () => false,
  );
}

/**
 * True once the visitor has scrolled past `fraction` of the scrollable height.
 *
 * Short pages are excluded: below `minScrollable` any scroll at all reads as a
 * large fraction, which would pop a sticky bar immediately on a near-empty
 * page.
 */
export function useScrolledFraction(fraction: number, minScrollable = 600): boolean {
  return useSyncExternalStore(
    subscribeToScroll,
    () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable < minScrollable) return false;
      return window.scrollY / scrollable > fraction;
    },
    () => false,
  );
}
