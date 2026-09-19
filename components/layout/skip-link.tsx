/**
 * Keyboard escape hatch past the navigation.
 *
 * Visually hidden until focused, then pinned to the top-left. This is the
 * first tab stop on every page and the cheapest meaningful accessibility win
 * available, so it is rendered before anything else in the body.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="bg-accent text-accent-contrast sr-only rounded-[var(--r-btn)] px-4 py-2.5 text-sm font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]"
    >
      Skip to content
    </a>
  );
}
